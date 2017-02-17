/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS.js 2016-07-12 rsirac $
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

        // Variable to store the capabilities documents
        var wmtsCapabilities;

        // Fetch capabilities document
        $.get('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WMTS&request=GetCapabilities', function (response) {
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


                /*                                  Create a layer on the fly / hardcoded                             */
                {
                    // Create the resolutions array for tile matrix set
                    var maxResolution = 0.703125;
                    var resolutions = [];
                    for (var i = 0; i < 18; i++) {
                        resolutions.push(maxResolution / Math.pow(2, i));
                    }

                    // Create tile matrix set
                    var matrixset = WorldWind.WmtsLayer.createTileMatrixSet(
                        {
                            matrixSet: "EPSG:4326",
                            prefix: true,
                            projection: "EPSG:4326",
                            topLeftCorner: [90, -180],
                            extent: [-180, -90, 180, 90],
                            resolutions: resolutions,
                            tileSize: 256
                        }
                    );

                    // Create the layer
                    var layer2 = new WorldWind.WmtsLayer(
                        {
                            identifier: "eoc:world_relief_bw",
                            service: "https://tiles.geoservice.dlr.de/service/wmts?",
                            format: "image/png",
                            tileMatrixSet: matrixset,
                            style: "default",
                            title: "World Relief (GeoService)"
                        }
                    );
                }


                // Create layer list
                var layers = [
                    {layer: layer2, enabled: true},
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