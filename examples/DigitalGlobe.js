/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: DigitalGlobe.js 3418 2015-08-22 00:17:05Z tgaskins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // The following access token expires on August 28th.
        var accessToken = "pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6IjljZjQwNmEyMTNhOWUyMWM5NWUzYWIwOGNhYTY2ZDViIn0.Ju3tOUUUc0C_gcCSAVpFIA";

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.DigitalGlobeTiledImageLayer("Digital Globe", "digitalglobe.n6ngnadl", accessToken), enabled: true},
            {layer: new WorldWind.DigitalGlobeTiledImageLayer("Digital Globe with Roads", "digitalglobe.n6nhclo2", accessToken), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });