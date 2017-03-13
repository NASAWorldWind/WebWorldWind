/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display GeographicMesh shapes.
 *
 * @version $Id: GeographicMeshes.js 3320 2015-07-15 20:53:05Z dcollins $
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

        // Create the mesh's positions.
        var meshPositions = [];
        for (var lat = 30; lat <= 35; lat += 0.5) {
            var row = [];
            for (var lon = -120; lon <= -110; lon += 0.5) {
                // Create elevations that follow a sine wave in latitude and a cosine wave in longitude.
                var elevationScale =
                    Math.sin(((lat - 30) / 5) * 2 * Math.PI) * Math.cos(((lon + 120) / 10) * 2 * Math.PI);

                row.push(new WorldWind.Position(lat, lon, 100e3 * (1 + elevationScale)));
            }

            meshPositions.push(row);
        }

        // Create the mesh.
        var mesh = new WorldWind.GeographicMesh(meshPositions, null);

        // Create and assign the mesh's attributes. Light this mesh.
        var meshAttributes = new WorldWind.ShapeAttributes(null);
        meshAttributes.outlineColor = WorldWind.Color.BLUE;
        meshAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);
        meshAttributes.imageSource = "../images/400x230-splash-nww.png";
        meshAttributes.applyLighting = true;
        mesh.attributes = meshAttributes;

        // Create and assign the mesh's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);
        highlightAttributes.applyLighting = false;
        mesh.highlightAttributes = highlightAttributes;

        // Add the mesh to a layer and the layer to the World Window's layer list.
        var meshLayer = new WorldWind.RenderableLayer();
        meshLayer.displayName = "Geographic Mesh";
        meshLayer.addRenderable(mesh);
        wwd.addLayer(meshLayer);

        // Create a mesh that displays a custom image.

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

        // Create the mesh's positions.
        meshPositions = [];
        for (lat = 30; lat <= 35; lat += 0.5) {
            row = [];
            for (lon = -100; lon <= -90; lon += 0.5) {
                row.push(new WorldWind.Position(lat, lon, 100e3));
            }

            meshPositions.push(row);
        }

        // Create the mesh.
        mesh = new WorldWind.GeographicMesh(meshPositions, null);

        // Create and assign the mesh's attributes.
        meshAttributes = new WorldWind.ShapeAttributes(null);
        meshAttributes.outlineColor = WorldWind.Color.BLUE;
        meshAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.7);
        meshAttributes.imageSource = new WorldWind.ImageSource(canvas);
        meshAttributes.applyLighting = false;
        mesh.attributes = meshAttributes;

        // Create and assign the mesh's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.WHITE;
        mesh.highlightAttributes = highlightAttributes;

        // Add the shape to the layer.
        meshLayer.addRenderable(mesh);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);
    });