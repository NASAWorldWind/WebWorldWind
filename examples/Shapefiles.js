/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Shapefiles.js 3361 2015-07-31 19:28:04Z tgaskins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Set up the common placemark attributes.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 0.025;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

        var shapeConfigurationCallback = function (attributes, record) {
            var configuration = {};
            configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

            if (record.isPointType()) {
                configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                if (attributes.values.pop_max) {
                    var population = attributes.values.pop_max;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
            } else if (record.isPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    1.0);

                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            return configuration;
        };

        var shapefileLibrary = "http://worldwindserver.net/webworldwind/data/shapefiles/naturalearth";

        // Create data for the world.
        var worldLayer = new WorldWind.RenderableLayer("Countries");
        var worldShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp");
        worldShapefile.load(null, shapeConfigurationCallback, worldLayer);
        wwd.addLayer(worldLayer);

        // Create data for cities.
        var cityLayer = new WorldWind.RenderableLayer("Cities");
        var cityShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_50m_populated_places_simple/ne_50m_populated_places_simple.shp");
        cityShapefile.load(null, shapeConfigurationCallback, cityLayer);
        wwd.addLayer(cityLayer);

        var fortStory = "http://worldwindserver.net/webworldwind/data/shapefiles/misc/FortStory/Trident-Spectre-Indigo-i.shp";
        var fortStoryLayer = new WorldWind.RenderableLayer("Fort Story");
        var fortStoryShapefile = new WorldWind.Shapefile(fortStory);
        fortStoryShapefile.load(null, null, fortStoryLayer);
        wwd.addLayer(fortStoryLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });