/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
 * Illustrates how to display SurfaceShapes.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Added imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: new WorldWind.ShowTessellationLayer(), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
            if (layers[l].opacity) {
                layers[l].layer.opacity = layers[l].opacity;
            }
        }

        new LayerManager(wwd);

        // Create a layer to hold the surface shapes.
        var shapesLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(shapesLayer);

        var sa = new WorldWind.ShapeAttributes();
        sa.outlineColor = new WorldWind.Color(0, 1, 0, 0.3);
        sa.outlineWidth = 6;

        var locations = [
            new WorldWind.Location(36.2, -113.11),
            new WorldWind.Location(36.2, -113),
            // new WorldWind.Location(36.25, -113.11),
            // new WorldWind.Location(36.25, -112)
        ];

        var shape = new WorldWind.SVSurfacePolyline(locations, sa);
        shapesLayer.addRenderable(shape);

        var locations = [
            new WorldWind.Location(36.15, -113.06),
            new WorldWind.Location(36.25, -113.06),
            // new WorldWind.Location(36.25, -113.11),
            // new WorldWind.Location(36.25, -112)
        ];
        shape = new WorldWind.SVSurfacePolyline(locations, sa);
        shapesLayer.addRenderable(shape);

        locations = [
            new WorldWind.Location(29.98, -100),
            new WorldWind.Location(49.98, -70),
            new WorldWind.Location(20, -100)
        ];

        sa = new WorldWind.ShapeAttributes();
        sa.outlineColor = new WorldWind.Color(0, 1, 0, 0.6);
        sa.outlineWidth = 3;
        sa.outlineStippleFactor = 1;
        sa.drawOutline = true;
        sa.interiorColor = new WorldWind.Color(0, 0, 1, 0.7);
        sa.drawInterior = false;
        shape = new WorldWind.SurfacePolyline(locations, sa);
        shapesLayer.addRenderable(shape);

        shape = new WorldWind.SurfaceCircle(new WorldWind.Location(38, -104), 100000, sa);
        shape.debug = false;
        shapesLayer.addRenderable(shape);

        var onDebugClick = function (ev) {
            shape.debug = ev.target.checked;
            wwd.redraw();
        };

        var onWidthInput = function (ev) {
            sa.outlineWidth = ev.target.value / 10;
            wwd.redraw();
        };

        var debugCheckBox = document.getElementById("debug-volume-checkbox");
        debugCheckBox.addEventListener('click', onDebugClick);

        var widthSlider = document.getElementById("outline-width-slider");
        widthSlider.addEventListener('input', onWidthInput);

        // wwd.navigator.lookAtLocation.latitude = 36.2;
        // wwd.navigator.lookAtLocation.longitude = -112.98;
        // wwd.navigator.range = 100000;
        // wwd.navigator.heading = 45;
        // wwd.navigator.tilt = 60;
        // wwd.redraw();
    }
);