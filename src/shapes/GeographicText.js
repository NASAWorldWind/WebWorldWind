/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeographicText
 * @version $Id: GeographicText.js 3262 2015-06-25 16:50:39Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../shapes/Text',
        '../geom/Vec3'
    ],
    function (ArgumentError,
              Logger,
              Text,
              Vec3) {
        "use strict";

        /**
         * Constructs a geographic text shape at a specified position.
         * @alias GeographicText
         * @constructor
         * @augments Text
         * @classdesc Represents a string of text displayed at a geographic position.
         * <p>
         * See also {@link ScreenText}.
         *
         * @param {Position} position The text's geographic position.
         * @param {String} text The text to display.
         * @throws {ArgumentError} If either the specified position or text is null or undefined.
         */
        var GeographicText = function (position, text) {
            if (!position) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Text", "constructor", "missingPosition"));
            }

            Text.call(this, text);

            /**
             * This text's geographic position.
             * The [TextAttributes.offset]{@link TextAttributes#offset} property indicates the relationship of the
             * text string to this position.
             * @type {Position}
             */
            this.position = position;

            /**
             * Indicates the group ID of the declutter group to include this Text shape. This shape
             * is decluttered relative to all other shapes within its group by the default
             * [declutter filter]{@link WorldWindow#declutter}. To prevent decluttering of this shape, set its
             * declutter group to 0.
             * @type {Number}
             * @default 1
             */
            this.declutterGroup = 1;
        };

        // Internal use only. Intentionally not documented.
        GeographicText.placePoint = new Vec3(0, 0, 0); // Cartesian point corresponding to this placemark's geographic position

        GeographicText.prototype = Object.create(Text.prototype);

        /**
         * Creates a new geographic text object that is a copy of this one.
         * @returns {GeographicText} The new geographic text object.
         */
        GeographicText.prototype.clone = function () {
            var clone = new GeographicText(this.position, this.text);

            clone.copy(this);
            clone.pickDelegate = this.pickDelegate ? this.pickDelegate : this;

            return clone;
        };

        // Documented in superclass.
        GeographicText.prototype.render = function (dc) {
            // Filter out instances outside any projection limits.
            if (dc.globe.projectionLimits
                && !dc.globe.projectionLimits.containsLocation(this.position.latitude, this.position.longitude)) {
                return;
            }

            Text.prototype.render.call(this, dc);
        };

        // Documented in superclass.
        GeographicText.prototype.computeScreenPointAndEyeDistance = function (dc) {
            // Compute the text's model point and corresponding distance to the eye point.
            dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
                this.altitudeMode, GeographicText.placePoint);

            if (!dc.navigatorState.frustumInModelCoordinates.containsPoint(GeographicText.placePoint)) {
                return false;
            }

            this.eyeDistance = this.alwaysOnTop ? 0 : dc.navigatorState.eyePoint.distanceTo(GeographicText.placePoint);

            // Compute the text's screen point in the OpenGL coordinate system of the WorldWindow by projecting its model
            // coordinate point onto the viewport. Apply a depth offset in order to cause the text to appear above nearby
            // terrain. When text is displayed near the terrain portions of its geometry are often behind the terrain,
            // yet as a screen element the text is expected to be visible. We adjust its depth values rather than moving
            // the text itself to avoid obscuring its actual position.
            if (!dc.navigatorState.projectWithDepth(GeographicText.placePoint, this.depthOffset, this.screenPoint)) {
                return false;
            }

            return true;
        };

        return GeographicText;
    });