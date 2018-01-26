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
 * @exports LookAtView
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

        var LookAtView = function (worldWindow) {
            WorldWindowView.call(this, worldWindow);

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

        LookAtView.prototype = Object.create(WorldWindowView.prototype);

        LookAtView.prototype.computeViewingTransform = function (modelview) {
            if (!modelview) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAtView", "computeViewingTransform", "missingModelview"));
            }

            modelview.setToIdentity();
            modelview.multiplyByLookAtModelview(this.lookAtPosition, this.range, this.heading, this.tilt, this.roll, this.wwd.globe);

            return modelview;
        };

        /**
         * Indicates whether the components of this object are equal to those of a specified object.
         * @param {LookAtView} otherLookAtView The object to test equality with. May be null or undefined, in which case this
         * function returns false.
         * @returns {boolean} true if all components of this object are equal to the corresponding
         * components of the specified object, otherwise false.
         */
        LookAtView.prototype.equals = function (otherLookAtView) {
            if (otherLookAtView) {
                return this.lookAtPosition.equals(otherLookAtView.lookAtPosition) &&
                    this.heading === otherLookAtView.heading &&
                    this.tilt === otherLookAtView.tilt &&
                    this.roll === otherLookAtView.roll &&
                    this.range === otherLookAtView.range;
            }

            return false;
        };

        LookAtView.isLookAtView=function(view) {
            return view.lookAtPosition !== undefined && view.heading !== undefined && view.tilt !== undefined && view.roll !== undefined && view.range !== undefined;
        };

        LookAtView.fromView = function (otherView, result) {
            if (!otherView) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAtView", "fromView", "missingOtherView"));
            }

            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAtView", "fromView", "missingResult"));
            }

            if (LookAtView.isLookAtView(otherView)) {
                return result.copy(otherView);
            }

            return null;
        };

        /**
         * Creates a new object that is a copy of this object.
         * @returns {LookAtView} The new object.
         */
        LookAtView.prototype.clone = function () {
            var clone = new LookAtView(this.wwd);
            clone.copy(this);

            return clone;
        };

        /**
         * Copies the components of a specified object to this object.
         * @param {LookAtView} copyObject The object to copy.
         * @returns {LookAtView} A copy of this object equal to copyObject.
         * @throws {ArgumentError} If the specified object is null or undefined.
         */
        LookAtView.prototype.copy = function (copyObject) {
            if (!copyObject) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LookAtView", "copy", "missingObject"));
            }

            WorldWindowView.prototype.copy.call(this, copyObject);

            this.lookAtPosition.copy(copyObject.lookAtPosition);
            this.heading=copyObject.heading;
            this.tilt=copyObject.tilt;
            this.roll=copyObject.roll;
            this.range=copyObject.range;

            return this;
        };

        return LookAtView;
    });