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
 * @exports Navigator
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../geom/Matrix',
        '../navigate/NavigatorState',
        '../geom/Position',
        '../error/UnsupportedOperationError',
        '../geom/Vec3',
        '../util/WWMath'],
    function (ArgumentError,
              Logger,
              Matrix,
              NavigatorState,
              Position,
              UnsupportedOperationError,
              Vec3,
              WWMath) {
        "use strict";

        /**
         * Constructs a base navigator.
         * @alias Navigator
         * @constructor
         * @classdesc Provides an abstract base class for navigators. This class is not meant to be instantiated
         * directly. See {@Link LookAtNavigator} for a concrete navigator.
         * @param {WorldWindow} worldWindow The WorldWindow to associate with this navigator.
         */
        var Navigator = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "constructor", "missingWorldWindow"));
            }

            /**
             * The {@link WorldWindow} associated with this navigator.
             * @type {WorldWindow}
             * @readonly
             */
            this.worldWindow = worldWindow;

            /**
             * This navigator's heading, in degrees clockwise from north.
             * @type {Number}
             * @default 0
             */
            this.heading = 0;

            /**
             * This navigator's tilt, in degrees.
             * @type {Number}
             * @default 0
             */
            this.tilt = 0;

            /**
             * This navigator's roll, in degrees.
             * @type {Number}
             * @default 0
             */
            this.roll = 0;

            // Intentionally not documented.
            this.nearDistance = 1;

            // Intentionally not documented.
            this.farDistance = 10e6;
        };

        /**
         * Returns the current navigator state for a specified model-view matrix.
         * This method is meant to be called only by subclasses;
         * applications should not call this method.
         * @protected
         * @param {Matrix} modelviewMatrix The modelview matrix.
         * @returns {NavigatorState} The current navigator state.
         * @throws {ArgumentError} If the specified matrix is null or undefined.
         */
        Navigator.prototype.currentStateForModelview = function (modelviewMatrix) {
            if (!modelviewMatrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "currentStateForModelview", "missingMatrix"));
            }

            var globe = this.worldWindow.globe,
                globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius),
                eyePoint = modelviewMatrix.extractEyePoint(new Vec3(0, 0, 0)),
                eyePos = globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], new Position(0, 0, 0)),
                eyeHorizon = WWMath.horizonDistanceForGlobeRadius(globeRadius, eyePos.altitude),
                atmosphereHorizon = WWMath.horizonDistanceForGlobeRadius(globeRadius, 160000),
                viewport = this.worldWindow.viewport,
                viewDepthBits = this.worldWindow.depthBits,
                distanceToSurface,
                maxNearDistance,
                projectionMatrix = Matrix.fromIdentity();

            // Set the far clip distance to the smallest value that does not clip the atmosphere.
            // TODO adjust the clip plane distances based on the navigator's orientation - shorter distances when the
            // TODO horizon is not in view
            // TODO parameterize the object altitude for horizon distance
            this.farDistance = eyeHorizon + atmosphereHorizon;
            if (this.farDistance < 1e3)
                this.farDistance = 1e3;

            // Compute the near clip distance in order to achieve a desired depth resolution at the far clip distance.
            // This computed distance is limited such that it does not intersect the terrain when possible and is never
            // less than a predetermined minimum (usually one). The computed near distance automatically scales with the
            // resolution of the WebGL depth buffer.
            this.nearDistance = WWMath.perspectiveNearDistanceForFarDistance(this.farDistance, 10, viewDepthBits);

            // Prevent the near clip plane from intersecting the terrain.
            distanceToSurface = eyePos.altitude - globe.elevationAtLocation(eyePos.latitude, eyePos.longitude);
            if (distanceToSurface > 0) {
                maxNearDistance = WWMath.perspectiveNearDistance(viewport.width, viewport.height, distanceToSurface);
                if (this.nearDistance > maxNearDistance)
                    this.nearDistance = maxNearDistance;
            }

            if (this.nearDistance < 1)
                this.nearDistance = 1;

            // Compute the current projection matrix based on this navigator's perspective properties and the current
            // WebGL viewport.
            projectionMatrix.setToPerspectiveProjection(viewport.width, viewport.height, this.nearDistance, this.farDistance);

            return new NavigatorState(modelviewMatrix, projectionMatrix, viewport, this.heading, this.tilt);
        };

        return Navigator;
    });