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

        // Polygon test
        var polygonLayer = new WorldWind.RenderableLayer("Polygon");
        new WorldWind.WKTParser("POLYGON ((40 -70, 45 -80, 40 -90))").load(null, null, polygonLayer);
        wwd.addLayer(polygonLayer);

        // MultiPolygon test
        var multiPolygonLayer = new WorldWind.RenderableLayer("MultiPolygon");
        new WorldWind.WKTParser("MULTIPOLYGON (((50 -60, 55 -70, 50 -80)),((30 -60, 35 -70, 30 -80)))").load(null, null, multiPolygonLayer);
        wwd.addLayer(multiPolygonLayer);

        //Point test
        var pointLayer = new WorldWind.RenderableLayer("Point");
        new WorldWind.WKTParser("POINT (14.5 50)").load(null, null, pointLayer);
        wwd.addLayer(pointLayer);

        //MultiPoint test
        var multiPointLayer = new WorldWind.RenderableLayer("MultiPoint");
        new WorldWind.WKTParser("MULTIPOINT ((17.2 49.3),(17.23 49.24),(17.14 49.37),(17.2 49.24))").load(null, null, multiPointLayer);
        wwd.addLayer(multiPointLayer);

        //LineString test
        var lineStringLayer = new WorldWind.RenderableLayer("LineString");
        new WorldWind.WKTParser('LINESTRING ((33 -75, 37 -80, 33 -85))').load(null, null, lineStringLayer);
        wwd.addLayer(lineStringLayer);

        //MultiLineString test
        var multiLineStringLayer = new WorldWind.RenderableLayer("MultiLineString");
        new WorldWind.WKTParser("MULTILINESTRING ((38 -70, 42 -75, 38 -80),(43 -65, 47 -70, 43 -75))").load(null, null, multiLineStringLayer);
        wwd.addLayer(multiLineStringLayer);

        var wktLayer = new WorldWind.RenderableLayer('WKT');
        $('#showWkt').click(function(){
            new WorldWind.WKTParser($('#wkt').val()).load(null, null, wktLayer);
        });
        wwd.addLayer(wktLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });