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
        attributes.outlineColor = WorldWind.Color.BLACK;
        attributes.interiorColor = new WorldWind.Color(1, 1, 1, 1.0);

        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;

        var circleShape = new WorldWind.SurfaceCircle(new WorldWind.Location(35, -110), 200e3, attributes);
        circleShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(circleShape);

        var ellipseShape = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -98), 300e3, 200e3, 45, attributes);
        ellipseShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(ellipseShape);

        var polygonBoundaries = [];
        polygonBoundaries.push(new WorldWind.Location(40, -100));
        polygonBoundaries.push(new WorldWind.Location(42, -105));
        polygonBoundaries.push(new WorldWind.Location(42, -110));
        polygonBoundaries.push(new WorldWind.Location(40, -112));
        var polygonShape = new WorldWind.SurfacePolygon(polygonBoundaries, attributes);
        polygonShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polygonShape);

        var multiPolygonOuterBoundaries = [];
        multiPolygonOuterBoundaries.push(new WorldWind.Location(40, -80));
        multiPolygonOuterBoundaries.push(new WorldWind.Location(42, -85));
        multiPolygonOuterBoundaries.push(new WorldWind.Location(42, -90));
        multiPolygonOuterBoundaries.push(new WorldWind.Location(40, -92));
        var multiPolygonInner1Boundaries = [];
        multiPolygonInner1Boundaries.push(new WorldWind.Location(40.5, -86));
        multiPolygonInner1Boundaries.push(new WorldWind.Location(41.5, -86));
        multiPolygonInner1Boundaries.push(new WorldWind.Location(41.5, -85));
        multiPolygonInner1Boundaries.push(new WorldWind.Location(40.5, -83));
        var multiPolygonInner2Boundaries = [];
        multiPolygonInner2Boundaries.push(new WorldWind.Location(41.5, -87));
        multiPolygonInner2Boundaries.push(new WorldWind.Location(40.5, -91));
        multiPolygonInner2Boundaries.push(new WorldWind.Location(41.5, -90));
        var multiPolygonBoundaries = [];
        multiPolygonBoundaries.push(multiPolygonOuterBoundaries);
        multiPolygonBoundaries.push(multiPolygonInner1Boundaries);
        multiPolygonBoundaries.push(multiPolygonInner2Boundaries);
        var multiPolygonShape = new WorldWind.SurfacePolygon(multiPolygonBoundaries, attributes);
        multiPolygonShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(multiPolygonShape);

        var polylineBoundaries = [];
        polylineBoundaries.push(new WorldWind.Location(45, -118));
        polylineBoundaries.push(new WorldWind.Location(40, -115));
        polylineBoundaries.push(new WorldWind.Location(43, -110));
        polylineBoundaries.push(new WorldWind.Location(50, -120));
        var polylineShape = new WorldWind.SurfacePolyline(polylineBoundaries, attributes);
        polylineShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polylineShape);

        var rectangleShape = new WorldWind.SurfaceRectangle(new WorldWind.Location(33, -105), 300e3, 200e3, 70, attributes);
        rectangleShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(rectangleShape);

        var sectorShape = new WorldWind.SurfaceSector(new WorldWind.Sector(45, 47, -110, -100), attributes);
        sectorShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(sectorShape);

        // Create a placemark.
        var placemark = new WorldWind.Placemark(new WorldWind.Position(41, -95, 0), false, null);
        placemark.altitudeMode = WorldWind.CLAMP_TO_GROUND;

        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.imageScale = 20;

        var highlightPlacemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        highlightPlacemarkAttributes.imageColor = WorldWind.Color.RED;
        highlightPlacemarkAttributes.imageScale = 20;

        placemark.attributes = placemarkAttributes;
        placemark.highlightAttributes = highlightPlacemarkAttributes;

        shapesLayer.addRenderable(placemark);

        wwd.goTo(new WorldWind.Position(40.42, -104.60, 2417000));

        // Create a layer manager for controlling layer visibility.
        new LayerManager(wwd);

        var shapeEditor = new WorldWind.ShapeEditor(wwd);

        document.getElementById("editCircleBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== circleShape) {
                shapeEditor.edit(circleShape, true, true, true, true);
            }
        });

        document.getElementById("editEllipseBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== ellipseShape) {
                shapeEditor.edit(ellipseShape, false, true, false, true);
            }
        });

        document.getElementById("editPlacemarkBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== placemark) {
                shapeEditor.edit(placemark, true, true, true, true);
            }
        });

        document.getElementById("editPolygonBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== polygonShape) {
                shapeEditor.edit(polygonShape, true, false, true, true);
            }
        });

        document.getElementById("editMultiPolygonBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== multiPolygonShape) {
                shapeEditor.edit(multiPolygonShape, true, true, true, true);
            }
        });

        document.getElementById("editPolylineBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== polylineShape) {
                shapeEditor.edit(polylineShape, true, true, true, true);
            }
        });

        document.getElementById("editRectangleBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== rectangleShape) {
                shapeEditor.edit(rectangleShape, true, false, false, true);
            }
        });

        document.getElementById("editSectorBtn").addEventListener("click", function(){
            var shape = shapeEditor.stop();
            if (shape !== sectorShape) {
                shapeEditor.edit(sectorShape, true, true, true, true);
            }
        });
    }
);
