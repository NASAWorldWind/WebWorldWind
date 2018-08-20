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
 * Illustrates how to display text at geographic positions.
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

        var text,
            textAttributes = new WorldWind.TextAttributes(null),
            textLayer = new WorldWind.RenderableLayer("Oregon Peaks"),

            // A list of prominent peaks in the State of Oregon. Retrieved from:
            // https://en.wikipedia.org/wiki/List_of_Ultras_of_the_United_States
            peaks = [
                {'name': "South Sister", 'elevation': 3159, 'latitude': 44.1035, 'longitude': -121.7693},
                {'name': "Mount Hood", 'elevation': 3429, 'latitude': 45.3735, 'longitude': -121.6959},
                {'name': "Sacajawea Peak", 'elevation': 3000, 'latitude': 45.2450, 'longitude': -117.2929},
                {'name': "Mount Jefferson", 'elevation': 3201, 'latitude': 44.6743, 'longitude': -121.7996}
            ];

        // Set up the common text attributes.
        textAttributes.color = WorldWind.Color.CYAN;

        // Set the depth test property such that the terrain does not obscure the text.
        textAttributes.depthTest = false;

        // For each peak, create a text shape.
        for (var i = 0, len = peaks.length; i < len; i++) {
            var peak = peaks[i],
                peakPosition = new WorldWind.Position(peak.latitude, peak.longitude, peak.elevation);

            text = new WorldWind.GeographicText(peakPosition, peak.name + "\n" + peak.elevation + " m");

            // Set the text attributes for this shape.
            text.attributes = textAttributes;

            // Add the text to the layer.
            textLayer.addRenderable(text);
        }

        // Add the text layer to the WorldWindow's layer list.
        wwd.addLayer(textLayer);

        // Point the camera and zoom to the State of Oregon.
        // Observe the decluttering feature according to camera altitude while zooming.
        wwd.goTo(new WorldWind.Position(44.00, -120.33, 800000));

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });