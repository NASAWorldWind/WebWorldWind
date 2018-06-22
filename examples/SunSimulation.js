/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
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
 * Illustrates how to display a sunlight time of day simulation utilizing the atmosphere layer.
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
            // Imagery layer.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: false},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: false},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: false}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // The Sun simulation is a feature of Atmosphere layer. We'll create and add the layer.
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(atmosphereLayer);

        // Atmosphere layer requires a date to simulate the Sun position at that time.
        // In this case the current date will be given to initialize the simulation.
        var timeStamp = Date.now();

        // Update the Sun position in 3 minute steps, every 64 ms in real time. Then redraw the scene.
        setInterval(function () {
            timeStamp += 180 * 1000;
            atmosphereLayer.time = new Date(timeStamp);
            wwd.redraw();
        }, 64);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });


