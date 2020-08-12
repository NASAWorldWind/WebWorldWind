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
 * Illustrates how to display GeographicMesh shapes.
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

        // Create a mesh with a texture image.

        // Create the mesh.
        var mesh = new WorldWind.GeographicMesh(meshPositions, null);

        // Create and assign the mesh's attributes. Light this mesh.
        var meshAttributes = new WorldWind.ShapeAttributes(null);
        meshAttributes.outlineColor = WorldWind.Color.BLUE;
        meshAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);
        meshAttributes.imageSource = "data/400x230-splash-nww.png";
        meshAttributes.applyLighting = true;
        mesh.attributes = meshAttributes;

        // Create and assign the mesh's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);
        highlightAttributes.applyLighting = false;
        mesh.highlightAttributes = highlightAttributes;

        // Add the mesh to a layer and the layer to the WorldWindow's layer list.
        var meshLayer = new WorldWind.RenderableLayer();
        meshLayer.displayName = "Geographic Mesh";
        meshLayer.addRenderable(mesh);
        wwd.addLayer(meshLayer);

        // Create a mesh that displays a custom image.

        // Create custom image with a 2D canvas.
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
        highlightAttributes = new WorldWind.ShapeAttributes(meshAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.WHITE;
        mesh.highlightAttributes = highlightAttributes;

        // Add the shape to the layer.
        meshLayer.addRenderable(mesh);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });