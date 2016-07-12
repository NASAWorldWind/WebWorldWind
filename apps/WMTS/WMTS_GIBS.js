/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_GIBS.js 2016-06-09 rsirac $
 */

requirejs(['../../src/WorldWind',
        '../../examples/MyLayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        ww.configuration.baseUrl += "../";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        // NASA layers
        var wmtsCapabilities;

        $.get('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?SERVICE=WMTS&request=GetCapabilities', function (response) {
            // $.get('http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?SERVICE=WMTS&request=GetCapabilities', function (response) { //THIS FILE DOESN'T WORK UNTIL ZOOM LEVEL 3

            wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
            console.log(response);

        })
            .done(function () {
                // var toto = WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[0], "style", "matrix", "imageFormat");
                // console.log(toto);
                // var titi = new WorldWind.WmtsLayer(toto, "2016-06-08");
                // console.log(titi);



                // Internal layer
                var layers = [
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: true}
                ];

                // GIBS layers
                for (var i = 0 ; i < wmtsCapabilities.contents.layer.length ; i++ ) {
                    layers.push({layer: new WorldWind.WmtsLayer(WorldWind.WmtsLayer.formLayerConfiguration(wmtsCapabilities.contents.layer[i]), "2016-06-08"), enabled: false});
                }

                // var extent3857 = [-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789];
                // var maxResolution3857 = 156543.03392803908;
                // var resolutions3857 = [];
                // for (var i = 0; i < 18; i++) {
                //     resolutions3857.push(maxResolution3857/Math.pow(2,i));
                // }
                // var matrixset = WorldWind.WmtsLayer.createTileMatrixSet(
                //     {
                //         matrixSet : "GoogleMapsCompatible_Level6",
                //         prefix : false,
                //         projection : "EPSG:3857",
                //         topLeftCorner: [-20037508.342789, 20037508.342789],
                //         extent: extent3857,
                //         resolutions: resolutions3857,
                //         tileSize: 256
                //     }
                // );
                //
                // var remi = new WorldWind.WmtsLayer(
                //     {
                //         identifier : "AMSR2_Cloud_Liquid_Water_Day",
                //         url : "http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?",
                //         format : "image/png",
                //         tileMatrixSet : matrixset,
                //         style : "default",
                //         title : "Cloud Liquiq Water Day (GIBS)"
                //     }
                //     , "2016-06-08");
                //
                // console.log(remi);
                // layers.push({layer: titi, enabled: true});
                // layers.push({layer: remi, enabled: true});






                // Internal layers
                layers.push(
                    {layer: new WorldWind.CompassLayer(), enabled: true},
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
                );


                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    wwd.addLayer(layers[l].layer);
                }


                // Create a layer manager for controlling layer visibility.
                var layerManager = new LayerManager(wwd);

            });
    });