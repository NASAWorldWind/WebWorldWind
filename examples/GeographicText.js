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
 * Illustrates how to display text at geographic positions.
 */
requirejs(['./WorldWindShim',
        './LayerManager',
        './GeographicTextPeaks'],
    function (WorldWind,
              LayerManager,
              GeographicTextPeaks) {
        "use strict";

        // Tell WorldWind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var text,
            textAttributes = new WorldWind.TextAttributes(null),
            textLayer = new WorldWind.RenderableLayer("Colorado Peaks"),
            peaks = [
                {
                    'name': "Mount Elbert",
                    'state': "Colorado",
                    'elevation': 4401,
                    'latitude': 39.1178,
                    'longitude': -106.4454
                },
                {
                    'name': "Pikes Peak",
                    'state': "Colorado",
                    'elevation': 4302,
                    'latitude': 38.8405,
                    'longitude': -105.0442
                },
                {
                    'name': "Blanca Peak",
                    'state': "Colorado",
                    'elevation': 4376,
                    'latitude': 37.5775,
                    'longitude': -105.4856
                }
            ];

        // Set up the common text attributes.
        textAttributes.color = WorldWind.Color.CYAN;

        // Set the depth test property such that the terrain does not obscure the text.
        textAttributes.depthTest = false;

        // For each peak, create a text shape.
        for (var i = 0, len = peaks.length; i < len; i++) {
            var peak = peaks[i],
                peakPosition = new WorldWind.Position(peak.latitude, peak.longitude, peak.elevation);

            text = new WorldWind.GeographicText(peakPosition, peak.name + "\n" + peak.state);

            // Set the text attributes for this shape.
            text.attributes = textAttributes;

            // Add the text to the layer.
            textLayer.addRenderable(text);
        }

        // Add the text layer to the WorldWindow's layer list.
        wwd.addLayer(textLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

    });