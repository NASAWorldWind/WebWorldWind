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
/**
 * Illustrates how to display SurfaceShapes.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Added imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: new WorldWind.ShowTessellationLayer(), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer to hold the surface shapes.
        var shapesLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(shapesLayer);

        var sa = new WorldWind.ShapeAttributes();
        sa.outlineColor = WorldWind.Color.GREEN;
        sa.outlineWidth = 6;

        var locations = [
            new WorldWind.Location(30, -100),
            new WorldWind.Location(50, -70)
        ];

        var shape = new WorldWind.SVSurfacePolyline(locations, sa);
        shapesLayer.addRenderable(shape);

        locations = [
            new WorldWind.Location(29.98, -100),
            new WorldWind.Location(49.98, -70),
            new WorldWind.Location(20, -100)
        ];

        sa = new WorldWind.ShapeAttributes();
        sa.outlineColor = WorldWind.Color.WHITE;
        sa.outlineWidth = 6;
        shape = new WorldWind.SurfacePolyline(locations, sa);
        shapesLayer.addRenderable(shape);
    }
);