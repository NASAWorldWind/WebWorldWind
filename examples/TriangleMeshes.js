/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display TriangleMesh shapes.
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
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

        var altitude = 100e3,
            numRadialPositions = 40,
            meshPositions = [],
            meshIndices = [],
            outlineIndices = [],
            texCoords = [],
            meshRadius = 5; // degrees

        // Create the mesh's positions, which are the center point of a circle followed by points on the circle.

        meshPositions.push(new WorldWind.Position(35, -115, altitude)); // the mesh center
        texCoords.push(new WorldWind.Vec2(0.5, 0.5));

        for (var angle = 0; angle < 360; angle += 360 / numRadialPositions) {
            var angleRadians = angle * WorldWind.Angle.DEGREES_TO_RADIANS,
                lat = meshPositions[0].latitude + Math.sin(angleRadians) * meshRadius,
                lon = meshPositions[0].longitude + Math.cos(angleRadians) * meshRadius,
                t = 0.5 * (1 + Math.sin(angleRadians)),
                s = 0.5 * (1 + Math.cos(angleRadians));

            meshPositions.push(new WorldWind.Position(lat, lon, altitude));
            texCoords.push(new WorldWind.Vec2(s, t));
        }

        // Create the mesh indices.
        for (var i = 1; i < numRadialPositions; i++) {
            meshIndices.push(0);
            meshIndices.push(i);
            meshIndices.push(i + 1);
        }
        // Close the circle.
        meshIndices.push(0);
        meshIndices.push(numRadialPositions);
        meshIndices.push(1);

        // Create the outline indices.
        for (var j = 1; j <= numRadialPositions; j++) {
            outlineIndices.push(j);
        }
        // Close the outline.
        outlineIndices.push(1);

        // Create the mesh's attributes. Light this mesh.
        var meshAttributes = new WorldWind.ShapeAttributes(null);
        meshAttributes.outlineColor = WorldWind.Color.BLUE;
        meshAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.7);
        meshAttributes.imageSource = "../images/400x230-splash-nww.png";
        meshAttributes.applyLighting = true;

        // Create the mesh's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);
        highlightAttributes.applyLighting = false;

        // Create the mesh.
        var mesh = new WorldWind.TriangleMesh(meshPositions, meshIndices, meshAttributes);
        mesh.textureCoordinates = texCoords;
        mesh.outlineIndices = outlineIndices;
        mesh.highlightAttributes = highlightAttributes;

        // Add the mesh to a layer and the layer to the World Window's layer list.
        var meshLayer = new WorldWind.RenderableLayer();
        meshLayer.displayName = "Triangle Mesh";
        meshLayer.addRenderable(mesh);
        wwd.addLayer(meshLayer);

        // Create a mesh that displays a custom image.

        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2 - 0.5, innerRadius = 5, outerRadius = 20;

        canvas.width = size;
        canvas.height = size;

        var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.5, 'rgb(0, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');

        ctx2d.fillStyle = gradient;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();

        // Create the mesh's positions.

        meshPositions = []; // Use a new positions array.
        meshPositions.push(new WorldWind.Position(35, -95, altitude)); // the mesh center

        for (angle = 0; angle < 360; angle += 360 / numRadialPositions) {
            angleRadians = angle * WorldWind.Angle.DEGREES_TO_RADIANS;
            lat = meshPositions[0].latitude + Math.sin(angleRadians) * meshRadius;
            lon = meshPositions[0].longitude + Math.cos(angleRadians) * meshRadius;

            meshPositions.push(new WorldWind.Position(lat, lon, altitude));
        }

        meshAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        meshAttributes.imageSource = new WorldWind.ImageSource(canvas);

        highlightAttributes = new WorldWind.ShapeAttributes(highlightAttributes);
        highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);

        // Create the mesh.
        mesh = new WorldWind.TriangleMesh(meshPositions, meshIndices, meshAttributes);
        mesh.textureCoordinates = texCoords;
        mesh.outlineIndices = outlineIndices;
        mesh.highlightAttributes = highlightAttributes;

        // Add the mesh to the layer.
        meshLayer.addRenderable(mesh);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    });