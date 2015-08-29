/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports HighlightController
 * @version $Id: HighlightController.js 3260 2015-06-25 01:06:21Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs a highlight controller and associates it with a specified world window.
         * @alias HighlightController
         * @constructor
         * @classdesc Monitors mouse-move and touch-device tap events and highlights shapes they identify.
         * @param {WorldWindow} worldWindow The world window to monitor for mouse-move and tap events.
         * @throws {ArgumentError} If the specified world window is null or undefined.
         */
        var HighlightController = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "HighlightController", "constructor",
                    "missingWorldWindow"));
            }

            /**
             * This controller's world window
             * @type {WorldWindow}
             * @readonly
             */
            this.worldWindow = worldWindow;

            var highlightedItems = [];

            var handlePick = function (o) {
                // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
                // the mouse or tap location.
                var x = o.clientX,
                    y = o.clientY;

                var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previous shapes

                // De-highlight any previously highlighted shapes.
                for (var h = 0; h < highlightedItems.length; h++) {
                    highlightedItems[h].highlighted = false;
                }
                highlightedItems = [];

                // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
                // relative to the upper left corner of the canvas rather than the upper left corner of the page.
                var pickList = worldWindow.pick(worldWindow.canvasCoordinates(x, y));
                if (pickList.objects.length > 0) {
                    redrawRequired = true;
                }

                // Highlight the items picked by simply setting their highlight flag to true.
                if (pickList.objects.length > 0) {
                    for (var p = 0; p < pickList.objects.length; p++) {
                        if (!pickList.objects[p].isTerrain) {
                            pickList.objects[p].userObject.highlighted = true;

                            // Keep track of highlighted items in order to de-highlight them later.
                            highlightedItems.push(pickList.objects[p].userObject);
                        }
                    }
                }

                // Update the window if we changed anything.
                if (redrawRequired) {
                    worldWindow.redraw(); // redraw to make the highlighting changes take effect on the screen
                }
            };

            // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
            this.worldWindow.addEventListener("mousemove", handlePick);

            // Listen for taps on mobile devices and highlight the placemarks that the user taps.
            var tapRecognizer = new WorldWind.TapRecognizer(this.worldWindow, handlePick);
        };

        return HighlightController;
    }
);