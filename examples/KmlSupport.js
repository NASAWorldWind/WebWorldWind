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
        var kmlFileXml = "countries_world.kml";
        var xhr = new XMLHttpRequest();

        xhr.open("GET", kmlFileXml, true);
        xhr.onreadystatechange = (function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var text = xhr.responseText;
                    var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
                    wwd.addLayer(renderableLayer);

                    var kmlFilePromise = new KmlFile({document: text, local: true});
                    kmlFilePromise.then(function(kmlFile){
                        kmlFile.update(renderableLayer);

                        window.setInterval(function(){
                            console.log("Update file.");
                            kmlFile.update(renderableLayer);
                        }, 10000);
                    });
                }
            }
        }).bind(this);

        xhr.onerror = (function () {
            console.log("Error");
        }).bind(this);

        xhr.ontimeout = (function () {
            console.log("Timeout");
        }).bind(this);

        xhr.send(null);

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
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    });