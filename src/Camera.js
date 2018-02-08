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
        './error/ArgumentError',
        './geom/Line',
        './util/Logger',
        './LookAt',
        './geom/Matrix',
        './geom/Position',
        './geom/Vec3',
        './util/WWMath'
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

            // Internal. Intentionally not documented.
            this.scratchModelview = Matrix.fromIdentity();

            // Internal. Intentionally not documented.
            this.scratchPoint = new Vec3(0, 0, 0);

            // Internal. Intentionally not documented.
            this.scratchOrigin = Matrix.fromIdentity();

            // Internal. Intentionally not documented.
            this.scratchPosition = new Position(0, 0, 0);

            // Internal. Intentionally not documented.
            this.scratchRay = new Line(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
        };

        Camera.prototype.computeViewingTransform = function (modelview) {
            if (!modelview) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "computeViewingTransform", "missingModelview"));
            }

            // modelview.setToIdentity();
            // modelview.multiplyByFuirstPersonModelview(this.position, this.heading, this.tilt, this.roll, this.wwd.globe);
            var globe = this.wwd.globe,
                eyePoint = new Vec3(0, 0, 0),
                surfaceNormal = new Vec3(0, 0, 0),
                northTangent = new Vec3(0, 0, 0);
            globe.computePointFromPosition(this.position.latitude, this.position.longitude, this.position.altitude, eyePoint);
            globe.surfaceNormalAtLocation(this.position.latitude, this.position.longitude, surfaceNormal);
            globe.northTangentAtLocation(this.position.latitude, this.position.longitude, northTangent);

            // Compute the east pointing tangent as the cross product of the north and up axes. This is much more efficient
            // as an inline computation.
            var ex = northTangent[1] * surfaceNormal[2] - northTangent[2] * surfaceNormal[1],
                ey = northTangent[2] * surfaceNormal[0] - northTangent[0] * surfaceNormal[2],
                ez = northTangent[0] * surfaceNormal[1] - northTangent[1] * surfaceNormal[0];

            // Ensure the normal, north and east vectors represent an orthonormal basis by ensuring that the north vector is
            // perpendicular to normal and east vectors. This should already be the case, but rounding errors can be
            // introduced when working with Earth sized coordinates.
            northTangent[0] = surfaceNormal[1] * ez - surfaceNormal[2] * ey;
            northTangent[1] = surfaceNormal[2] * ex - surfaceNormal[0] * ez;
            northTangent[2] = surfaceNormal[0] * ey - surfaceNormal[1] * ex;

            modelview.set(
                ex, northTangent[0], surfaceNormal[0], eyePoint[0],
                ey, northTangent[1], surfaceNormal[1], eyePoint[1],
                ez, northTangent[2], surfaceNormal[2], eyePoint[2],
                0, 0, 0, 1);

            modelview.multiplyByRotation(0, 0, 1, -this.heading); // rotate clockwise about the Z axis
            modelview.multiplyByRotation(1, 0, 0, this.tilt); // rotate counter-clockwise about the X axis
            modelview.multiplyByRotation(0, 0, 1, this.roll); // rotate counter-clockwise about the Z axis (again)

            // Make the transform a viewing matrix.
            modelview.invertOrthonormal();

            return modelview;
        };

        Camera.prototype.equals = function (otherView) {
            if (otherView) {
                return this.position.equals(otherView.position) &&
                    this.heading === otherView.heading &&
                    this.tilt === otherView.tilt &&
                    this.roll === otherView.roll;
            }

            return false;
        };

        Camera.prototype.clone = function () {
            var clone = new Camera(this.wwd);
            clone.copy(this);

            return clone;
        };

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

        Camera.prototype.setFromLookAt = function (lookAt) {
            if (!lookAt) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "setFromLookAt", "missingLookAt"));
            }

            // this.wwd.worldWindowController.applyLookAtLimits(lookAt);
            var globe = this.wwd.globe,
                originPoint = this.scratchPoint,
                modelview = this.scratchModelview,
                proj = globe.projection,
                origin = this.scratchOrigin;

            lookAt.computeViewingTransform(globe, modelview);
            modelview.extractEyePoint(originPoint);

            proj.cartesianToGeographic(globe, originPoint[0], originPoint[1], originPoint[2], Vec3.ZERO, this.position);
            origin.setToIdentity();
            origin.multiplyByLocalCoordinateTransform(originPoint, globe);
            modelview.multiplyMatrix(origin);

            this.heading = modelview.extractHeading(lookAt.roll); // disambiguate heading and roll
            this.tilt = modelview.extractTilt();
            this.roll = lookAt.roll; // roll passes straight through

            return this;
        };

        Camera.prototype.getAsLookAt = function (result) {
            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Camera", "getAsLookAt", "missingResult"));
            }

            var globe = this.wwd.globe,
                forwardRay = this.scratchRay,
                modelview = this.scratchModelview,
                originPoint = this.scratchPoint,
                originPos = this.scratchPosition,
                origin = this.scratchOrigin;

            this.computeViewingTransform(modelview);
            modelview.extractEyePoint(forwardRay.origin);
            modelview.extractForwardVector(forwardRay.direction);

            if (!globe.intersectsLine(forwardRay, originPoint)) {
                var globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius);
                var horizon = WWMath.horizonDistanceForGlobeRadius(globeRadius, this.position.altitude);
                forwardRay.pointAt(horizon, originPoint);
            }

            // var testResult={};
            // modelview.extractViewingParameters(originPoint, this.roll, globe, testResult);
            // var testLookAt=new LookAt();
            // testLookAt.lookAtPosition.copy(testResult.origin);
            // testLookAt.heading=testResult.heading;
            // testLookAt.tilt=testResult.tilt;
            // testLookAt.roll=testResult.roll;
            // console.log(testResult);
            globe.computePositionFromPoint(originPoint[0], originPoint[1], originPoint[2], originPos);
            origin.setToIdentity();
            origin.multiplyByLocalCoordinateTransform(originPoint, globe);
            modelview.multiplyMatrix(origin);

            result.lookAtPosition.copy(originPos);
            result.range = -modelview[11];
            result.heading = modelview.extractHeading(this.roll); // disambiguate heading and roll
            result.tilt = modelview.extractTilt();
            result.roll = this.roll; // roll passes straight through
            // console.log(testLookAt.toString());
            // console.log(result.toString());
            // console.log("-----");
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

