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
        '../geom/Line',
        '../util/Logger',
        '../geom/LookAt',
        '../geom/Matrix',
        '../geom/Position',
        '../geom/Vec3',
        '../util/WWMath'
    ],
    function (ArgumentError,
              Line,
              Logger,
              LookAt,
              Matrix,
              Position,
              Vec3,
              WWMath) {
        "use strict";

        var Camera = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "constructor", "missingWorldWindow"));
            }

            /**
             * The WorldWindow associated with this camera.
             * @type {WorldWindow}
             * @readonly
             */
            this.wwd = worldWindow;

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
             * @default 0
             */
            this.tilt = 0;

            /**
             * Camera roll, in degrees.
             * @type {Number}
             * @default 0
             */
            this.roll = 0;

            /**
             * Camera vertical field of view, in degrees
             * @type {Number}
             * @default 45
             */
            this.fieldOfView = 45;

            /**
             * Internal use only.
             * A temp variable used to hold model view matrices during calculations. Using an object level temp property
             * negates the need for ad-hoc allocations and reduces load on the garbage collector.
             * @ignore
             */
            this.scratchModelview = Matrix.fromIdentity();

            /**
             * Internal use only.
             * A temp variable used to hold points during calculations. Using an object level temp property
             * negates the need for ad-hoc allocations and reduces load on the garbage collector.
             * @ignore
             */
            this.scratchPoint = new Vec3(0, 0, 0);

            /**
             * Internal use only.
             * A temp variable used to hold origin matrices during calculations. Using an object level temp property
             * negates the need for ad-hoc allocations and reduces load on the garbage collector.
             * @ignore
             */
            this.scratchOrigin = Matrix.fromIdentity();

            /**
             * Internal use only.
             * A temp variable used to hold positions during calculations. Using an object level temp property
             * negates the need for ad-hoc allocations and reduces load on the garbage collector.
             * @ignore
             */
            this.scratchPosition = new Position(0, 0, 0);

            /**
             * Internal use only.
             * A temp variable used to hold lines during calculations. Using an object level temp property
             * negates the need for ad-hoc allocations and reduces load on the garbage collector.
             * @ignore
             */
            this.scratchRay = new Line(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
        };

        /**
         * Internal use only.
         * Computes the model view matrix for this camera.
         * @ignore
         */
        Camera.prototype.computeViewingTransform = function (modelview) {
            if (!modelview) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "computeViewingTransform", "missingModelview"));
            }

            modelview.setToIdentity();
            modelview.multiplyByFirstPersonModelview(this.position, this.heading, this.tilt, this.roll, this.wwd.globe);

            return modelview;
        };

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
            var clone = new Camera(this.wwd);
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

            this.wwd = copyObject.wwd;
            this.position.copy(copyObject.position);
            this.heading = copyObject.heading;
            this.tilt = copyObject.tilt;
            this.roll = copyObject.roll;

            return this;
        };

        /**
         * Sets the properties of this Camera such that it mimics the supplied look at view. Note that repeated conversions
         * between a look at and a camera view may result in view errors due to rounding.
         * @param {LookAt} lookAt The look at view to mimic.
         * @returns {Camera} This camera set to mimic the supplied look at view.
         * @throws {ArgumentError} If the specified look at view is null or undefined.
         */
        Camera.prototype.setFromLookAt = function (lookAt) {
            if (!lookAt) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "setFromLookAt", "missingLookAt"));
            }

            var globe = this.wwd.globe,
                ve = this.wwd.verticalExaggeration,
                ray = this.scratchRay,
                originPoint = this.scratchPoint,
                modelview = this.scratchModelview,
                origin = this.scratchOrigin;

            lookAt.computeViewingTransform(globe, modelview);
            modelview.extractEyePoint(originPoint);

            globe.computePositionFromPoint(originPoint[0], originPoint[1], originPoint[2], this.position);
            origin.setToIdentity();
            origin.multiplyByLocalCoordinateTransform(originPoint, globe);
            modelview.multiplyMatrix(origin);

            this.heading = modelview.extractHeading(lookAt.roll); // disambiguate heading and roll
            this.tilt = modelview.extractTilt();
            this.roll = lookAt.roll; // roll passes straight through

            // Check if camera altitude is not under the surface and correct tilt
            var elevation = globe.elevationAtLocation(this.position.latitude, this.position.longitude) * ve + 10.0; // 10m above surface
            if(elevation > this.position.altitude) {
                // Set camera altitude above the surface
                this.position.altitude = elevation;
                // Compute new camera point
                globe.computePointFromPosition(this.position.latitude, this.position.longitude, this.position.altitude, originPoint);
                // Compute look at point
                globe.computePointFromPosition(lookAt.position.latitude, lookAt.position.longitude, lookAt.position.altitude, ray.origin);
                // Compute normal to globe in look at point
                globe.surfaceNormalAtLocation(lookAt.position.latitude, lookAt.position.longitude, ray.direction);
                // Calculate tilt angle between new camera point and look at point
                originPoint.subtract(ray.origin).normalize();
                var dot = ray.direction.dot(originPoint);
                if (dot >= -1 || dot <= 1) {
                    this.tilt = Math.acos(dot) / Math.PI * 180;
                }
            }

            return this;
        };

        /**
         * Converts the properties of this Camera to those of a look at view. Note that repeated conversions
         * between a look at and a camera view may result in view errors due to rounding.
         * @param {LookAt} result The look at view to hold the converted properties.
         * @returns {LookAt} A reference to the result parameter.
         * @throws {ArgumentError} If the specified result object is null or undefined.
         */
        Camera.prototype.getAsLookAt = function (result) {
            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "getAsLookAt", "missingResult"));
            }

            var globe = this.wwd.globe,
                viewport = this.wwd.viewport,
                forwardRay = this.scratchRay,
                modelview = this.scratchModelview,
                originPoint = this.scratchPoint,
                originPos = this.scratchPosition,
                origin = this.scratchOrigin;

            this.computeViewingTransform(modelview);

            // Pick terrain located behind the viewport center point
            var terrainObject = this.wwd.pick([viewport.width / 2, viewport.height / 2]).terrainObject();
            if (terrainObject) {
                // Use picked terrain position including approximate rendered altitude
                originPos.copy(terrainObject.position);
                globe.computePointFromPosition(originPos.latitude, originPos.longitude, originPos.altitude, originPoint);
            } else {
                // Center is outside the globe - use point on horizon
                modelview.extractEyePoint(forwardRay.origin);
                modelview.extractForwardVector(forwardRay.direction);

                var horizon = globe.horizonDistance(this.position.altitude);
                forwardRay.pointAt(horizon, originPoint);

                globe.computePositionFromPoint(originPoint[0], originPoint[1], originPoint[2], originPos);
            }

            origin.setToIdentity();
            origin.multiplyByLocalCoordinateTransform(originPoint, globe);
            modelview.multiplyMatrix(origin);

            result.position.copy(originPos);
            result.range = -modelview[11];
            result.heading = modelview.extractHeading(this.roll); // disambiguate heading and roll
            result.tilt = modelview.extractTilt();
            result.roll = this.roll; // roll passes straight through

            return result;
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

