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
            {layer: new WorldWind.BMNGLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var resourcesUrl = "http://worldwindserver.net/webworldwind/data/black_sea_rgb.tif";

        var geotiffObject = new WorldWind.GeoTiffReader(resourcesUrl);

        var geoTiffImage = geotiffObject.readAsImage(function (canvas) {
            var surfaceGeoTiff = new WorldWind.SurfaceImage(
                geotiffObject.metadata.bbox,
                new WorldWind.ImageSource(canvas)
            );

            var geotiffLayer = new WorldWind.RenderableLayer("GeoTiff");
            geotiffLayer.addRenderable(surfaceGeoTiff);
            wwd.addLayer(geotiffLayer);

            wwd.goTo(new WorldWind.Position(43.69, 28.54, 55000));

            // Create a layer manager for controlling layer visibility.
            var layerManger = new LayerManager(wwd);
        });
    });