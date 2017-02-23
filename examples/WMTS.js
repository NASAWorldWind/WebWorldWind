/*
 * Copyright (C) 2016 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs([
        '../src/WorldWind',
        '../examples/LayerManager'
    ],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Standard World Wind layers
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
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

        // Web Map Tiling Service information from
        var serviceAddress = "https://tiles.geoservice.dlr.de/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0";
        // Layer displaying Global Hillshade based on GMTED2010
        var layerName = "hillshade";

        var createLayer = function (xmlDom) {
            // Create a WmtsCapabilities object from the XML DOM
            var wmtsCapabilities = new WorldWind.WmtsCapabilities(xmlDom);
            // Retrieve a WmtsLayerCapabilities object by the desired layer name
            var wmtsLayerCapabilities = wmtsCapabilities.getLayer(layerName);
            // Form a configuration object from the WmtsLayerCapablities object
            var wmtsConfig = WorldWind.WmtsLayer.formLayerConfiguration(wmtsLayerCapabilities);
            // Create the WMTS Layer from the configuration object
            var wmtsLayer = new WorldWind.WmtsLayer(wmtsConfig);

            // Add the layers to World Wind and create the layer manager
            wwd.addLayer(wmtsLayer);
            layerManger.synchronizeLayerList();
        }

        $.get(serviceAddress).done(createLayer).fail(console.log("There was an error while retrieving the WMTS Capabilities document"));

    });