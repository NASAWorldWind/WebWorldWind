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
 * Illustrates how to display text at screen positions. Uses offsets to align the text relative to its position.
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

        var screenText,
            textAttributes = new WorldWind.TextAttributes(null),
            textLayer = new WorldWind.RenderableLayer("Screen Text");

        // Set up the common text attributes.
        textAttributes.color = WorldWind.Color.RED;

        // Create a screen text shape and its attributes.
        screenText = new WorldWind.ScreenText(
            new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1), "Upper Left");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        // Use offset to position the upper left corner of the text string at the shape's screen location.
        textAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1);
        screenText.attributes = textAttributes;
        textLayer.addRenderable(screenText);

        screenText = new WorldWind.ScreenText(
            new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0), "Lower Left");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        // Use offset to position the lower left corner of the text string at the shape's screen location.
        textAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);
        screenText.attributes = textAttributes;
        textLayer.addRenderable(screenText);

        screenText = new WorldWind.ScreenText(
            new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 1), "Upper Right");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        // Use offset to position the upper right corner of the text string at the shape's screen location.
        textAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 1);
        screenText.attributes = textAttributes;
        textLayer.addRenderable(screenText);

        screenText = new WorldWind.ScreenText(
            new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0), "Lower Right");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        // Use offset to position the lower right corner of the text string at the shape's screen location.
        textAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);
        screenText.attributes = textAttributes;
        textLayer.addRenderable(screenText);

        screenText = new WorldWind.ScreenText(
            new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5), "Center");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        // Use offset to position the center of the text string at the shape's screen location.
        textAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
        screenText.attributes = textAttributes;
        textLayer.addRenderable(screenText);

        // Add the text layer to the WorldWindow's layer list.
        wwd.addLayer(textLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        // Set up to handle picking.
        var handlePick = (function (o) {
            var pickPoint = wwd.canvasCoordinates(o.clientX, o.clientY);

            var pickList = wwd.pick(pickPoint);
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    var pickedObject = pickList.objects[p];
                    if (!pickedObject.isTerrain) {
                        if (pickedObject.userObject instanceof WorldWind.ScreenText) {
                            console.log(pickedObject.userObject.text);
                        }
                    }
                }
            }
        }).bind(this);

        // Listen for mouse moves and highlight text that the cursor rolls over.
        wwd.addEventListener("mousemove", handlePick);

        // Listen for taps on mobile devices and highlight text that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);
    });