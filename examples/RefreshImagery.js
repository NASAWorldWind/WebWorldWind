/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Shows how to cause an image layer's imagery to be re-retrieved from its origin. You should do this only if you
 * know the imagery is changing at the server.
 *
 * @version $Id: RefreshImagery.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layerToRefresh = new WorldWind.BMNGLayer();

        var layers = [
            {layer: layerToRefresh, enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Set up to refresh the imagery periodically.
        setInterval(function () {
            layerToRefresh.refresh();
            wwd.redraw();
        }, 20000); // refresh every 20 seconds
    });