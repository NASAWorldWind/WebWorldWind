/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_irregular.js 2016-07-12 rsirac $
 */

requirejs([
        '../../src/WorldWind',
        '../../examples/LayerManager'
    ],
    function (ww,
              LayerManager) {
        "use strict";

        ww.configuration.baseUrl += "../";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Variable to store the capabilities documents
        var wmtsCapabilities;

        // Fetch capabilities document
        $.get('https://thales-geo.github.io/webworldwind-demos/WMTS-TESTS/bluemarble_irregular/wmts-getcapabilities.xml', function (response) {

            // Parse capabilities
            wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
        })
            .done(function () {

                /*                              Create a layer from capabilities document                             */
                {
                    // We can also precise a specific style, matrix set or image format in formLayerConfiguration method.
                    var config = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[0]);
                    var layer1 = new WorldWind.WmtsLayer(config, "2016-06-08");
                }


                // Create layer list
                var layers = [
                    {layer: layer1, enabled: true},
                    {layer: new WorldWind.CompassLayer(), enabled: true},
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
                ];

                // Add the layers
                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    wwd.addLayer(layers[l].layer);
                }

                // Create a layer manager for controlling layer visibility.
                var layerManager = new LayerManager(wwd);

            });
    });