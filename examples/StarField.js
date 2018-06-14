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
 *  Illustrates how to show the starfield layer above the globe, displaying a starry sky.
 *  This requires a dark background for the WorldWindow's canvas.
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
        wwd.addLayer(starFieldLayer); //IMPORTANT: add the starFieldLayer before the atmosphereLayer
        wwd.addLayer(atmosphereLayer);

        // Attach a time property to the starfield and atmosphere layers.
        var date = new Date();
        starFieldLayer.time = date;
        atmosphereLayer.time = date;

        // Animate the starry sky as well as the globe's day/night cycle with the atmosphere layer.
        var lastFrame, timeToAdvance, frameTime, now, simulationDate;

        simulationDate = Date.now(); // Begin the simulation at the current time as provided by the browser.

        function runAnimation() {
            now = Date.now();
            if (lastFrame) {
                frameTime = now - lastFrame; // The amount of time taken to render each frame.

                // The amount of time to advance the simulation, per frame, in order to achieve a constant
                // rate of 3 hrs per second in real time, regardless of frame rate.
                // The constant value of 10800 ms is the time to advance at the aforementioned rate assuming an
                // hypothetical frame time equal to 1 ms (frame time is typically ~16 ms at 60Hz).
                // This constant modulates the simulation advancement in each step, proportionally to the frame time.
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

        requestAnimationFrame(runAnimation);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });