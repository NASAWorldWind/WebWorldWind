/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";
        
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: false},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: false},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: false}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }
        
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        var timeStamp = Date.now();
        wwd.addLayer(atmosphereLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        var sunSimulationCheckBox = document.getElementById('sun-simulation');
        var sunInterval = 0;
        sunSimulationCheckBox.addEventListener('change', onSunCheckBoxClick, false);

        function onSunCheckBoxClick() {
            if (this.checked) {
                runSunSimulation();
            }
            else {
                atmosphereLayer.time = null;
                clearInterval(sunInterval);
                wwd.redraw();
            }
        }

        function runSunSimulation() {
            sunInterval = setInterval(function () {
                timeStamp += 180 * 1000;
                atmosphereLayer.time = new Date(timeStamp);
                wwd.redraw();
            }, 64);
        }

    });


