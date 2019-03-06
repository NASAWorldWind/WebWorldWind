/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
 * Illustrates how to use ShapeEditor.
 *
 */

requirejs(['./WorldWindShim',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Added imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
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

        // Create and set attributes for it. The shapes below except the surface polyline use this same attributes
        // object. Real apps typically create new attributes objects for each shape unless they know the attributes
        // can be shared among shapes.
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.RED;
        attributes.interiorColor = new WorldWind.Color(0.8, 0.9, 0.9, 1.0);

        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        highlightAttributes.outlineWidth = 5;

        var polygonBoundaries = [];
        polygonBoundaries.push(new WorldWind.Location(40, -100));
        polygonBoundaries.push(new WorldWind.Location(42, -105));
        polygonBoundaries.push(new WorldWind.Location(42, -110));
        polygonBoundaries.push(new WorldWind.Location(40, -112));
        var polygonShape = new WorldWind.SurfacePolygon(polygonBoundaries, attributes);
        polygonShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polygonShape);

        wwd.goTo(new WorldWind.Position(40.42, -104.60, 2417000));

        // Create a layer manager for controlling layer visibility.
        new LayerManager(wwd);

        var shapeEditor = new WorldWind.ShapeEditor(wwd);

        var config = {
            move: true,
            reshape: true,
            rotate: true,
            manageControlPoint: true
        };

        shapeEditor.edit(polygonShape, config);
    }
);
