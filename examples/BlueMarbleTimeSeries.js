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
 * Displays a time series of the 12 months of Blue Marble imagery.
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

        // Create a background layer.
        var backgroundLayer = new WorldWind.BMNGOneImageLayer();
        backgroundLayer.hide = true; // Don't show it in the layer manager.
        wwd.addLayer(backgroundLayer);

        // Create the Blue Marble time series layer using REST tiles hosted at worldwind32.arc.nasa.gov.
        var blueMarbleTimeSeries = new WorldWind.BMNGRestLayer("https://worldwind32.arc.nasa.gov/standalonedata/Earth/BlueMarble256");
        blueMarbleTimeSeries.enabled = false;
        blueMarbleTimeSeries.showSpinner = true;

        // Add Blue Marble time series to the WorldWindow's layer list. Disable it until its images are preloaded,
        // which is initiated below.
        wwd.addLayer(blueMarbleTimeSeries);

        // Add atmosphere layer on top of base imagery layer.
        wwd.addLayer(new WorldWind.AtmosphereLayer());
        // Add WorldWind UI layers.
        wwd.addLayer(new WorldWind.CompassLayer());
        wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
        wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

        // Ensure that the background and other control layers are displayed while the blue marble layer is
        // being pre-populated.
        wwd.redraw();

        // Wait for the layer to pre-populate all its sub-layers before enabling it.
        var prePopulateInterval = window.setInterval(function () {
            if (!this.prePopulate) {
                // Pre-populate the layer's sub-layers so that we don't see flashing of their image tiles as they're
                // loaded.
                blueMarbleTimeSeries.prePopulate(wwd);
                this.prePopulate = true;
                return;
            }

            // See if the layer is pre-populated now. If so, enable it.
            if (blueMarbleTimeSeries.isPrePopulated(wwd)) {
                blueMarbleTimeSeries.enabled = true;
                blueMarbleTimeSeries.showSpinner = false;
                window.clearInterval(prePopulateInterval);
                layerManager.synchronizeLayerList();

                // Increment the Blue Marble layer's time at a specified frequency.
                var currentIndex = 0;
                window.setInterval(function () {
                    if (blueMarbleTimeSeries.enabled) {
                        currentIndex = ++currentIndex % WorldWind.BMNGRestLayer.availableTimes.length;
                        blueMarbleTimeSeries.time = WorldWind.BMNGRestLayer.availableTimes[currentIndex];
                        wwd.redraw();
                    }
                }, 200);
            }
        }, 200);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });