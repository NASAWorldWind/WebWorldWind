/*
* Copyright 2015-2017 WorldWind Contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
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

        // Create a simple surface polygon, a triangle.
        var boundary = [];
        boundary.push(new WorldWind.Location(40, -100));
        boundary.push(new WorldWind.Location(42, -105));
        boundary.push(new WorldWind.Location(40, -110));

        // Create and set attributes for it. The shapes below except the surface polyline use this same attributes
        // object. Real apps typically create new attributes objects for each shape unless they know the attributes
        // can be shared among shapes.
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.BLACK;
        attributes.interiorColor = new WorldWind.Color(1, 1, 1, 1.0);

        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;

        var polyShape = new WorldWind.SurfacePolygon(boundary, attributes);
        polyShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polyShape);

        var circleShape = new WorldWind.SurfaceCircle(new WorldWind.Location(35, -110), 200e3, attributes);
        circleShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(circleShape);

        var ellipseShape = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -98), 300e3, 200e3, 45, attributes);
        ellipseShape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(ellipseShape);

        wwd.goTo(new WorldWind.Position(40.42, -104.60, 2417000));

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        var shapeEditor = new WorldWind.ShapeEditor(wwd, null);

        document.getElementById("editPolyBtn").addEventListener("click", function(){
            if(document.getElementById("editPolyBtn").innerHTML === "Start edit polygon"){
                shapeEditor.shape = polyShape;
                shapeEditor.shape.highlighted = true;
                shapeEditor.setArmed(true);

                document.getElementById("editPolyBtn").innerHTML = "Stop edit polygon";
                document.getElementById("editCircleBtn").disabled = true;
                document.getElementById("editEllipseBtn").disabled = true;
            }
            else{
                shapeEditor.shape.highlighted = false;
                shapeEditor.setArmed(false);

                document.getElementById("editPolyBtn").innerHTML = "Start edit polygon";
                document.getElementById("editCircleBtn").disabled = false;
                document.getElementById("editEllipseBtn").disabled = false;
            }
        });

        document.getElementById("editCircleBtn").addEventListener("click", function(){
            if(document.getElementById("editCircleBtn").innerHTML === "Start edit circle"){
                shapeEditor.shape = circleShape;
                shapeEditor.shape.highlighted = true;
                shapeEditor.setArmed(true);

                document.getElementById("editCircleBtn").innerHTML = "Stop edit circle";
                document.getElementById("editPolyBtn").disabled = true;
                document.getElementById("editEllipseBtn").disabled = true;
            }
            else{
                shapeEditor.shape.highlighted = false;
                shapeEditor.setArmed(false);

                document.getElementById("editCircleBtn").innerHTML = "Start edit circle";
                document.getElementById("editPolyBtn").disabled = false;
                document.getElementById("editEllipseBtn").disabled = false;
            }
        });

        document.getElementById("editEllipseBtn").addEventListener("click", function(){
            if(document.getElementById("editEllipseBtn").innerHTML === "Start edit ellipse"){
                shapeEditor .shape = ellipseShape;
                shapeEditor.shape.highlighted = true;
                shapeEditor.setArmed(true);

                document.getElementById("editEllipseBtn").innerHTML = "Stop edit ellipse";
                document.getElementById("editCircleBtn").disabled = true;
                document.getElementById("editPolyBtn").disabled = true;
            }
            else{
                shapeEditor.shape.highlighted = false;
                shapeEditor.setArmed(false);

                document.getElementById("editEllipseBtn").innerHTML = "Start edit ellipse";
                document.getElementById("editCircleBtn").disabled = false;
                document.getElementById("editPolyBtn").disabled = false;
            }
        });
    }
);
