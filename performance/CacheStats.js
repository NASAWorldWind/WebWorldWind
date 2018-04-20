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

        // var statsLayer = new StatsDisplayLayer(wwd);
        // var tCache = wwd.globe.tessellator.tileCache;
        // statsLayer.addLabel("Tessellator");
        // statsLayer.addStatistic("tileCache:", function () {
        //     return tCache.usedCapacity.toString() + "/" + tCache.capacity.toString()
        // });
        // statsLayer.addLabel("Elevation model");
        // var emTileStats = function () {
        //     var em = wwd.globe.elevationModel;
        //     var tcUsed = 0, tcCap = 0;
        //     for (var i = 0, n = em.coverages.length; i < n; i++) {
        //         var etc = em.coverages[i].tileCache;
        //         tcUsed += etc.usedCapacity;
        //         tcCap += etc.capacity;
        //     }
        //
        //     return tcUsed.toString() + "/" + tcCap.toString();
        // };
        // statsLayer.addStatistic("tileCache:", emTileStats);
        // var emImageStats = function () {
        //     var em = wwd.globe.elevationModel;
        //     var icUsed = 0, icCap = 0;
        //     for (var i = 0, n = em.coverages.length; i < n; i++) {
        //         var ic = em.coverages[i].imageCache;
        //         icUsed += ic.usedCapacity;
        //         icCap += ic.capacity;
        //     }
        //
        //     return icUsed.toString() + "/" + icCap.toString();
        // };
        // statsLayer.addStatistic("imageCache:", emImageStats);
        //
        //
        // wwd.addLayer(statsLayer);

        var layerManager = new LayerManager(wwd);
        //            Count,Sum,Min,Max,startTime
        var ttcStats=[0,0,Number.MAX_VALUE,-Number.MAX_VALUE];
        var itcStats=[0,0,Number.MAX_VALUE,-Number.MAX_VALUE];
        var rtcStats=[0,0,Number.MAX_VALUE,-Number.MAX_VALUE];
        var tucStats=[0,0,Number.MAX_VALUE,-Number.MAX_VALUE];
        var tlcStats=[0,0,Number.MAX_VALUE,-Number.MAX_VALUE];

        var statTimeStart=Date.now();
        function addStat(stat,statArray) {
            statArray[0]++;
            statArray[1]+=stat;
            statArray[2]=Math.min(statArray[2],stat);
            statArray[3]=Math.max(statArray[3],stat);
        }

        function redrawCallback(worldWindow, stage) {
            if (stage !== WorldWind.AFTER_REDRAW) {
                return; // ignore after redraw events
            }
            var fs=wwd.frameStatistics;
            addStat(fs.terrainTileCount,ttcStats);
            addStat(fs.imageTileCount,itcStats);
            addStat(fs.renderedTileCount,rtcStats);
            addStat(fs.tileUpdateCount,tucStats);
            addStat(fs.textureLoadCount,tlcStats);
        }

        function printStats(label,statArray) {
            console.log(label,"Avg:",statArray[1]/statArray[0],"Min:",statArray[2],"Max:",statArray[3],"N:",statArray[0]);
        }

        // setInterval(function () {
        //     console.log("Elapsed Time",(Date.now()-statTimeStart)/1000,"s");
        //     printStats("terrainTileCount",ttcStats);
        //     printStats("imageTileCount",itcStats);
        //     printStats("renderedTileCount",rtcStats);
        //     printStats("tileUpdateCount",tucStats);
        //     printStats("textureLoadCount",tlcStats);
        // }, 4000);
        wwd.redrawCallbacks.push(redrawCallback);
    }
);