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
 * Illustrates how to display shapes built with triangles.
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

        // Create a mesh that displays a texture image from an image file.

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
        meshAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);
        meshAttributes.imageSource = "data/400x230-splash-nww.png";
        meshAttributes.applyLighting = true;

        // Create the mesh's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
        highlightAttributes.applyLighting = false;

        // Create the mesh.
        var mesh = new WorldWind.TriangleMesh(meshPositions, meshIndices, meshAttributes);
        mesh.textureCoordinates = texCoords;
        mesh.outlineIndices = outlineIndices;
        mesh.highlightAttributes = highlightAttributes;

        // Add the mesh to a layer and the layer to the WorldWindow's layer list.
        var meshLayer = new WorldWind.RenderableLayer();
        meshLayer.displayName = "Triangle Mesh";
        meshLayer.addRenderable(mesh);
        wwd.addLayer(meshLayer);

        // Create a mesh that displays a custom image created with a 2D canvas.

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

        // Use the same attributes as before, except for the image source, which is now the custom image.
        meshAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        meshAttributes.imageSource = new WorldWind.ImageSource(canvas);

        // Use the same highlight attributes as the previous shape. Point the image source to the custom image.
        highlightAttributes = new WorldWind.ShapeAttributes(highlightAttributes);
        highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);

        // Create the mesh.
        mesh = new WorldWind.TriangleMesh(meshPositions, meshIndices, meshAttributes);
        mesh.textureCoordinates = texCoords;
        mesh.outlineIndices = outlineIndices;
        mesh.highlightAttributes = highlightAttributes;

        // Add the mesh to the layer.
        meshLayer.addRenderable(mesh);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });