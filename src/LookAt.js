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
 * @exports LookAt
 */
define([
        './error/ArgumentError',
        './util/Logger',
        './geom/Matrix',
        './geom/Position',
        './geom/Vec3',
        './WorldWindowView'],
    function (ArgumentError,
              Logger,
              Matrix,
              Position,
              Vec3,
              WorldWindowView) {
        "use strict";

        var LookAt = function (worldWindow) {
            WorldWindowView.call(this, worldWindow);

            this.viewType="LookAt";
            /**
             * The geographic position at the center of the viewport.
             * @type {Location}
             */
            this.lookAtPosition = new Position(30, -110, 0);

            /**
             * Look at heading, in degrees clockwise from north.
             * @type {Number}
             * @default 0
             */
            this.heading = 0;

            /**
             * Look at tilt, in degrees.
             * @type {Number}
             * @default 0
             */
            this.tilt = 0;

            /**
             * Look at roll, in degrees.
             * @type {Number}
             * @default 0
             */
            this.roll = 0;

            /**
             * The distance from the eye point to its look-at location.
             * @type {Number}
             * @default 10,000 kilometers
             */
            this.range = 10e6; // TODO: Compute initial range to fit globe in viewport.
        };

        LookAt.prototype = Object.create(WorldWindowView.prototype);

        LookAt.prototype.computeViewingTransform = function (modelview) {
            if (!modelview) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAt", "computeViewingTransform", "missingModelview"));
            }

            modelview.setToIdentity();
            modelview.multiplyByLookAtModelview(this.lookAtPosition, this.range, this.heading, this.tilt, this.roll, this.wwd.globe);

            return modelview;
        };

        /**
         * Indicates whether the components of this object are equal to those of a specified object.
         * @param {LookAt} otherLookAt The object to test equality with. May be null or undefined, in which case this
         * function returns false.
         * @returns {boolean} true if all components of this object are equal to the corresponding
         * components of the specified object, otherwise false.
         */
        LookAt.prototype.equals = function (otherLookAt) {
            if (otherLookAt) {
                return this.lookAtPosition.equals(otherLookAt.lookAtPosition) &&
                    this.heading === otherLookAt.heading &&
                    this.tilt === otherLookAt.tilt &&
                    this.roll === otherLookAt.roll &&
                    this.range === otherLookAt.range;
            }

            return false;
        };

        LookAt.prototype.asLookAt = function (result) {
            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAt", "asLookAt", "missingResult"));
            }

            return result.copy(this);
        };

        LookAt.prototype.asCamera = function (result) {
            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAt", "asLookAt", "missingResult"));
            }

            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "LookAt", "asCamera", "notImplementedYet"));
        };

        /**
         * Creates a new object that is a copy of this object.
         * @returns {LookAt} The new object.
         */
        LookAt.prototype.clone = function () {
            var clone = new LookAt(this.wwd);
            clone.copy(this);

            return clone;
        };

        /**
         * Copies the components of a specified object to this object.
         * @param {LookAt} copyObject The object to copy.
         * @returns {LookAt} A copy of this object equal to copyObject.
         * @throws {ArgumentError} If the specified object is null or undefined.
         */
        LookAt.prototype.copy = function (copyObject) {
            if (!copyObject) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAt", "copy", "missingObject"));
            }

            WorldWindowView.prototype.copy.call(this, copyObject);

            this.lookAtPosition.copy(copyObject.lookAtPosition);
            this.heading=copyObject.heading;
            this.tilt=copyObject.tilt;
            this.roll=copyObject.roll;
            this.range=copyObject.range;

            return this;
        };

        return LookAt;
    });