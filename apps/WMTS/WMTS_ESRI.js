/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_ESRI.js 2016-06-09 rsirac $
 */

requirejs(['../../src/WorldWind',
        '../../examples/LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        ww.configuration.baseUrl += "../";


        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // ESRI ArcGris layers
        var wmtsCapabilitiesWorldImagery,
            wmtsCapabilitiesWorldStreetMap,
            wmtsCapabilitiesWorldTopoMap;


        $.get('http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/WMTS?request=getcapabilities', function (response) {

            var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
            wmtsCapabilitiesWorldImagery = wmtsCapabilities.contents.layer[0];
        })
            .done(function () {

                $.get('http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/WMTS?request=getcapabilities', function (response) {

                    var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
                    wmtsCapabilitiesWorldStreetMap = wmtsCapabilities.contents.layer[0];
                })
                    .done(function () {

                        $.get('http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/WMTS?request=getcapabilities', function (response) {

                            var wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
                            wmtsCapabilitiesWorldTopoMap = wmtsCapabilities.contents.layer[0];
                        })
                            .done(function () {


                                        var layers = [

                                            // WMTS layers
                                            {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesWorldImagery)), enabled: true},
                                            {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesWorldStreetMap)), enabled: false},
                                            {layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilitiesWorldTopoMap)), enabled: false},

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
            });
    });