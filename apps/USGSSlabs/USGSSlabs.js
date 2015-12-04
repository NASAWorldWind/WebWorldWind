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
        '../util/TerrainOpacityController',
        'DataGrid'],
    function (ww,
              GoToBox,
              LayersPanel,
              ProjectionMenu,
              TerrainOpacityController,
              DataGrid) {
        "use strict";

        var USGSSlabs = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Create the World Window.
            this.wwd = new WorldWind.WorldWindow("canvasOne");

            // Configure the World Window layers.
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

            // Configure the USGS earthquake slab layers.
            this.loadSlabData("CAS", "cascadia_slab1.0_clip.xyz", 401, WorldWind.Color.YELLOW);
            this.loadSlabData("SOL", "sol_slab1.0_clip.xyz", 1001, WorldWind.Color.YELLOW);
            this.loadSlabData("MEX", "mex_slab1.0_clip.xyz", 1251, WorldWind.Color.CYAN);
            //this.loadSlabData("ALU", "alu_slab1.0_clip.xyz", 2451, WorldWind.Color.MAGENTA);

            // Enable sub-surface rendering for the World Window.
            this.wwd.subsurfaceMode = true;
            // Enable deep picking in order to detect the sub-surface shapes.
            this.wwd.deepPicking = true;
            // Make the surface semi-transparent in order to see the sub-surface shapes.
            this.wwd.surfaceOpacity = 0.7;

            // Start the view pointing to a longitude within the current time zone.
            this.wwd.navigator.lookAtLocation.latitude = 30;
            this.wwd.navigator.lookAtLocation.longitude = -(180 / 12) * ((new Date()).getTimezoneOffset() / 60);

            // Establish the shapes and the controllers to handle picking.
            this.setupPicking();

            // Create controllers for the user interface elements.
            this.goToBox = new GoToBox(this.wwd);
            this.layersPanel = new LayersPanel(this.wwd);
            this.projectionMenu = new ProjectionMenu(this.wwd);
            this.terrainOpacityController = new TerrainOpacityController(this.wwd);
        };

        USGSSlabs.prototype.loadSlabData = function (name, dataFile, width, color) {
            var dataLocation = "http://worldwindserver.net/webworldwind/data/usgs/",
                url = dataLocation + dataFile;

            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var dataGrid = new DataGrid(xhr.responseText);
                        this.addGridToWorldWindow(name, dataGrid, color);
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

        USGSSlabs.prototype.addGridToWorldWindow = function (name, dataGrid, color) {
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

            var indices = dataGrid.findTriangles();
            var splitShapes = WorldWind.TriangleMesh.split(dataGrid.positions, indices, null, null);

            for (var i = 0; i < splitShapes.length; i++) {
                var mesh = new WorldWind.TriangleMesh(splitShapes[i].positions, splitShapes[i].indices, meshAttributes);
                mesh.altitudeMode = WorldWind.ABSOLUTE;
                mesh.highlightAttributes = highlightAttributes;
                mesh.dataGrid = dataGrid;
                meshLayer.addRenderable(mesh);
            }

            this.layersPanel.synchronizeLayerList();
            this.wwd.redraw();
        };

        USGSSlabs.prototype.setupPicking = function () {
            this.screenText = new WorldWind.ScreenText(new WorldWind.Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0), " ");
            this.screenText.attributes = new WorldWind.TextAttributes();
            this.screenText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);

            this.textLayer = new WorldWind.RenderableLayer();
            this.textLayer.hide = true;
            this.textLayer.enabled = false;
            this.textLayer.addRenderable(this.screenText);
            this.wwd.addLayer(this.textLayer);

            var handlePick = (function (o) {
                var pickPoint = this.wwd.canvasCoordinates(o.clientX, o.clientY);

                this.textLayer.enabled = false;
                this.wwd.redraw();

                var pickList = this.wwd.pick(pickPoint);
                if (pickList.objects.length > 0) {
                    for (var p = 0; p < pickList.objects.length; p++) {
                        var pickedObject = pickList.objects[p];
                        if (pickedObject.userObject instanceof WorldWind.TriangleMesh) {
                            if (pickedObject.position) {
                                var latitude = pickedObject.position.latitude,
                                    longitude = pickedObject.position.longitude,
                                    altitude = pickedObject.userObject.dataGrid.lookupValue(latitude, longitude);
                                if (altitude !== null) {
                                    this.screenText.screenOffset.x = pickPoint[0];
                                    this.screenText.screenOffset.y = this.wwd.viewport.width - pickPoint[1];
                                    this.screenText.text = Math.floor(Math.abs(altitude) / 1000).toString() + " Km";
                                    this.textLayer.enabled = true;
                                }
                            }
                        }
                    }
                }
            }).bind(this);

            // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
            this.wwd.addEventListener("mousemove", handlePick);

            // Listen for taps on mobile devices and highlight the placemarks that the user taps.
            var tapRecognizer = new WorldWind.TapRecognizer(this.wwd, handlePick);
        };

        return USGSSlabs;
    });