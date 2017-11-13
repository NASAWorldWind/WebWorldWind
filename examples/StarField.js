/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs([
        './WorldWindShim',
        './LayerManager'
    ],
    function (WorldWind,
              LayerManager) {
        'use strict';

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow('canvasOne');

        var BMNGLayer = new WorldWind.BMNGLayer();
        var starFieldLayer = new WorldWind.StarFieldLayer();
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(BMNGLayer);

        //IMPORTANT: add the starFieldLayer before the atmosphereLayer
        wwd.addLayer(starFieldLayer);
        wwd.addLayer(atmosphereLayer);

        var date = new Date();
        starFieldLayer.time = date;
        atmosphereLayer.time = date;

        var layerManger = new LayerManager(wwd);
        wwd.redraw();

        wwd.redrawCallbacks.push(runSunSimulation);

        var sunSimulationCheckBox = document.getElementById('stars-simulation');
        var doRunSimulation = false;
        var timeStamp = Date.now();
        var factor = 1;

        sunSimulationCheckBox.addEventListener('change', onSunCheckBoxClick, false);

        function onSunCheckBoxClick() {
            doRunSimulation = this.checked;
            if (!doRunSimulation) {
                var date = new Date();
                starFieldLayer.time = date;
                atmosphereLayer.time = date;
            }
            wwd.redraw();
        }

        function runSunSimulation(wwd, stage) {
            if (stage === WorldWind.AFTER_REDRAW && doRunSimulation) {
                timeStamp += (factor * 60 * 1000);
                var date = new Date(timeStamp);
                starFieldLayer.time = date;
                atmosphereLayer.time = date;
                wwd.redraw();
            }
        }

    });