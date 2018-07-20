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

        // Add WorldWind UI layers.
        wwd.addLayer(new WorldWind.CompassLayer());
        wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
        wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

        // Create a background layer.
        var backgroundLayer = new WorldWind.BMNGOneImageLayer();
        backgroundLayer.hide = true; // Don't show it in the layer manager.
        wwd.addLayer(backgroundLayer);

        // Create the Blue Marble time series layer using REST tiles hosted at worldwind32.arc.nasa.gov.
        // Disable it until its images are cached, which is initiated below.
        var timeSeriesLayer = new WorldWind.BMNGRestLayer(
            "https://worldwind32.arc.nasa.gov/standalonedata/Earth/BlueMarble256");
        timeSeriesLayer.enabled = false;
        timeSeriesLayer.showSpinner = true;
        wwd.addLayer(timeSeriesLayer);

        // Add atmosphere layer on top of base imagery layer.
        wwd.addLayer(new WorldWind.AtmosphereLayer());

        var timeIndex = 0;
        var animationStep = 200;

        function animateTimeSeries() {
            // Pre-load all of the time series layer data before starting the animation, so that we don't see image
            // tiles flashing as they're downloaded.
            if (!timeSeriesLayer.isPrePopulated(wwd)) {
                timeSeriesLayer.prePopulate(wwd);
                return;
            }

            // Increment the Blue Marble layer's time at a specified frequency.
            timeIndex = ++timeIndex % WorldWind.BMNGRestLayer.availableTimes.length;
            timeSeriesLayer.time = WorldWind.BMNGRestLayer.availableTimes[timeIndex];
            timeSeriesLayer.enabled = true;
            timeSeriesLayer.showSpinner = false;
            layerManager.synchronizeLayerList();
            wwd.redraw();
        }

        // Run the animation at the desired frequency.
        window.setInterval(animateTimeSeries, animationStep);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });