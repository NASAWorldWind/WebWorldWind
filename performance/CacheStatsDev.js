/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
requirejs(['../src/WorldWind',
        './layers/StatsDisplayLayer',
        '../examples/LayerManager'],
    function (WorldWind,
              StatsDisplayLayer,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.ShowTessellationLayer(), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var statsLayer = new StatsDisplayLayer(wwd);
        var tCache = wwd.globe.tessellator.tileCache;
        statsLayer.addLabel("Tessellator");
        statsLayer.addStatistic("tileCache:", function () {
            return tCache.usedCapacity.toString() + "/" + tCache.capacity.toString()
        });
        statsLayer.addLabel("Elevation model");
        var emTileStats = function () {
            var em = wwd.globe.elevationModel;
            var tcUsed = 0, tcCap = 0;
            //for (var i = 0, n = em.coverages.length; i < n; i++) {
                var etc = em.tileCache;
                tcUsed += etc.usedCapacity;
                tcCap += etc.capacity;
            //}

            return tcUsed.toString() + "/" + tcCap.toString();
        };
        statsLayer.addStatistic("tileCache:", emTileStats);
        var emImageStats = function () {
            var em = wwd.globe.elevationModel;
            var icUsed = 0, icCap = 0;
            //for (var i = 0, n = em.coverages.length; i < n; i++) {
                var ic = em.imageCache;
                icUsed += ic.usedCapacity;
                icCap += ic.capacity;
            //}

            return icUsed.toString() + "/" + icCap.toString();
        };
        statsLayer.addStatistic("imageCache:", emImageStats);


        wwd.addLayer(statsLayer);

        var layerManager = new LayerManager(wwd);

    }
);