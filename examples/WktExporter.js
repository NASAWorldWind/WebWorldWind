/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
 * Illustrates how to export surface shapes in Well-Known Text (WKT).
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
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
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

        // Create a layer and some surface shapes
        var shapesLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(shapesLayer);

        var boundary = [];
        boundary.push(new WorldWind.Location(40, -100));
        boundary.push(new WorldWind.Location(45, -110));
        boundary.push(new WorldWind.Location(40, -120));

        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.BLUE;
        attributes.interiorColor = new WorldWind.Color(1, 1, 1, 1.0);

        var shape = new WorldWind.SurfacePolyline(boundary, attributes);

        boundary = [];
        boundary.push(new WorldWind.Location(35, -90));
        boundary.push(new WorldWind.Location(39, -100));
        boundary.push(new WorldWind.Location(35, -110));

        shape = new WorldWind.SurfacePolygon(boundary, attributes);
        shapesLayer.addRenderable(shape);

        var boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Location(40, -70));
        boundaries[0].push(new WorldWind.Location(45, -80));
        boundaries[0].push(new WorldWind.Location(40, -90));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Location(41, -87));
        boundaries[1].push(new WorldWind.Location(44, -80));
        boundaries[1].push(new WorldWind.Location(41, -73));
        shape = new WorldWind.SurfacePolygon(boundaries, attributes);
        shapesLayer.addRenderable(shape);

        var placemark = new WorldWind.Placemark(new WorldWind.Position(41, -95, 0), true, null);
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.5);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

        placemark.label = "Test point";
        placemark.altitudeMode = WorldWind.CLAMP_TO_GROUND;
        placemark.attributes = placemarkAttributes;
        shapesLayer.addRenderable(placemark);

        shape = new WorldWind.SurfaceEllipse(new WorldWind.Location(30.00, -104.95), 300e3, 200e3, 0, attributes);
        shapesLayer.addRenderable(shape);

        shape = new WorldWind.SurfaceCircle(new WorldWind.Location(35.76, -113.7), 200e3, attributes);
        shapesLayer.addRenderable(shape);

        shape = new WorldWind.SurfaceRectangle(new WorldWind.Location(30.73, -96.49), 200e3, 300e3, 30, attributes);
        shapesLayer.addRenderable(shape);

        shape = new WorldWind.SurfaceSector(new WorldWind.Sector(33, 37, -88, -83), attributes);
        shapesLayer.addRenderable(shape);

        // Export the surface shapes on click
        function onExportWkt() {

            // This is the actual export action.
            var exportedWkt = WorldWind.WktExporter.exportRenderables(shapesLayer.renderables);

            document.getElementById("wktTxtArea").value = exportedWkt;
        }
        document.getElementById("exportWktBtn").onclick = onExportWkt;

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });
