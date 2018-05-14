/*
 * Copyright 2015-2018 WorldWind Contributors
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
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        "use strict";
        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Generate 10000 random points to display on the HeatMap with varying intensity over the area of the whole world.
        var locations = [];
        for (var i = 0; i < 10000; i++) {
            locations.push(
                new WorldWind.MeasuredLocation(
                    -89 + (179 * Math.random()),
                    -179 + (359 * Math.random()),
                    Math.ceil(100 * Math.random())
                )
            );
        }

        //
        var heatMapLayer = new WorldWind.HeatMapLayer("HeatMap", locations);

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: heatMapLayer, enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    });