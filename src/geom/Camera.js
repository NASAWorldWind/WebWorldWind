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
 * @exports Camera
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../geom/Position'
    ],
    function (ArgumentError,
              Logger,
              Position) {
        "use strict";

        var Camera = function () {
            /**
             * The geographic location of the camera.
             * @type {Location}
             */
            this.position = new Position(30, -110, 10e6);

            /**
             * Camera heading, in degrees clockwise from north.
             * @type {Number}
             * @default 0
             */
            this.heading = 0;

            /**
             * Camera tilt, in degrees.
             * @type {Number}
             * @default 0
             */
            this.tilt = 0;

            /**
             * Camera roll, in degrees.
             * @type {Number}
             * @default 0
             */
            this.roll = 0;

            // Intentionally not documented
            this._fieldOfView = 45;
        };

        Object.defineProperties(Camera.prototype, {
            /**
             * Camera vertical field of view, in degrees
             * @type {Number}
             * @default 45
             * @throws {ArgumentError} If the specified field of view is out of range.
             */
            fieldOfView: {
                get: function () {
                    return this._fieldOfView;
                },
                set: function (value) {
                    if (value <= 0 || value >= 180) {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "setFieldOfView", "Invalid field of view")
                        );
                    }
                    this._fieldOfView = value;
                }
            }
        });

        /**
         * Indicates whether the components of this object are equal to those of a specified object.
         * @param {Camera} otherView The object to test equality with. May be null or undefined, in which case this
         * function returns false.
         * @returns {boolean} true if all components of this object are equal to the corresponding
         * components of the specified object, otherwise false.
         */
        Camera.prototype.equals = function (otherView) {
            if (otherView) {
                return this.position.equals(otherView.position) &&
                    this.heading === otherView.heading &&
                    this.tilt === otherView.tilt &&
                    this.roll === otherView.roll;
            }

            return false;
        };

        /**
         * Creates a new object that is a copy of this object.
         * @returns {Camera} The new object.
         */
        Camera.prototype.clone = function () {
            var clone = new Camera();
            clone.copy(this);

            return clone;
        };

        /**
         * Copies the components of a specified object to this object.
         * @param {Camera} copyObject The object to copy.
         * @returns {Camera} A copy of this object equal to copyObject.
         * @throws {ArgumentError} If the specified object is null or undefined.
         */
        Camera.prototype.copy = function (copyObject) {
            if (!copyObject) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "copy", "missingObject"));
            }

            this.position.copy(copyObject.position);
            this.heading = copyObject.heading;
            this.tilt = copyObject.tilt;
            this.roll = copyObject.roll;

            return this;
        };

        /**
         * Returns a string representation of this object.
         * @returns {String}
         */
        Camera.prototype.toString = function () {
            return this.position.toString() + "," + this.heading + "\u00b0," + this.tilt + "\u00b0," + this.roll + "\u00b0";
        };

        return Camera;
    });