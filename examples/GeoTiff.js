/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        //var resourcesUrl = "./geotiff_data/world.tiff";
        //var resourcesUrl = "./geotiff_data/Namib.tiff";
        var resourcesUrl = "./geotiff_data/GeogToWGS84GeoKey5.tif";



        var geotiffObject = new WorldWind.GeoTiffReader(resourcesUrl);
        var geoTiffImage = geotiffObject.readAsImage(function (image) {
            //console.log(image);
            var surfaceGeoTiff = new WorldWind.SurfaceImage(
                new WorldWind.Sector(40, 50, -120, -100),
                new WorldWind.ImageSource(image));

            // GeoTiff test
            var geotiffLayer = new WorldWind.RenderableLayer("GeoTiff");
            geotiffLayer.addRenderable(surfaceGeoTiff);
            wwd.addLayer(geotiffLayer);

            // Create a layer manager for controlling layer visibility.
            var layerManger = new LayerManager(wwd);
        });
    });