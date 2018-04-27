/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: TMS.js 2016-07-21 rsirac $
 */

requirejs([
        '../src/WorldWind',
        '../examples/LayerManager'
    ],
    function (
        ww,
        LayerManager
    ) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Variable to store the capabilities document
        var TmsCapabilities;

        // Variable to store TMS layer from capabilities
        var layerFromCapabilities;

        // Variable indicating if every parsing is over
        var deferred = $.Deferred();


        /*                              Create a layer from capabilities document                             */
        {
            // Fetch capabilities document
            $.get('https://mrdata.usgs.gov/mapcache/tms/1.0.0/', function (response) {
                // Parse first capabilities
                TmsCapabilities = new WorldWind.TmsCapabilities(response);
            })
                .then(function () {
                    // Wait for parsing all associated capabilities
                    $.when.apply($, TmsCapabilities.promises).done(function () {
                            // Create the configuration object
                            var tmsConfig = new WorldWind.TmsLayer.formLayerConfiguration(TmsCapabilities.tileMaps[12]);
                            // Create the layer
                            layerFromCapabilities = new WorldWind.TmsLayer(tmsConfig, "TMS from capabilities");
                            // Show that every parsing is over
                            deferred.resolve();
                        }
                    );
                });
        }

        /*                                  Create a layer on the fly / hardcoded                                     */
        {
            // Create the resolutions array for tile matrix set
            var maxResolution = 0.703125;
            var resolutions = [];
            for (var i = 0; i < 18; i++) {
                resolutions.push(maxResolution / Math.pow(2, i));
            }

            var layerOnTheFly = new WorldWind.TmsLayer({
                extent: [-180, -90, 180, 90],
                resolutions: resolutions,
                origin: [-180, -90],
                format: "image/png",
                coordinateSystem: "EPSG:4326",
                size: 256,
                matrixSet: "WGS84",
                layerName: "mrds",
                service: "http://mrdata.usgs.gov/mapcache/tms/1.0.0/"
            }, "TMS on the fly");
        }


        // When every parsing is over
        $.when($,deferred).done(function () {

            // Create layer list
            var layers = [
                {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},
                {layer: layerFromCapabilities, enabled: true},
                {layer: layerOnTheFly, enabled: false},
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
