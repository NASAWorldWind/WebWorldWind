/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_SpanishIGN.js 2016-06-09 rsirac $
 */

requirejs(['../../src/WorldWind',
        '../../examples/LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Spanish IGN layer
        var wmtsCapabilitiesIGN1;


        $.get('http://www.ign.es/wmts/pnoa-ma?request=GetCapabilities&service=WMTS', function (response) {

            var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
            wmtsCapabilities.contents.layer[0].title[0].value = "Imágenes de satélite Spot";
            wmtsCapabilitiesIGN1 = wmtsCapabilities.contents.layer[0];
        })
            .done(function () {

                var layers = [
                    // Internal layer
                    {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: true},


                    // WMTS layers
                    {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesIGN1, "", "GoogleMapsCompatible")), enabled: true},

                    // Internal layers
                    {layer: new WorldWind.CompassLayer(), enabled: true},
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
                ];

                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    wwd.addLayer(layers[l].layer);
                }


                // Create a layer manager for controlling layer visibility.
                var layerManager = new LayerManager(wwd);

                // Look at Spain
                wwd.navigator.lookAtLocation.latitude = 40;
                wwd.navigator.lookAtLocation.longitude = 3.5;
                wwd.redraw();

            });

    });