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

        // Create a layer to hold the surface shapes.
        var shapesLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(shapesLayer);

        var boundaries = [
            new WorldWind.Location(30, -100),
            new WorldWind.Location(30, -90),
            new WorldWind.Location(20, -90),
            new WorldWind.Location(20, -100)
        ];
        var shapeAttrs = new WorldWind.ShapeAttributes();
        shapeAttrs.drawInterior = true;
        shapeAttrs.interiorColor = new WorldWind.Color(0, 1, 0, 1);
        shapeAttrs.drawOutline = true;
        shapeAttrs.outlineColor = new WorldWind.Color(0, 0, 0, 0.3);
        shapeAttrs.outlineWidth = 20;
        var shape = new WorldWind.SurfacePolygon(boundaries, shapeAttrs);
        shape._textureCoordinates = [
            new WorldWind.Vec2(0, 1),
            new WorldWind.Vec2(1, 1),
            new WorldWind.Vec2(1, 0),
            new WorldWind.Vec2(0, 0)
        ];
        shapesLayer.addRenderable(shape);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    }
);