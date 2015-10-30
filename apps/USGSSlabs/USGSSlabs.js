/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: USGSSlabs.js$
 */
define(['../../src/WorldWind',
        '../util/GoToBox',
        '../util/LayersPanel',
        '../util/ProjectionMenu',
        '../util/TerrainOpacityController'],
    function (ww,
              GoToBox,
              LayersPanel,
              ProjectionMenu,
              TerrainOpacityController) {
        "use strict";

        var USGSSlabs = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Create the World Window.
            this.wwd = new WorldWind.WorldWindow("canvasOne");

            /**
             * Added imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
                {layer: new WorldWind.TectonicPlatesLayer(null), enabled: true},
                {layer: new WorldWind.CompassLayer(), enabled: true, hide: true},
                {layer: new WorldWind.CoordinatesDisplayLayer(this.wwd), enabled: true, hide: true},
                {layer: new WorldWind.ViewControlsLayer(this.wwd), enabled: true, hide: true}
            ];

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                layers[l].layer.hide = layers[l].hide;
                this.wwd.addLayer(layers[l].layer);
            }

            // Enable sub-surface rendering for the World Window.
            this.wwd.subsurfaceMode = true;
            // Enable deep picking in order to detect the sub-surface shapes.
            this.wwd.deepPicking = true;

            // Start the view pointing to a longitude within the current time zone.
            this.wwd.navigator.lookAtLocation.latitude = 30;
            this.wwd.navigator.lookAtLocation.longitude = -(180 / 12) * ((new Date()).getTimezoneOffset() / 60);

            this.goToBox = new GoToBox(this.wwd);
            this.layersPanel = new LayersPanel(this.wwd);
            this.projectionMenu = new ProjectionMenu(this.wwd);
            this.terrainOpacityController = new TerrainOpacityController(this.wwd);

            this.layersPanel.synchronizeLayerList();

            this.loadSlabData("CAS", "cascadia_slab1.0_clip.xyz", 401, WorldWind.Color.YELLOW);
            //this.loadSlabData("SOL", "sol_slab1.0_clip.xyz", 1001, WorldWind.Color.YELLOW);
            //this.loadSlabData("MEX", "mex_slab1.0_clip.xyz", 1251, WorldWind.Color.CYAN);
            //this.loadSlabData("ALU", "alu_slab1.0_clip.xyz", 2451, WorldWind.Color.MAGENTA);

            var wwd = this.wwd;
            var handlePick = function (o) {
                var pickPoint = wwd.canvasCoordinates(o.clientX, o.clientY);

                var pickList = wwd.pick(pickPoint);
                if (pickList.objects.length > 0) {
                    for (var p = 0; p < pickList.objects.length; p++) {
                        var pickedObject = pickList.objects[p];
                        if (pickedObject.userObject instanceof WorldWind.TriangleMesh) {
                            if (pickedObject.position) {
                                console.log("PO: " + pickedObject.position.toString() + " " + pickedObject.isOnTop);
                                console.log("TN: " + pickList.terrainObject().position.toString() +
                                    " " + pickList.terrainObject().isOnTop);
                            }
                        }
                    }
                }
            };

            // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
            wwd.addEventListener("mousemove", handlePick);

            // Listen for taps on mobile devices and highlight the placemarks that the user taps.
            var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);
        };

        USGSSlabs.prototype.loadSlabData = function (name, dataFile, width, color) {
            var dataLocation = "http://worldwindserver.net/webworldwind/data/usgs/",
                url = dataLocation + dataFile;

            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.parse(name, width, color, xhr.responseText);
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "Slab data retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "Slab data retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "Slab data retrieval timed out: " + url);
            };

            xhr.send(null);
        };

        USGSSlabs.prototype.parse = function (name, width, color, responseText) {
            var lines = responseText.split("\n");

            var meshLayer = new WorldWind.RenderableLayer();
            meshLayer.displayName = name;
            this.wwd.addLayer(meshLayer);

            var meshAttributes = new WorldWind.ShapeAttributes(null);
            meshAttributes.drawOutline = false;
            meshAttributes.outlineColor = WorldWind.Color.BLUE;
            meshAttributes.interiorColor = color;
            meshAttributes.applyLighting = true;

            var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
            highlightAttributes.outlineColor = WorldWind.Color.WHITE;

            var positions = this.makePositionList(lines);
            var gridIndices = this.makeGridIndices(width, positions.numOriginalPositions / width);
            var indices = this.findTriangles(gridIndices, positions.indexMap);
            var splitShapes = WorldWind.TriangleMesh.split(positions.positions, indices, null, null);

            for (var i = 0; i < splitShapes.length; i++) {
                var mesh = new WorldWind.TriangleMesh(splitShapes[i].positions, splitShapes[i].indices, meshAttributes);
                mesh.altitudeScale = 100;
                mesh.highlightAttributes = highlightAttributes;
                meshLayer.addRenderable(mesh);
            }

            this.layersPanel.synchronizeLayerList();
            this.wwd.redraw();
        };

        USGSSlabs.prototype.makeGridIndices = function (width, height) {
            var indices = [], i = 0;

            for (var r = 0; r < height - 1; r++) {
                for (var c = 0; c < width - 1; c++) {
                    var k = r * width + c;

                    indices[i++] = k;
                    indices[i++] = k + 1;
                    indices[i++] = k + width;
                    indices[i++] = k + 1;
                    indices[i++] = k + 1 + width;
                    indices[i++] = k + width;
                }
            }

            return indices;
        };

        USGSSlabs.prototype.makePositionList = function (lines) {
            var positions = [],
                indices = [],
                originalIndex = 0,
                latitude, longitude, altitude;

            for (var i = 0; i < lines.length; i++) {
                var rawPosition = lines[i].trim().split("\t");
                if (rawPosition.length != 3) {
                    continue;
                }

                if (rawPosition[2] != "NaN") {
                    indices[originalIndex] = positions.length;

                    longitude = parseFloat(rawPosition[0]);
                    latitude = parseFloat(rawPosition[1]);
                    altitude = parseFloat(rawPosition[2]);

                    if (longitude > 180) {
                        longitude -= 360;
                    }

                    positions.push(new WorldWind.Position(latitude, longitude, altitude));
                }

                ++originalIndex;
            }

            return {positions: positions, indexMap: indices, numOriginalPositions: originalIndex};
        };

        USGSSlabs.prototype.findTriangles = function (gridIndices, indexMap) {
            var mappedIndices = [],
                ia, ib, ic, iaMapped, ibMapped, icMapped;

            for (var i = 0; i < gridIndices.length; i += 3) {
                ia = gridIndices[i];
                ib = gridIndices[i + 1];
                ic = gridIndices[i + 2];

                iaMapped = indexMap[ia];
                ibMapped = indexMap[ib];
                icMapped = indexMap[ic];

                if (iaMapped && ibMapped && icMapped) {
                    mappedIndices.push(iaMapped);
                    mappedIndices.push(ibMapped);
                    mappedIndices.push(icMapped);
                }
            }

            return mappedIndices;
        };

        return USGSSlabs;
    });