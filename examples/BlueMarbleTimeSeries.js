/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Displays a time series of the 12 months of Blue Marble imagery.
 *
 * @version $Id: BlueMarbleTimeSeries.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create the Blue Marble layer and add it to the World Window's layer list.
        var blueMarbleLayer = new WorldWind.BlueMarbleLayer(null, WorldWind.BlueMarbleLayer.availableTimes[0]);
        wwd.addLayer(blueMarbleLayer);

        // Create a compass and view controls.
        wwd.addLayer(new WorldWind.CompassLayer());
        wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
        wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Increment the Blue Marble layer's time at a specified frequency.
        var currentIndex = 0;
        window.setInterval(function (){
            currentIndex = ++currentIndex % WorldWind.BlueMarbleLayer.availableTimes.length;
            blueMarbleLayer.time = WorldWind.BlueMarbleLayer.availableTimes[currentIndex];
            wwd.redraw();
        }, 200);
    });