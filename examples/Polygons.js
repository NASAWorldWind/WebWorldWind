/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display and pick Polygons.
 *
 * @version $Id: Polygons.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Add imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer to hold the polygons.
        var polygonsLayer = new WorldWind.RenderableLayer();
        polygonsLayer.displayName = "Polygons";
        wwd.addLayer(polygonsLayer);

        // Define an outer and an inner boundary to make a polygon with a hole.
        var boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Position(40, -100, 1e5));
        boundaries[0].push(new WorldWind.Position(45, -110, 1e5));
        boundaries[0].push(new WorldWind.Position(40, -120, 1e5));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Position(41, -103, 1e5));
        boundaries[1].push(new WorldWind.Position(44, -110, 1e5));
        boundaries[1].push(new WorldWind.Position(41, -117, 1e5));

        // Create the polygon and assign its attributes.

        var polygon = new WorldWind.Polygon(boundaries, null);
        polygon.altitudeMode = WorldWind.ABSOLUTE;
        polygon.extrude = true; // extrude the polygon edges to the ground

        var polygonAttributes = new WorldWind.ShapeAttributes(null);
        polygonAttributes.drawInterior = true;
        polygonAttributes.drawOutline = true;
        polygonAttributes.outlineColor = WorldWind.Color.BLUE;
        polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
        polygonAttributes.drawVerticals = polygon.extrude;
        polygonAttributes.applyLighting = true;
        polygon.attributes = polygonAttributes;

        // Create and assign the polygon's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
        polygon.highlightAttributes = highlightAttributes;

        // Add the polygon to the layer and the layer to the WorldWindow's layer list.
        polygonsLayer.addRenderable(polygon);

        // Create a textured polygon with extruded and textured sides.
        boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Position(40, -90, 1e5));
        boundaries[0].push(new WorldWind.Position(40, -80, 1e5));
        boundaries[0].push(new WorldWind.Position(45, -80, 1e5));
        boundaries[0].push(new WorldWind.Position(45, -90, 1e5));

        polygon = new WorldWind.Polygon(boundaries, null);
        polygon.altitudeMode = WorldWind.ABSOLUTE;
        polygon.extrude = true;
        polygon.textureCoordinates = [
            [new WorldWind.Vec2(0, 0), new WorldWind.Vec2(1, 0), new WorldWind.Vec2(1, 1), new WorldWind.Vec2(0, 1)]
        ];

        polygonAttributes = new WorldWind.ShapeAttributes(null);
        // Specify a texture for the polygon and its four extruded sides.
        polygonAttributes.imageSource = [
            "../images/400x230-splash-nww.png", // polygon texture image
            "../images/400x230-splash-nww.png", // first-side texture image
            "../images/400x230-splash-nww.png", // second-side texture image
            "../images/400x230-splash-nww.png", // third-side texture image
            "../images/400x230-splash-nww.png"  // fourth-side texture image
        ];
        polygonAttributes.drawInterior = true;
        polygonAttributes.drawOutline = true;
        polygonAttributes.outlineColor = WorldWind.Color.BLUE;
        polygonAttributes.interiorColor = WorldWind.Color.WHITE;
        polygonAttributes.drawVerticals = polygon.extrude;
        polygonAttributes.applyLighting = true;
        polygon.attributes = polygonAttributes;
        highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        polygon.highlightAttributes = highlightAttributes;

        polygonsLayer.addRenderable(polygon);

        // Create a textured polygon with a hole in it. Don't extrude the sides.
        boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Position(30, -100, 1e5));
        boundaries[0].push(new WorldWind.Position(30, -90, 1e5));
        boundaries[0].push(new WorldWind.Position(35, -90, 1e5));
        boundaries[0].push(new WorldWind.Position(35, -100, 1e5));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Position(32, -96, 1e5));
        boundaries[1].push(new WorldWind.Position(32, -94, 1e5));
        boundaries[1].push(new WorldWind.Position(33, -94, 1e5));
        boundaries[1].push(new WorldWind.Position(33, -96, 1e5));

        polygon = new WorldWind.Polygon(boundaries, null);
        polygon.altitudeMode = WorldWind.ABSOLUTE;
        polygon.extrude = false;
        polygon.textureCoordinates = [
            [new WorldWind.Vec2(0, 0), new WorldWind.Vec2(1, 0), new WorldWind.Vec2(1, 1), new WorldWind.Vec2(0, 1)],
            [new WorldWind.Vec2(0.4, 0.4), new WorldWind.Vec2(0.6, 0.4), new WorldWind.Vec2(0.6, 0.6),
                new WorldWind.Vec2(0.4, 0.6)]
        ];

        polygonAttributes = new WorldWind.ShapeAttributes(null);
        polygonAttributes.imageSource = "../images/400x230-splash-nww.png";
        polygonAttributes.drawInterior = true;
        polygonAttributes.drawOutline = true;
        polygonAttributes.outlineColor = WorldWind.Color.BLUE;
        polygonAttributes.interiorColor = WorldWind.Color.WHITE;
        polygonAttributes.drawVerticals = polygon.extrude;
        polygonAttributes.applyLighting = true;
        polygon.attributes = polygonAttributes;
        highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        polygon.highlightAttributes = highlightAttributes;

        polygonsLayer.addRenderable(polygon);

        // Create a textured polygon with a hole at the north pole. Extrude the boundaries and apply a dynamically
        // created texture to them.
        boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Position(85, -45, 1e5));
        boundaries[0].push(new WorldWind.Position(85, +45, 1e5));
        boundaries[0].push(new WorldWind.Position(85, +135, 1e5));
        boundaries[0].push(new WorldWind.Position(85, -135, 1e5));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Position(89, -45, 1e5));
        boundaries[1].push(new WorldWind.Position(89, +45, 1e5));
        boundaries[1].push(new WorldWind.Position(89, +135, 1e5));
        boundaries[1].push(new WorldWind.Position(89, -135, 1e5));

        polygon = new WorldWind.Polygon(boundaries, null);
        polygon.altitudeMode = WorldWind.ABSOLUTE;
        polygon.extrude = true;
        polygon.textureCoordinates = [
            [new WorldWind.Vec2(0, 0), new WorldWind.Vec2(1, 0), new WorldWind.Vec2(1, 1), new WorldWind.Vec2(0, 1)],
            [new WorldWind.Vec2(0.4, 0.4), new WorldWind.Vec2(0.6, 0.4), new WorldWind.Vec2(0.6, 0.6),
                new WorldWind.Vec2(0.4, 0.6)]
        ];

        // Create a custom image for the extruded sides.

        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2  - 0.5, innerRadius = 5, outerRadius = 20;

        canvas.width = size;
        canvas.height = size;

        var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.5, 'rgb(0, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');

        ctx2d.fillStyle = gradient;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();

        polygonAttributes = new WorldWind.ShapeAttributes(null);
        polygonAttributes.imageSource = [
            "../images/400x230-splash-nww.png",
            new WorldWind.ImageSource(canvas)
        ];
        polygonAttributes.drawInterior = true;
        polygonAttributes.drawOutline = true;
        polygonAttributes.outlineColor = WorldWind.Color.BLUE;
        polygonAttributes.interiorColor = WorldWind.Color.WHITE;
        polygonAttributes.drawVerticals = polygon.extrude;
        polygonAttributes.applyLighting = true;
        polygon.attributes = polygonAttributes;
        highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        polygon.highlightAttributes = highlightAttributes;

        polygonsLayer.addRenderable(polygon);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    });