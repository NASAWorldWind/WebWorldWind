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
 * @exports CameraView
 */
define([
        './error/ArgumentError',
        './geom/Line',
        './util/Logger',
        './LookAtView',
        './geom/Matrix',
        './geom/Position',
        './geom/Vec3',
        './WorldWindowView',
        './util/WWMath'
    ],
    function (ArgumentError,
              Line,
              Logger,
              LookAtView,
              Matrix,
              Position,
              Vec3,
              WorldWindowView,
              WWMath) {
        "use strict";

        var CameraView = function (worldWindow) {
            WorldWindowView.call(this, worldWindow);

            /**
             * The geographic location of the camera.
             * @type {Location}
             */
            this.cameraPosition = new Position(30, -110, 10e6);

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

            // Internal. Intentionally not documented.
            this.scratchModelview = Matrix.fromIdentity();

            // Internal. Intentionally not documented.
            this.origin = Matrix.fromIdentity();
        };

        CameraView.prototype = Object.create(WorldWindowView.prototype);

        /**
         * Creates a new object that is a copy of this object.
         * @returns {CameraView} The new object.
         */
        CameraView.prototype.clone = function () {
            var clone = new CameraView(this.wwd);
            clone.copy(this);

            return clone;
        };

        /**
         * Copies the components of a specified object to this object.
         * @param {CameraView} copyObject The object to copy.
         * @returns {CameraView} A copy of this object equal to copyObject.
         * @throws {ArgumentError} If the specified object is null or undefined.
         */
        CameraView.prototype.copy = function (copyObject) {
            if (!copyObject) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "CameraView", "copy", "missingObject"));
            }

            WorldWindowView.prototype.copy.call(this, copyObject);

            this.cameraPosition.copy(copyObject.cameraPosition);
            this.heading = copyObject.heading;
            this.tilt = copyObject.tilt;
            this.roll = copyObject.roll;

            return this;
        };

        CameraView.prototype.computeViewingTransform = function (modelview) {
            if (!modelview) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "CameraView", "computeViewingTransform", "missingModelview"));
            }

            modelview.setToIdentity();

            // TODO interpret altitude mode other than absolute
            // Transform by the local cartesian transform at the camera's position.
            this.wwd.globe.projection.geographicToCartesianTransform(this.wwd.globe, this.cameraPosition.latitude, this.cameraPosition.longitude, this.cameraPosition.altitude, modelview);

            // Transform by the heading, tilt and roll.
            modelview.multiplyByRotation(0, 0, 1, -this.heading); // rotate clockwise about the Z axis
            modelview.multiplyByRotation(1, 0, 0, this.tilt); // rotate counter-clockwise about the X axis
            modelview.multiplyByRotation(0, 0, 1, this.roll); // rotate counter-clockwise about the Z axis (again)

            this.scratchModelview.copy(modelview);

            // Make the transform a viewing matrix.
            modelview.invertOrthonormalMatrix(this.scratchModelview);

            return modelview;
        };

        LookAtView.isCameraView = function (view) {
            return view.cameraPosition !== undefined && view.heading !== undefined && view.tilt !== undefined && view.roll !== undefined;
        };

        CameraView.fromView = function (otherView, result) {
            if (!otherView) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "CameraView", "fromView", "missingOtherView"));
            }

            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "CameraView", "fromView", "missingResult"));
            }

            if (CameraView.isCameraView(otherView)) {
                return result.copy(otherView);
            }
            else if (LookAtView.isLookAtView(otherView)) {
                var globe = this.wwd.globe;
                this.computeViewingTransform(this.scratchModelview);
                var forwardRay = new Line(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
                this.scratchModelview.extractEyePoint(forwardRay.origin);
                this.scratchModelview.extractForwardVector(forwardRay.direction);

                var originPoint = new Vec3(0, 0, 0);

                if (!globe.intersectsLine(forwardRay, originPoint)) {
                    var globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius);
                    var horizon = WWMath.horizonDistanceForGlobeRadius(globeRadius, this.cameraPosition.altitude);
                    forwardRay.pointAt(horizon, originPoint);
                }

                var originPos = new Position(0, 0, 0);
                globe.computePositionFromPoint(originPoint[0], originPoint[1], originPoint[2], originPos);
                globe.projection.cartesianToLocalTransform(globe, originPoint[0], originPoint[1], originPoint[2], this.origin);
                this.scratchModelview.multiplyMatrix(this.origin);

                result.lookAtPosition.copy(originPos);
                result.range = -this.scratchModelview[11];
                result.heading = this.scratchModelview.extractHeading(this.roll); // disambiguate heading and roll
                result.tilt = this.scratchModelview.extractTilt();
                result.roll = this.roll; // roll passes straight through

                return result;
            }

            return null;
        };

        /**
         * Indicates whether the components of this object are equal to those of a specified object.
         * @param {CameraView} otherCameraView The object to test equality with. May be null or undefined, in which case this
         * function returns false.
         * @returns {boolean} true if all components of this object are equal to the corresponding
         * components of the specified object, otherwise false.
         */
        CameraView.prototype.equals = function (otherCameraView) {
            if (otherCameraView) {
                return this.cameraPosition.equals(otherCameraView.cameraPosition) &&
                    this.heading === otherCameraView.heading &&
                    this.tilt === otherCameraView.tilt &&
                    this.roll === otherCameraView.roll;
            }

            return false;
        };

        CameraView.fromView = function (otherView, result) {
            if (!otherView) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "CameraView", "fromView", "missingOtherView"));
            }

            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "CameraView", "fromView", "missingResult"));
            }
        };

        return CameraView;
    });