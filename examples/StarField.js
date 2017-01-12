/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs([
        '../src/WorldWind',
        './LayerManager',
        '../thirdparty/sunCalculator'
    ],
    function (ww,
              LayerManager,
              sunCalculator) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");
        window.wwd = wwd;

        var BMNGLayer = new WorldWind.BMNGLayer();
        var starFieldLayer = new WorldWind.StarFieldLayer();
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(BMNGLayer);
        wwd.addLayer(atmosphereLayer);
        wwd.addLayer(starFieldLayer);

        atmosphereLayer.lightLocation = sunCalculator(new Date());
        var layerManger = new LayerManager(wwd);
        wwd.redraw();

        wwd._redrawCallbacks.push(runSunSimulation);

        var sunSimulationCheckBox = document.getElementById('sun-simulation');
        var doRunSimulation = false;
        var timeStamp = Date.now();
        var factor = 1;

        sunSimulationCheckBox.addEventListener('change', onSunCheckBoxClick, false);

        function onSunCheckBoxClick() {
            doRunSimulation = this.checked;
            if (!doRunSimulation) {
                var date = new Date();
                atmosphereLayer.lightLocation = sunCalculator(date);
                starFieldLayer.time = date;
            }
            wwd.redraw();
        }

        function runSunSimulation(wwd, stage) {
            if (stage === WorldWind.AFTER_REDRAW && doRunSimulation) {
                timeStamp += (factor * 60 * 1000);
                var date = new Date(timeStamp);
                atmosphereLayer.lightLocation = sunCalculator(date);
                starFieldLayer.time = date;
                wwd.redraw();
            }
        }

    });