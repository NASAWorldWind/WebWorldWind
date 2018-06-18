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
        var starFieldLayer = new WorldWind.StarFieldLayer();
        var atmosphereLayer = new WorldWind.AtmosphereLayer();

        // Add previously created layers to the WorldWindow.
        wwd.addLayer(BMNGOneImageLayer);
        wwd.addLayer(BMNGLayer);

        // Use the StarField layer to show stars and the Sun around the globe, and the Atmosphere layer to display
        // the night side of the Earth.
        // The StarField layer should be added before the Atmosphere layer.
        // The StarField layer requires a dark canvas background color.
        wwd.addLayer(starFieldLayer);
        wwd.addLayer(atmosphereLayer);

        // Set a date property to the StarField and Atmosphere layers.
        var date = new Date();
        starFieldLayer.time = date;
        atmosphereLayer.time = date;

        // Animate the starry sky as well as the globe's day/night cycle.
        // In this example, each full day/night cycle lasts 8 seconds in real time.
        var lastFrame, timeToAdvance, frameTime, now, simulationDate;

        simulationDate = Date.now(); // Begin the simulation at the current time as provided by the browser.

        requestAnimationFrame(runAnimation);

        function runAnimation() {
            now = Date.now();
            if (lastFrame) {
                frameTime = now - lastFrame; // The amount of time taken to render each frame.

                // The amount of time to advance the simulation, per frame.
                // The constant value of 10800 ms is the time to advance at the rate mentioned above, assuming an
                // hypothetical frame time equal to 1 ms (frame time is typically ~16 ms at 60Hz).
                // This constant modulates the simulation advancement in each step, proportionally to the frame time
                // in order to adjust the animation speed accordingly to the frame rate.
                timeToAdvance = frameTime * 10800;

                simulationDate += timeToAdvance; // Advance the simulation time.

                // Update the date in both the Starfield and Atmosphere layers.
                starFieldLayer.time = new Date(simulationDate);
                atmosphereLayer.time = new Date(simulationDate);
                wwd.redraw(); // Update the WorldWindow scene.
            }
            lastFrame = now;
            requestAnimationFrame(runAnimation);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });