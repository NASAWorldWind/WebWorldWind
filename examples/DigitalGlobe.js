/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // The following access token is expired and it's given as example (2017-05-13).
        var accessToken = "pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6IjljZjQwNmEyMTNhOWUyMWM5NWUzYWIwOGNhYTY2ZDViIn0.Ju3tOUUUc0C_gcCSAVpFIA";

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {
                layer: new WorldWind.DigitalGlobeTiledImageLayer("Digital Globe", "digitalglobe.n6ngnadl", accessToken),
                enabled: true
            },
            {
                layer: new WorldWind.DigitalGlobeTiledImageLayer("Digital Globe with Roads", "digitalglobe.n6nhclo2", accessToken),
                enabled: false
            },
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });