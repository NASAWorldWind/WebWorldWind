/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WMTS_Hardcoded.js 2016-06-14 rsirac $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");



        var extent3857 = [-20037508.342789, -20037508.342789, 20037508.342789, 20037508.342789];
        var maxResolution3857 = 156543.03392803908;
        var resolutions3857 = [];
        for (var i = 0; i < 18; i++) {
            resolutions3857.push(maxResolution3857/Math.pow(2,i));
        }
        var wmtsLayerCaps = new WorldWind.WmtsLayerCaps("AMSR2_Cloud_Liquid_Water_Day", "Cloud Liquiq Water Day (GIBS)", "image/png", "http://map1.vis.earthdata.nasa.gov/wmts-webmerc/wmts.cgi?", "", "GoogleMapsCompatible_Level6", false, "EPSG:3857", {
            topLeftCorner: [-20037508.342789, 20037508.342789],
            extent: extent3857,
            resolutions: resolutions3857,
            tileSize: 256
        });
        var wmtsLayerCaps2 = new WorldWind.WmtsLayerCaps("World_Topo_Map", "World Topo Map (ArcGIS)", "image/jpeg", "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/WMTS??", "", "default028mm", false, "EPSG:3857", {
            topLeftCorner: [-20037508.342789, 20037508.342789],
            extent: extent3857,
            resolutions: resolutions3857,
            tileSize: 256
        });



        var extent4326 = [-180, -90, 180, 90];
        var maxResolution4326 = 0.703125;
        var resolutions4326 = [];
        for (i = 0; i < 18; i++) {
            resolutions4326.push(maxResolution4326/Math.pow(2,i));
        }
        var wmtsLayerCaps3 = new WorldWind.WmtsLayerCaps("eoc:world_relief_bw", "World Relief (GeoService)", "image/png", "https://tiles.geoservice.dlr.de/service/wmts?", "default", "EPSG:4326", true, "EPSG:4326", {
            topLeftCorner: [90, -180],
            extent: extent4326,
            resolutions: resolutions4326,
            tileSize: 256
        });

        var layers = [

            // WMTS layers
            {layer: new WorldWind.WmtsLayer(wmtsLayerCaps3), enabled: true},
            {layer: new WorldWind.WmtsLayer(wmtsLayerCaps, "", "", "2016-06-08"), enabled: true},
            {layer: new WorldWind.WmtsLayer(wmtsLayerCaps2), enabled: false},

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