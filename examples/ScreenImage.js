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
 * Illustrates how to display and pick ScreenImages.
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

        // Create a screen image that uses a static image. Place it in the lower-left corner.
        var screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);
        var screenImage1 = new WorldWind.ScreenImage(screenOffset, "data/400x230-splash-nww.png");
        screenImage1.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);
        screenImage1.imageScale = 0.3;

        // Create a screen image that uses a dynamically created image.

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

        // Create the screen image and place it in the upper-left corner.
        screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1);
        var screenImage2 = new WorldWind.ScreenImage(screenOffset, new WorldWind.ImageSource(canvas));
        screenImage2.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1);

        // Add the screen images to a layer and the layer to the WorldWindow's layer list.
        var screenImageLayer = new WorldWind.RenderableLayer();
        screenImageLayer.displayName = "Screen Images";
        screenImageLayer.addRenderable(screenImage1);
        screenImageLayer.addRenderable(screenImage2);
        wwd.addLayer(screenImageLayer);

        // Now set up to handle picking.

        // The common pick-handling function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    // If the compass is picked, reset the navigator heading to 0 to re-orient the globe.
                    if (pickList.objects[p].userObject instanceof WorldWind.Compass) {
                        wwd.navigator.heading = 0;
                        wwd.redraw();
                    }
                    else if (pickList.objects[p].userObject instanceof WorldWind.ScreenImage) {
                        console.log("Screen image picked");
                    }
                }
            }
        };

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("mousemove", handlePick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });