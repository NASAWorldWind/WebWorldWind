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
 * Illustrates how to display and pick Paths.
 */
requirejs(['../src/WorldWind',
        '../examples/LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
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
            {layer: new WorldWind.CompassLayer(), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var polygonsLayer = new WorldWind.RenderableLayer(),
            width = 2.0,
            height = 1e4,
            attributes = new WorldWind.ShapeAttributes(null),
            textureCoordinates = [
                [new WorldWind.Vec2(0, 0), new WorldWind.Vec2(1, 0), new WorldWind.Vec2(1, 1), new WorldWind.Vec2(0, 1)]
            ],
            highlightAttributes, numPolygons;

        attributes.imageSource = "../examples/data/400x230-splash-nww.png";
        attributes.drawInterior = true;
        attributes.drawOutline = true;
        attributes.interiorColor = WorldWind.Color.WHITE;
        attributes.outlineColor = WorldWind.Color.BLUE;
        attributes.drawVerticals = true;

        highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;

        numPolygons = 0;
        for (var lat = -80; lat <= 80; lat += 2 * width) {
            for (var lon = -170; lon <= 170; lon += 2 * width) {
                var boundary = [
                        new WorldWind.Position(lat, lon, height),
                        new WorldWind.Position(lat, lon + width, height),
                        new WorldWind.Position(lat + width, lon + width, height),
                        new WorldWind.Position(lat + width, lon, height)
                    ],
                    polygon = new WorldWind.Polygon([boundary], null);

                polygon.altitudeMode = WorldWind.ABSOLUTE;
                polygon.extrude = attributes.drawVerticals;
                polygon.textureCoordinates = textureCoordinates;

                polygon.attributes = attributes;
                polygon.highlightAttributes = highlightAttributes;

                polygonsLayer.addRenderable(polygon);
                ++numPolygons;
            }
        }
        console.log(numPolygons + " Polygons");

        polygonsLayer.displayName = "Polygons";
        wwd.addLayer(polygonsLayer);

        // Draw the WorldWindow for the first time.
        wwd.redraw();

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        // Now set up to handle picking.

        var highlightedItems = [];

        // The pick-handling callback function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            // De-highlight any previously highlighted placemarks.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            //console.log(wwd.frameStatistics.frameTime);
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);
                }
            }

            // Update the window if we changed anything.
            if (redrawRequired) {
                wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("mousemove", handlePick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);
    });