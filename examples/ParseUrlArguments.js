/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Illustrates how to retrieve arguments in the browser's URL in order to interact with the globe.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Function to obtain arguments from query string.
        var parseArgs = function () {
            var result = {};

            var queryString = window.location.href.split("?");
            if (queryString && queryString.length > 1) {
                var args = queryString[1].split("&");

                for (var a = 0; a < args.length; a++) {
                    var arg = args[a].split("=");

                    // Obtain geographic position to redirect WorldWindow camera view.
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

        // Now move the view to the requested position.
        if (args.position) {
            wwd.goTo(args.position);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });