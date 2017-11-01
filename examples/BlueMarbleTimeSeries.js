/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Displays a time series of the 12 months of Blue Marble imagery.
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var backgroundLayer = new WorldWind.BMNGOneImageLayer();
        backgroundLayer.hide = true; // Don't show it in the layer manager.
        wwd.addLayer(backgroundLayer);

        // Create the Blue Marble time series layer.
        var blueMarbleTimeSeries = new WorldWind.BMNGRestLayer(null);
        blueMarbleTimeSeries.enabled = false;
        blueMarbleTimeSeries.showSpinner = true;

        // Add Blue Marble time series to the WorldWindow's layer list. Disable it until its images are preloaded,
        // which is initiated below.
        wwd.addLayer(blueMarbleTimeSeries);

        // Create a compass and view controls.
        wwd.addLayer(new WorldWind.CompassLayer());
        wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
        wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

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
                layerManger.synchronizeLayerList();

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
    });