/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        '../src/formats/kml/KmlFile',
        './LayerManager'],
    function (WorldWind,
              KmlFile,
              LayerManager) {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        wwd.goTo(new WorldWind.Location(30.0596696, 14.4656239));

        // Create a layer manager for controlling layer visibility.
        new LayerManager(wwd);

        // Now set up to handle highlighting.
        new WorldWind.HighlightController(wwd);

        var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(renderableLayer);

        var kmlFileOptions = {
            url: 'countries_world.kml'
        };
        var kmlFilePromise = new KmlFile(kmlFileOptions);
        kmlFilePromise.then(function(kmlFile) {
            kmlFile.update({layer: renderableLayer});
        });
    });