/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * Illustrates how to consume imagery from a Web Map Tile Service (WMTS).
 */
requirejs([
        './WorldWindShim',
        '../examples/LayerManager'
    ],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Web Map Tiling Service information from
        var serviceAddress = "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?&request=GetCapabilities";
        // Layer displaying Gridded Population of the World density forecast
        var layerIdentifier = "GPW_Population_Density_2020";

        // Called asynchronously to parse and create the WMTS layer
        var createLayer = function (xmlDom) {
            // Create a WmtsCapabilities object from the XML DOM
            var wmtsCapabilities = new WorldWind.WmtsCapabilities(xmlDom);
            // Retrieve a WmtsLayerCapabilities object by the desired layer name
            var wmtsLayerCapabilities = wmtsCapabilities.getLayer(layerIdentifier);
            // Form a configuration object from the WmtsLayerCapabilities object
            var wmtsConfig = WorldWind.WmtsLayer.formLayerConfiguration(wmtsLayerCapabilities);
            // Create the WMTS Layer from the configuration object
            var wmtsLayer = new WorldWind.WmtsLayer(wmtsConfig);

            // Add the layers to WorldWind and update the layer manager
            wwd.addLayer(wmtsLayer);
            layerManager.synchronizeLayerList();
        };

        // Called if an error occurs during WMTS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createLayer).fail(logError);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });