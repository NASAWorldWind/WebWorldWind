/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports CoordinateController
 * @version $Id: CoordinateController.js 3313 2015-07-10 17:59:29Z dcollins $
 */
define(function () {
    "use strict";

    /**
     * Constructs a coordinate controller for a specified {@link WorldWindow}.
     * @alias CoordinateController
     * @constructor
     * @classdesc Provides a coordinate controller to interactively update DOM elements indicating the eye position
     * and terrain position associated with a World Window.
     * @param {WorldWindow} worldWindow The World Window to associate this coordinate controller with.
     */
    var CoordinateController = function (worldWindow) {
        /**
         * The World Window associated with this coordinate controller.
         * @type {WorldWindow}
         */
        this.worldWindow = worldWindow;

        // Internal. Intentionally not documented.
        this.updateTimeout = null;
        this.updateInterval = 50;
        this.mousePoint = null;
        this.isTouchDevice = false;
        this.scratchPos = new WorldWind.Position();

        // Setup to update the coordinate elements each time the World Window is repainted.
        var self = this;
        worldWindow.redrawCallbacks.push(function (wwd, stage) {
            if (stage == WorldWind.AFTER_REDRAW) {
                self.handleRedraw();
            }
        });

        // Setup to track the cursor position relative to the World Window's canvas. Listen to touch events in order
        // to recognize and ignore simulated mouse events in mobile browsers.
        window.addEventListener("mousemove", function (event) {
            self.handleMouseEvent(event);
        });
        window.addEventListener("touchstart", function (event) {
            self.handleTouchEvent(event);
        });
    };

    CoordinateController.prototype.handleRedraw = function () {
        var self = this;
        if (self.updateTimeout) {
            return; // we've already scheduled an update; ignore redundant redraw events
        }

        self.updateTimeout = window.setTimeout(function () {
            self.update();
            self.updateTimeout = null;
        }, self.updateInterval);
    };

    CoordinateController.prototype.update = function () {
        this.updateEyePosition();
        this.updateTerrainPosition();
    };

    CoordinateController.prototype.updateEyePosition = function () {
        // Look for the DOM element to update, and exit if none exists.
        var elem = $("#eyeAltitude");
        if (!elem) {
            return;
        }

        // Compute the World Window's current eye position.
        var wwd = this.worldWindow,
            navigatorState = wwd.navigator.currentState(),
            eyePoint = navigatorState.eyePoint,
            eyePos = wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], this.scratchPos);

        // Update the DOM element with the current eye altitude.
        var html = this.formatAltitude(eyePos.altitude, eyePos.altitude < 1000 ? "m" : "km");
        elem.html(html);
    };

    CoordinateController.prototype.updateTerrainPosition = function () {
        // Look for the DOM elements to update, and exit if none exist.
        var terrainLat = $("#terrainLatitude"),
            terrainLon = $("#terrainLongitude"),
            terrainElev = $("#terrainElevation");
        if (!terrainLat && !terrainLon && !terrainElev) {
            return;
        }

        // Pick the terrain at the mouse point when we've received at least one mouse event. Otherwise assume that we're
        // on a touch device and pick at the center of the World Window's canvas.
        var wwd = this.worldWindow,
            mousePoint = this.mousePoint,
            centerPoint = new WorldWind.Vec2(wwd.canvas.clientWidth / 2, wwd.canvas.clientHeight / 2),
            terrainObject;

        if (!mousePoint) {
            terrainObject = wwd.pickTerrain(centerPoint).terrainObject();
        } else if (wwd.viewport.containsPoint(mousePoint)) {
            terrainObject = wwd.pickTerrain(mousePoint).terrainObject();
        }

        // Update the DOM elements with the current terrain position.
        if (terrainObject) {
            terrainLat.html(this.formatLatitude(terrainObject.position.latitude));
            terrainLon.html(this.formatLongitude(terrainObject.position.longitude));
            terrainElev.html(this.formatAltitude(terrainObject.position.altitude, "m"));
        } else {
            terrainLat.empty();
            terrainLon.empty();
            terrainElev.empty();
        }

        if (wwd.globe.is2D()) {
            terrainElev.hide();
        } else {
            terrainElev.show();
        }
    };

    CoordinateController.prototype.formatLatitude = function (number) {
        var suffix = number < 0 ? "\u00b0S" : "\u00b0N";
        return Math.abs(number).toFixed(2) + suffix;
    };

    CoordinateController.prototype.formatLongitude = function (number) {
        var suffix = number < 0 ? "\u00b0W" : "\u00b0E";
        return Math.abs(number).toFixed(2) + suffix;
    };

    CoordinateController.prototype.formatAltitude = function (number, units) {
        // Convert from meters to the desired units format.
        if (units === "km") {
            number /= 1e3;
        }

        // Round to the nearest integer and place a comma every three digits. See the following Stack Overflow thread
        // for more information:
        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + units;
    };

    CoordinateController.prototype.handleMouseEvent = function (event) {
        if (this.isTouchDevice) {
            return; // ignore simulated mouse events in mobile browsers
        }

        this.mousePoint = this.worldWindow.canvasCoordinates(event.clientX, event.clientY);
        this.worldWindow.redraw();
    };

    //noinspection JSUnusedLocalSymbols
    CoordinateController.prototype.handleTouchEvent = function (event) {
        this.isTouchDevice = true; // suppress simulated mouse events in mobile browsers
        this.mousePoint = null;
    };

    return CoordinateController;
});