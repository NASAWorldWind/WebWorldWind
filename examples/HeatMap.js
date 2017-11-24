/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Sector actually represents the area that you overlay the graphic with.
        var data = [
            new WorldWind.IntensityLocation(48, 10, 10),
            new WorldWind.IntensityLocation(50, 15, 1),
            new WorldWind.IntensityLocation(52, 20, 9),
            new WorldWind.IntensityLocation(49, 10, 1),
            new WorldWind.IntensityLocation(51, 15, 8),
            new WorldWind.IntensityLocation(51, 15, 1),
            new WorldWind.IntensityLocation(51, 15, 7),

            new WorldWind.IntensityLocation(10, -160, 11),
            new WorldWind.IntensityLocation(30, -120, 12),
            new WorldWind.IntensityLocation(80, -80, 13),
            new WorldWind.IntensityLocation(-20, -40, 1000),
            new WorldWind.IntensityLocation(-40, 0, 14),
            new WorldWind.IntensityLocation(-60, 80, 15),
            new WorldWind.IntensityLocation(-80, 120, 1000)
        ];

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
            {layer: new WorldWind.HeatMapLayer("HeatMap, Default version", data, {}), enabled: true},
            {layer: new WorldWind.HeatMapLayer("HeatMap, Updated visual properties", data, {
                radius: 10,
                blur: 0,
                minOpacity: 1,
                scale: ["#fdffd3","#cdd077","#919433","#656815"]
            }), enabled: true},
            {layer: new WorldWind.HeatMapLayer("HeatMap, Quantile distribution", data, {
                intervalType: WorldWind.IntervalType.QUANTILES,
                minOpacity: 0.5
            }), enabled: true}
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