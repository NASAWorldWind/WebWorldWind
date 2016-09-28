/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

require([
        './LayerManager',
        '../src/WorldWind'
    ],
    function (LayerManager, WorldWind) {
        'use strict';

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow('canvasOne');

        //The SkyboxLayer must be added before the AtmosphereLayer.
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: false},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: false},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: false},
            {layer: new WorldWind.SkyboxLayer(), enabled: true},
            {layer: new WorldWind.AtmosphereLayer(), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

    });