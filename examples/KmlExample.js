/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        '../src/formats/kml/KmlFile',
        '../src/formats/kml/controls/KmlTreeVisibility',
        './LayerManager'],
    function (WorldWind,
              KmlFile,
              KmlTreeVisibility,
              LayerManager) {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Add imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var kmlFilePromise = new KmlFile('data/KML_Samples.kml', [new KmlTreeVisibility('treeControls', wwd)]);
        kmlFilePromise.then(function (kmlFile) {
            var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
            renderableLayer.currentTimeInterval = [
                new Date("Mon Aug 09 2015 12:10:10 GMT+0200 (Střední Evropa (letní čas))").valueOf(),
                new Date("Mon Aug 11 2015 12:10:10 GMT+0200 (Střední Evropa (letní čas))").valueOf()
            ];
            renderableLayer.addRenderable(kmlFile);

            wwd.addLayer(renderableLayer);
            wwd.redraw();
        });

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    });