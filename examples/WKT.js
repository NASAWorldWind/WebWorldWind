/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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
        placemarkAttributes.imageScale = 0.05;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.5
        );
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

        var shapeConfigurationCallback = function (geometry, properties) {
            var configuration = {};

            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                if (properties && (properties.name || properties.Name || properties.NAME)) {
                    configuration.name = properties.name || properties.Name || properties.NAME;
                }
                if (properties && properties.POP_MAX) {
                    var population = properties.POP_MAX;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
            }
            else if (geometry.isLineStringType() || geometry.isMultiLineStringType()){
                configuration.attributes =  new WorldWind.ShapeAttributes(null);
                configuration.attributes.drawOutline = true;
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.1 * configuration.attributes.interiorColor.red,
                    0.3 * configuration.attributes.interiorColor.green,
                    0.7 * configuration.attributes.interiorColor.blue,
                    1.0
                );
                configuration.attributes.outlineWidth = 1.0;
            }
            else if(geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.1
                );
                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0
                );
            }

            return configuration;
        };

        // Polygon test
        var polygonLayer = new WorldWind.RenderableLayer("Polygon");
        var polygonWKT = new WorldWind.WKTParser("POLYGON ((40 -70, 45 -80, 40 -90))");
        polygonWKT.load(null, shapeConfigurationCallback, polygonLayer);
        wwd.addLayer(polygonLayer);

        // MultiPolygon test
        var multiPolygonLayer = new WorldWind.RenderableLayer("MultiPolygon");
        var multiPolygonWKT = new WorldWind.WKTParser("MULTIPOLYGON (((), ()))");
        multiPolygonWKT.load(null, shapeConfigurationCallback, multiPolygonLayer);
        wwd.addLayer(multiPolygonLayer);

        //Point test
        var pointLayer = new WorldWind.RenderableLayer("Point");
        var pointWKT = new WorldWind.WKTParser("POINT (14.5 50)");
        pointWKT.load(null, shapeConfigurationCallback, pointLayer);
        wwd.addLayer(pointLayer);

        //MultiPoint test
        var multiPointLayer = new WorldWind.RenderableLayer("MultiPoint");
        var multiPointWKT = new WorldWind.WKTParser("MULTIPOINT ((17.2 49.3), (17.23 49.24), (17.14 49.37), (17.2 49.24))");
        multiPointWKT.load(null, shapeConfigurationCallback, multiPointLayer);
        wwd.addLayer(multiPointLayer);

        //LineString test
        var lineStringLayer = new WorldWind.RenderableLayer("LineString");
        var lineStringDataSource = 'LINESTRING ((33 -75, 37 -80, 33 -85))';
        var lineStringWKT = new WorldWind.WKTParser(lineStringDataSource);
        lineStringWKT.load(null, shapeConfigurationCallback, lineStringLayer);
        wwd.addLayer(lineStringLayer);

        //MultiLineString test
        var multiLineStringLayer = new WorldWind.RenderableLayer("MultiLineString");
        var multiLineStringWKT = new WorldWind.WKTParser("MULTILINESTRING ((15.14 48.02, 15.16 48.04, 15.11 48.01, 15.09 48.05), (15.14 48.12, 15.16 48.14, 15.11 48.11, 15.09 48.15), (15.14 48.22, 15.16 48.24, 15.11 48.21, 15.09 48.25), (15.14 48.32, 15.16 48.34, 15.11 48.31, 15.09 48.35), (15.14 48.42, 15.16 48.44, 15.11 48.41, 15.09 48.45))");
        multiLineStringWKT.load(null, shapeConfigurationCallback, multiLineStringLayer);
        wwd.addLayer(multiLineStringLayer);

        $('#showWkt').click(function(){
            var wktLayer = new WorldWind.RenderableLayer('WKT');
            var wkt = new WorldWind.WKTParser($('#wkt').val());
            wkt.load(null, shapeConfigurationCallback, wktLayer);
            wwd.addLayer(wktLayer);
        });

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });