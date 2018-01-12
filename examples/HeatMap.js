/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        $.get('http://eoapps.solenix.ch/stats/sentinel-2a/2017/10.json').then(function (result) {
            "use strict";
            // Create the WorldWindow.
            var wwd = new WorldWind.WorldWindow("canvasOne");

            var data = result.boxes.map(function (box) {
                return new WorldWind.IntensityLocation((Number(box.bbox1Lat) + Number(box.bbox2Lat)) / 2, (Number(box.bbox1Lon) + Number(box.bbox2Lon)) / 2, box.amount);
            });

            function calculatePointRadius(sector, tileWidth, tileHeight) {
                var latitude = Math.abs(sector.maxLatitude - sector.minLatitude);
                if(latitude < 1) {
                    return tileHeight;
                } else {
                    return tileHeight / latitude;
                }
            }

            /**
             * Add imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BMNGLayer(), enabled: true},
                {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                {layer: new WorldWind.CompassLayer(), enabled: true},
                {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
                {layer: new WorldWind.HeatMapLayer("HeatMap, Default version", data, {radius: calculatePointRadius}), enabled: true}
            ];

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                wwd.addLayer(layers[l].layer);
            }

            wwd.navigator.lookAtLocation = new WorldWind.Location(50, 20);
            wwd.redraw();

            // Create a layer manager for controlling layer visibility.
            var layerManager = new LayerManager(wwd);

            // Now set up to handle highlighting.
            var highlightController = new WorldWind.HighlightController(wwd);
        });
    });