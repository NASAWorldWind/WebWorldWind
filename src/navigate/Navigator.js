/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Navigator
 * @version $Id: Navigator.js 3298 2015-07-06 17:28:33Z dcollins $
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
         * @param {WorldWindow} worldWindow The world window to associate with this navigator.
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
         * Returns the current state of this navigator. Subclasses must override this method.
         * @returns {NavigatorState} The current state of this navigator.
         */
        Navigator.prototype.currentState = function () {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "currentState", "abstractInvocation"));
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
                viewport = this.worldWindow.viewport,
                viewDepthBits = this.worldWindow.depthBits,
                distanceToSurface,
                maxNearDistance,
                projectionMatrix = Matrix.fromIdentity();

            // Compute the far clip distance based on the current eye altitude. This must be done after computing the
            // modelview matrix and before computing the near clip distance. The far clip distance depends on the
            // modelview matrix, and the near clip distance depends on the far clip distance.
            this.farDistance = WWMath.horizonDistanceForGlobeRadius(globeRadius, eyePos.altitude);
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