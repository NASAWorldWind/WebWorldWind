/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs(['../src/WorldWind',
        './LayerManager',
        '../src/layer/WmsLayer'],
    function (ww,
              LayerManager,
              WmsLayer) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

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

        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "http://neowms.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
        // Layer displaying Average Temparature
        var layerName = "MOD_LSTD_CLIM_M";

        // Callback function to execute upon retrieval of the XML WMS GetCapabilities document
        var createWmsLayer = function () {
            // Create a WmsCapabilities object from the returned XML
            var wms = new WorldWind.WmsCapabilities(this.responseXML);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            var wmsLayerCapabilities = wms.getNamedLayer(layerName);
            // Form a configuration object from the WmsLayerCapability object
            var wmsConfig = WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
            // Modify a configuration property (optional)
            wmsConfig.title = "Average Surface Temp";
            // Create the WMS Layer
            var wmsLayer = new WorldWind.WmsLayer(wmsConfig);

            // Add to the existing list of layers
            layers.push(
                {layer: wmsLayer, enabled: true}
            );

            // Add the layers to World Wind and create the layer manager
            createLayerManager();
        };

        var createLayerManager = function () {
            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                wwd.addLayer(layers[l].layer);
            }

            // Create a layer manager for controlling layer visibility.
            var layerManger = new LayerManager(wwd);
        };

        // Execute the WMS XML GetCapabilities request
        var req = new XMLHttpRequest();
        req.addEventListener('load', createWmsLayer);
        req.open('GET', serviceAddress);
        req.send();
    });