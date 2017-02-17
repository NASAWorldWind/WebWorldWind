/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display SurfaceShapes.
 *
 * @version $Id: SurfaceShapes.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
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

        // Create a simple surface polygon, a triangle.
        var boundary = [];
        boundary.push(new WorldWind.Location(40, -100));
        boundary.push(new WorldWind.Location(45, -110));
        boundary.push(new WorldWind.Location(40, -120));

        // Create and set attributes for it. The shapes below except the surface polyline use this same attributes
        // object. Real apps typically create new attributes objects for each shape unless they know the attributes
        // can be shared among shapes.
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.BLUE;
        attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);

        var shape = new WorldWind.SurfacePolygon(boundary, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a polygon with a hole in it.
        var boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Location(40, -70));
        boundaries[0].push(new WorldWind.Location(45, -80));
        boundaries[0].push(new WorldWind.Location(40, -90));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Location(41, -73));
        boundaries[1].push(new WorldWind.Location(44, -80));
        boundaries[1].push(new WorldWind.Location(41, -87));

        shape = new WorldWind.SurfacePolygon(boundaries, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface circle with a radius of 200 km.
        shape = new WorldWind.SurfaceCircle(new WorldWind.Location(35, -120), 200e3, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface ellipse with a minor radius of 200 km, a major radius of 300 km and a heading of 45 degrees.
        shape = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -110), 300e3, 200e3, 45, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface rectangle with a width of 200 km, a height of 300 km and a heading of -45 degrees.
        shape = new WorldWind.SurfaceRectangle(new WorldWind.Location(35, -100), 200e3, 300e3, -45, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface sector.
        shape = new WorldWind.SurfaceSector(new WorldWind.Sector(33, 37, -95, -90), attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface polyline. Use different attributes then for the filled shapes.
        boundary = [];
        boundary.push(new WorldWind.Location(33, -75));
        boundary.push(new WorldWind.Location(37, -80));
        boundary.push(new WorldWind.Location(33, -85));

        attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = new WorldWind.Color(0, 1, 1, 0.5);

        highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = new WorldWind.Color(1, 1, 1, 1);

        shape = new WorldWind.SurfacePolyline(boundary, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    }
);