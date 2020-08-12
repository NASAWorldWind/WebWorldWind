/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */

/**
 * Illustrates how to display SurfaceShapes.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
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

        // Create and set common attributes for the surface shapes.
        // Real apps typically create new attributes objects for each shape unless they know the attributes
        // can be shared among all shapes.
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.BLUE;
        attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        // Create common highlight attributes. These are displayed whenever the user hovers over the shapes.
        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);

        // Create a triangle surface polygon.
        var boundary = [];
        boundary.push(new WorldWind.Location(40, -100));
        boundary.push(new WorldWind.Location(45, -110));
        boundary.push(new WorldWind.Location(40, -120));
        var triangle = new WorldWind.SurfacePolygon(boundary, attributes);
        triangle.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(triangle);

        // Create a triangle surface polygon with a hole in it.
        var boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Location(40, -70));
        boundaries[0].push(new WorldWind.Location(45, -80));
        boundaries[0].push(new WorldWind.Location(40, -90));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Location(41, -87));
        boundaries[1].push(new WorldWind.Location(44, -80));
        boundaries[1].push(new WorldWind.Location(41, -73));
        var hollowTriangle = new WorldWind.SurfacePolygon(boundaries, attributes);
        hollowTriangle.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(hollowTriangle);

        // Create a surface circle with a radius of 200 km.
        var circle = new WorldWind.SurfaceCircle(new WorldWind.Location(35, -120), 200e3, attributes);
        circle.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(circle);

        // Create a surface ellipse with a minor radius of 200 km, a major radius of 300 km and a heading of 45 degrees.
        var ellipse = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -110), 300e3, 200e3, 45, attributes);
        ellipse.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(ellipse);

        // Create a surface rectangle with a width of 200 km, a height of 300 km and a heading of -45 degrees.
        var rectangle = new WorldWind.SurfaceRectangle(new WorldWind.Location(35, -100), 200e3, 300e3, -45, attributes);
        rectangle.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(rectangle);

        // Create a surface sector.
        var sector = new WorldWind.SurfaceSector(new WorldWind.Sector(33, 37, -95, -90), attributes);
        sector.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(sector);

        // Create a surface polyline. Use different attributes from the filled shapes.
        boundary = [];
        boundary.push(new WorldWind.Location(33, -75));
        boundary.push(new WorldWind.Location(37, -80));
        boundary.push(new WorldWind.Location(33, -85));
        attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = new WorldWind.Color(0, 1, 1, 0.5);
        highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = new WorldWind.Color(1, 1, 1, 1);
        var polyline = new WorldWind.SurfacePolyline(boundary, attributes);
        polyline.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polyline);

        // Set up a highlight controller to handle highlighting when the user hovers the shapes.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });