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
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Add imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var kmlFilePromise = new WorldWind.KmlFile('data/KML_Samples.kml', [new WorldWind.KmlTreeVisibility('treeControls', wwd)]);
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

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    });