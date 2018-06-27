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
/**
 *  Illustrates how to animate the passage of time with a day/night cycle on the surface of the globe,
 *  as well as the starry sky above the Earth (with realistic star positions).
 */
requirejs([
        './WorldWindShim',
        './LayerManager'
    ],
    function (WorldWind,
              LayerManager) {
        'use strict';

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow('canvasOne');

        // Create imagery layers.
        var BMNGOneImageLayer = new WorldWind.BMNGOneImageLayer();
        var BMNGLayer = new WorldWind.BMNGLayer();
        wwd.addLayer(BMNGOneImageLayer);
        wwd.addLayer(BMNGLayer);

        // Use the StarField layer to show stars and the Sun around the globe, and the Atmosphere layer to display
        // the atmosphere effect and the night side of the Earth.
        // Note that the StarField layer requires a dark canvas background color.
        // The StarField layer should be added before the Atmosphere layer.
        var starFieldLayer = new WorldWind.StarFieldLayer();
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(starFieldLayer);
        wwd.addLayer(atmosphereLayer);

        // Set a date property for the StarField and Atmosphere layers to the current date and time.
        // This enables the Atmosphere layer to show a night side (and dusk/dawn effects in Earth's terminator).
        // The StarField layer positions its stars according to this date.
        var now = new Date();
        starFieldLayer.time = now;
        atmosphereLayer.time = now;

        // In this example, each full day/night cycle lasts 8 seconds in real time.
        var simulatedMillisPerDay = 8000;

        // Begin the simulation at the current time as provided by the browser.
        var startTimeMillis = Date.now();

        function runSimulation() {
            // Compute the number of simulated days (or fractions of a day) since the simulation began.
            var elapsedTimeMillis = Date.now() - startTimeMillis;
            var simulatedDays = elapsedTimeMillis / simulatedMillisPerDay;

            // Compute a real date in the future given the simulated number of days.
            var millisPerDay = 24 * 3600 * 1000; // 24 hours/day * 3600 seconds/hour * 1000 milliseconds/second
            var simulatedMillis = simulatedDays * millisPerDay;
            var simulatedDate = new Date(startTimeMillis + simulatedMillis);

            // Update the date in both the Starfield and the Atmosphere layers.
            starFieldLayer.time = simulatedDate;
            atmosphereLayer.time = simulatedDate;
            wwd.redraw(); // Update the WorldWindow scene.

            requestAnimationFrame(runSimulation);
        }

        // Animate the starry sky as well as the globe's day/night cycle.
        requestAnimationFrame(runSimulation);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });