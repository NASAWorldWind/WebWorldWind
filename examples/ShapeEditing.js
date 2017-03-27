/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to use ShapeEditorController.
 *
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

        var shape = new WorldWind.SurfacePolygon(boundary, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a polygon with a hole in it.
        var boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Location(40, -90));
        boundaries[0].push(new WorldWind.Location(42, -93));
        boundaries[0].push(new WorldWind.Location(40, -98));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Location(40.34, -96.3));
        boundaries[1].push(new WorldWind.Location(41.33, -93.18));
        boundaries[1].push(new WorldWind.Location(40.35, -91.57));

        shape = new WorldWind.SurfacePolygon(boundaries, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface circle with a radius of 200 km.
        shape = new WorldWind.SurfaceCircle(new WorldWind.Location(35.76, -113.7), 200e3, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface ellipse with a minor radius of 200 km, a major radius of 300 km and a heading of 45 degrees.
        shape = new WorldWind.SurfaceEllipse(new WorldWind.Location(36.06, -104.95), 300e3, 200e3, 0, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface rectangle with a width of 200 km, a height of 300 km and a heading of 45 degrees.
        shape = new WorldWind.SurfaceRectangle(new WorldWind.Location(35.73, -96.49), 200e3, 300e3, 30, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a surface polyline. Use different attributes then for the filled shapes.
        boundary = [];
        boundary.push(new WorldWind.Location(38.62, -110.9));
        boundary.push(new WorldWind.Location(41.91, -114.71));
        boundary.push(new WorldWind.Location(38.03, -118.10));

        attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.BLACK;

        highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;

        shape = new WorldWind.SurfacePolyline(boundary, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        wwd.goTo(new WorldWind.Position(40.42, -104.60, 2417000));
        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle shape editor
        var shapeEditorController = new WorldWind.ShapeEditorController(wwd);
    }
);