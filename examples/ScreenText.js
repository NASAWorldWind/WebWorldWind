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
 * Illustrates how to display text overlays. Uses offsets to align the text relative to its position.
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

        var screenText, screenOffset;

        // Create a Renderable Layer to hold the ScreenTexts.
        var textLayer = new WorldWind.RenderableLayer("Screen Text");

        // Create left ScreenText
        screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.5);
        screenText = new WorldWind.ScreenText(screenOffset, "Left");
        // Use the attributes offset to position the left side of the text string at the shape's screen location.
        screenText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.5);
        textLayer.addRenderable(screenText);

        // Create right ScreenText
        screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);
        screenText = new WorldWind.ScreenText(screenOffset, "Right");
        // Use the attributes offset to position the right side of the text string at the shape's screen location.
        screenText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);
        textLayer.addRenderable(screenText);

        // The same screen offset value will be commonly used between the center-positioned ScreenTexts.
        // Their TextAttributes offsets will be used to adjust their text alignment.
        screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);

        // Center ScreenText, right-aligned
        screenText = new WorldWind.ScreenText(screenOffset, "Center, right-aligned.");
        // Use the attributes offset to right-align the text to the shape's screen location.
        screenText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);
        textLayer.addRenderable(screenText);

        // Center ScreenText, left-aligned
        screenText = new WorldWind.ScreenText(screenOffset, "Center, left-aligned.");
        // Use the attributes offset to left-align the text to the shape's screen location.
        screenText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0.5);
        textLayer.addRenderable(screenText);

        // Add the text layer to the WorldWindow's layer list.
        wwd.addLayer(textLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });