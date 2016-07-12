/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_GeoService.js 2016-06-09 rsirac $
 */

requirejs(['../../src/WorldWind',
        '../../examples/LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        ww.configuration.baseUrl += "../";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // NOAA layers
        var wmtsCapabilitiesGeoService1,
            wmtsCapabilitiesGeoService2,
            wmtsCapabilitiesGeoService3,
            wmtsCapabilitiesGeoService4,
            wmtsCapabilitiesGeoService5;

        $.get('https://tiles.geoservice.dlr.de/service/wmts?REQUEST=getcapabilities', function (response) {

            var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
            wmtsCapabilitiesGeoService1 = wmtsCapabilities.contents.layer[0];
            wmtsCapabilitiesGeoService2 = wmtsCapabilities.contents.layer[1];
            wmtsCapabilitiesGeoService3 = wmtsCapabilities.contents.layer[2];
            wmtsCapabilitiesGeoService4 = wmtsCapabilities.contents.layer[4];
            wmtsCapabilitiesGeoService5 = wmtsCapabilities.contents.layer[5];

        })
            .done(function () {

                var layers = [
                    // WMTS layers
                    {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesGeoService1)), enabled: true},
                    {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesGeoService2)), enabled: false},
                    {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesGeoService3)), enabled: false},
                    {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesGeoService4)), enabled: false},
                    {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesGeoService5)), enabled: false},

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

            });
    });