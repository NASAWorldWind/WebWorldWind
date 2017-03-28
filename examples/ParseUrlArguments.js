/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: ParseUrlArguments.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        var parseArgs = function () {
            var result = {};

            var queryString = window.location.href.split("?");
            if (queryString && queryString.length > 1) {
                var args = queryString[1].split("&");

                for (var a = 0; a < args.length; a++) {
                    var arg = args[a].split("=");

                    if (arg[0] === "pos") {
                        // arg format is "pos=lat,lon,alt"
                        var position = arg[1].split(","),
                            lat = parseFloat(position[0]),
                            lon = parseFloat(position[1]),
                            alt = parseFloat(position[2]);
                        result.position = new WorldWind.Position(lat, lon, alt);
                    }
                }
            }

            return result;
        };

        var args = parseArgs();

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
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

        // Now move the view to the requested position.
        if  (args.position) {
            wwd.goTo(args.position);
        }
    });