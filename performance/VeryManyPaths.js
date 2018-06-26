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

        var makePath = function (startPosition, heading, length, numPositions) {
            var dLength = length / (numPositions - 1),
                positions = [],
                ll, path, attributes;

            for (var i = 0; i < numPositions; i++) {
                ll = WorldWind.Location.greatCircleLocation(startPosition, heading, i * dLength, new WorldWind.Location(0, 0));
                positions.push(new WorldWind.Position(ll.latitude, ll.longitude, startPosition.altitude))
            }

            path = new WorldWind.Path(positions, null);
            path.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            path.extrude = true;

            attributes = new WorldWind.ShapeAttributes(null);
            attributes.outlineColor = WorldWind.Color.BLUE;
            attributes.interiorColor = WorldWind.Color.CYAN;
            attributes.drawOutline = true;
            attributes.drawInterior = true;
            attributes.drawVerticals = true;
            path.attributes = attributes;

            attributes = new WorldWind.ShapeAttributes(attributes);
            attributes.outlineColor = WorldWind.Color.RED;
            attributes.interiorColor = WorldWind.Color.WHITE;
            path.highlightAttributes = attributes;

            return path;
        };

        var makePaths = function (layer, origin, numPaths, length, numPositions) {
            var angleDelta = 360.0 / numPaths;

            for (var i = 0; i < numPaths; i++) {
                layer.addRenderable(makePath(origin, i * angleDelta, length, numPositions));
            }
        };

        var pathsLayer = new WorldWind.RenderableLayer(),
            startPosition = new WorldWind.Position(45, -120, 100e3),
            numPaths = 2000,
            numPositions = 30,
            pathLength = 10 * WorldWind.Angle.DEGREES_TO_RADIANS;

        makePaths(pathsLayer, startPosition, numPaths, pathLength, numPositions);
        pathsLayer.displayName = "Paths";
        wwd.addLayer(pathsLayer);

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