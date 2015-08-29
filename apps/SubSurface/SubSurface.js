/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: SubSurface.js 3320 2015-07-15 20:53:05Z dcollins $
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

        var SubSurface = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Create the World Window.
            this.wwd = new WorldWind.WorldWindow("canvasOne");

            /**
             * Added imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
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

            // Start the view pointing to a longitude within the current time zone.
            this.wwd.navigator.lookAtLocation.latitude = 30;
            this.wwd.navigator.lookAtLocation.longitude = -(180 / 12) * ((new Date()).getTimezoneOffset() / 60);

            this.goToBox = new GoToBox(this.wwd);
            this.layersPanel = new LayersPanel(this.wwd);
            this.projectionMenu = new ProjectionMenu(this.wwd);
            this.terrainOpacityController = new TerrainOpacityController(this.wwd);

            var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
            placemarkAttributes.imageScale = 0.1;
            placemarkAttributes.imageColor = WorldWind.Color.GREEN;
            placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

            var shapefileLibrary = "http://worldwindserver.net/webworldwind/data/shapefiles/springfield";

            var shapeConfigurationCallback = function (attributes, record) {
                var configuration = {};

                if (record.isPolylineType()) {
                    configuration.attributes = new WorldWind.ShapeAttributes(null);

                    if (attributes.values.ELEVATION) {
                        configuration.altitude = attributes.values.ELEVATION;
                        configuration.altitudeMode = WorldWind.ABSOLUTE;
                    }

                    configuration.attributes.outlineColor = WorldWind.Color.RED;

                    return configuration;
                } else if (record.isPolygonType()) {
                    configuration.attributes = new WorldWind.ShapeAttributes(null);

                    if (attributes.values.ELEVATION) {
                        configuration.altitude = attributes.values.ELEVATION;
                        configuration.altitudeMode = WorldWind.ABSOLUTE;
                    }

                    // Fill the polygon with a random pastel color.
                    var interiorColor = new WorldWind.Color(
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        1.0);
                    configuration.attributes.interiorColor = interiorColor;

                    // Paint the outline in a darker variant of the interior color.
                    configuration.attributes.outlineColor = new WorldWind.Color(
                        0.5 * interiorColor.red,
                        0.5 * interiorColor.green,
                        0.5 * interiorColor.blue,
                        1.0);

                    return configuration;
                } else if (record.isPointType() || record.isMultiPointType()) {
                    configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                    if (attributes.values.SF_COMPKEY) {
                        configuration.name = attributes.values.SF_COMPKEY.toString();
                    }

                    if (attributes.values.ELEVATION) {
                        configuration.altitude = attributes.values.ELEVATION;
                        configuration.altitudeMode = WorldWind.ABSOLUTE;
                    }

                    return configuration;
                }
            };

            var pipesLayer = new WorldWind.RenderableLayer("Pipe Mains");
            var manholesLayer = new WorldWind.RenderableLayer("Manholes");

            var pipesShapefile = new WorldWind.Shapefile(shapefileLibrary + "/wastewaterpipemains.shp");
            pipesShapefile.load(null, shapeConfigurationCallback, pipesLayer);

            var manholesShapefile = new WorldWind.Shapefile(shapefileLibrary + "/wastewatermanholes.shp");
            manholesShapefile.load(null, shapeConfigurationCallback, manholesLayer);

            this.wwd.addLayer(pipesLayer);
            this.wwd.addLayer(manholesLayer);

            var surfaceAttributes = new WorldWind.ShapeAttributes(null);
            surfaceAttributes.interiorColor = WorldWind.Color.BLUE;;
            var surfaceShape = new WorldWind.SurfaceCircle(new WorldWind.Location(44.05, -123), 5e3, surfaceAttributes);
            var surfaceShapeLayer = new WorldWind.RenderableLayer();
            surfaceShapeLayer.displayName = "Surface Shape";
            surfaceShapeLayer.addRenderable(surfaceShape);
            this.wwd.addLayer(surfaceShapeLayer);

            this.layersPanel.synchronizeLayerList();
        };

        return SubSurface;
    });