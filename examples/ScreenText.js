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
 * Illustrates how to display text at screen positions. Uses offsets to align the text relative to its position.
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

        var screenText,
            textAttributes = new WorldWind.TextAttributes(null),
            textLayer = new WorldWind.RenderableLayer("Screen Text");

        // Set up the common text attributes.
        textAttributes.color = WorldWind.Color.WHITE;
        textAttributes.font = new WorldWind.Font(20);

        // Create ScreenText shapes and their attributes.
        // Indicate the shape's placement on the screen by using an offset as an argument to construct a new ScreenText.
        // Use ScreenText.attributes.offset to position the text relative to the specified screen offset.

        // We will exemplify ScreenText creation in two ways.
        // In the first two ScreenTexts, we define the desired screen position and alignment by directly setting the
        // offset values at ScreenText creation. With the "Center" ScreenText, the offset values are edited
        // after ScreenText creation, overwriting the screenOffset and screenText attributes offset values.

        // Left
        screenText = new WorldWind.ScreenText(
            new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.5), "Left");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        textAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.5);
        screenText.attributes = textAttributes;
        textLayer.addRenderable(screenText);

        // Right
        screenText = new WorldWind.ScreenText(
            new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5), "Right");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        textAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);
        screenText.attributes = textAttributes;
        textLayer.addRenderable(screenText);

        // Center
        // Create an offset to feed it to the ScreenText constructor. Its offset values are irrelevant
        // and will be overwritten after the ScreenText's creation.
        var offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);
        screenText = new WorldWind.ScreenText(offset, "Center");
        textAttributes = new WorldWind.TextAttributes(textAttributes);
        // Edit the screen offset values to position the ScreenText at the center of the screen.
        screenText.screenOffset.x = 0.5;
        screenText.screenOffset.y = 0.5;
        screenText.attributes = textAttributes;
        // Align the ScreenText to its center point with its attributes offset.
        screenText.attributes.offset.x = 0.5;
        screenText.attributes.offset.y = 0.5;
        textLayer.addRenderable(screenText);

        // Add the text layer to the WorldWindow's layer list.
        wwd.addLayer(textLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });