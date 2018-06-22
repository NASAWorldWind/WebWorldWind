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
 * Illustrates the performance of deep picking with many surface shapes.
 */

requirejs(['../src/WorldWind',
        '../examples/LayerManager'],
    function (ww,
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
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: new WorldWind.FrameStatisticsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer to hold the footprints.
        var footprintsLayer = new WorldWind.RenderableLayer("Satellite Image Footprints");
        wwd.addLayer(footprintsLayer);

        // Tell the WorldWindow that we want deep picking.
        wwd.deepPicking = true;

        // Start out zoomed to the AOI
        wwd.navigator.lookAtLocation = new WorldWind.Location(44.2, -94.12);
        wwd.navigator.range = 625000;

        // Satellite image footprints
        var footprints = [];
        footprints.push([44.22596415476343, -95.50406, 44.24783068396879, -94.12976, 43.25939191053712, -94.11133, 43.23826255332707, -95.46323, 44.22596415476343, -95.50406]);
        footprints.push([45.14674718783555, -94.27255, 45.153769755990965, -92.875824, 44.165301274896635, -92.87793, 44.15851530960486, -94.25113, 45.14674718783555, -94.27255]);
        footprints.push([45.12551356202371, -95.54315, 45.148073182871244, -94.1474, 44.15979663371134, -94.12808, 44.137996748196564, -95.500336, 45.12551356202371, -95.54315]);
        footprints.push([43.42648714895223, -92.879425, 43.31125028050336, -92.924225, 43.26442286797419, -92.94232, 43.25815001081029, -94.23251, 44.246545441411556, -94.25299, 44.25335216097235, -92.87775, 43.42648714895223, -92.879425]);

        var locFootprints = [];
        for (var i = 0; i < footprints.length; i++) {
            var rawFootprint = footprints[i];
            var locFootprint = [];
            for (var j = 0; j < rawFootprint.length; j += 2) {
                locFootprint.push(new WorldWind.Location(rawFootprint[j], rawFootprint[j + 1]));
            }
            locFootprints.push(locFootprint);
        }
        // Create and set attributes for it. The shapes below except the surface polyline use this same attributes
        // object. Real apps typically create new attributes objects for each shape unless they know the attributes
        // can be shared among shapes.
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.RED;
        attributes.interiorColor = new WorldWind.Color(0.5, 0, 0, 0.25);

        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.interiorColor = new WorldWind.Color(0.5, 0.5, 0, 0.25);

        // Number of footprints for deep picking stress test
        var nTestFootprints = 1000;

        // Create surface polygons for the satellite image footprints
        var nTestPatterns = nTestFootprints / locFootprints.length;
        for (var t = 0; t < nTestPatterns; t++) {
            for (i = 0; i < locFootprints.length; i++) {
                var footprint = new WorldWind.SurfacePolygon(locFootprints[i], attributes);
                footprint.highlightAttributes = highlightAttributes;
                footprintsLayer.addRenderable(footprint);
            }
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        var highlightedItems = [];

        // The common pick-handling function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            // De-highlight any previously highlighted footprints.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                var numShapesPicked = 0;
                for (var p = 0; p < pickList.objects.length; p++) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);

                    // Detect whether the placemark's label was picked. If so, the "labelPicked" property is true.
                    // If instead the user picked the placemark's image, the "labelPicked" property is false.
                    // Applications might use this information to determine whether the user wants to edit the label
                    // or is merely picking the placemark as a whole.
                    if (pickList.objects[p].labelPicked) {
                        console.log("Label picked");
                    }

                    // Increment the number of items picked if a shape is picked.
                    if (!pickList.objects[p].isTerrain) {
                        ++numShapesPicked;
                    }
                }

                if (numShapesPicked > 0) {
                    console.log(numShapesPicked + " shapes picked");
                }
            }

            // Update the window if we changed anything.
            if (redrawRequired) {
                wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };

        // Listen for mouse moves and highlight the footprints that the cursor rolls over.
        wwd.addEventListener("mousemove", handlePick);

        // Listen for taps on mobile devices and highlight the footprints that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);
    }
);