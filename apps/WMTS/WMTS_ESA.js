/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_ESA.js 2016-06-28 rsirac $
 */

requirejs(['../../src/WorldWind',
        '../../examples/MyLayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        ww.configuration.baseUrl += "../";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // ESA layers
        var wmtsCapabilities;

        $.get('http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35?REQUEST=GetCapabilities&SERVICE=WMTS', function (response) {

            wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
            console.log(response);

        })
            .done(function () {

                // Internal layer
                var layers = [
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: true}
                    ];

                // ESA layers
                for (var i = 0 ; i < wmtsCapabilities.contents.layer.length ; i++ ) {
                    if ([20, 21, 26, 41, 42, 43].indexOf(i) > -1) {
                        layers.push({layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]), "2016-06-08"), enabled : false, selected: true});
                    } else {
                        layers.push({layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]), "2016-06-08"), enabled: false, selected: false});
                    }
                }

                // Internal layers
                layers.push(
                    {layer: new WorldWind.CompassLayer(), enabled: true},
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
                );


                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    layers[l].layer.layerSelected = layers[l].selected;
                    wwd.addLayer(layers[l].layer);
                }


                // Create a layer manager for controlling layer visibility.
                var layerManager = new LayerManager(wwd);

                wwd.navigator.range = 5e4;
                // Adjust the Navigator to place Paris, France in the center of the World Window.
                wwd.navigator.lookAtLocation.latitude = 48.86;
                wwd.navigator.lookAtLocation.longitude = 2.37;
                wwd.redraw();

            });
    });