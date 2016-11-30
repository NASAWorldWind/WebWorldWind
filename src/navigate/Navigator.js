define([
    './Camera',
    '../geom/Matrix'
], function (Camera,
             Matrix) {
    var Navigator = function (worldWindow) {
        this.scratchCamera = new Camera();

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

    Object.defineProperties(Navigator.prototype, {
        latitude: {
            get: function () {
                return this.latitude;
            },
            set: function (latitude) {
                this.latitude = latitude;
            }
        },

        longitude: {
            get: function () {
                return this.longitude;
            },
            set: function (longitude) {
                this.longitude = longitude;
            }
        },

        altitude: {
            get: function () {
                return this.altitude;
            },
            set: function (altitude) {
                this.altitude = altitude;
            }
        },

        heading: {
            get: function () {
                return this.heading;
            },
            set: function (heading) {
                this.heading = heading;
            }
        },

        tilt: {
            get: function () {
                return this.tilt;
            },
            set: function (tilt) {
                this.tilt = tilt;
            }
        },

        roll: {
            get: function () {
                return this.roll;
            },
            set: function (roll) {
                this.roll = roll;
            }
        }
    });

    Navigator.prototype.getAsCamera = function (globe, result) {
        if (!globe) {
            // Log missing globe
        }

        if (!result) {
            // Log missing result
        }

        result.latitude = this.latitude;
        result.longitude = this.longitude;
        result.altitude = this.altitude;
        result.altitudeMode = WorldWind.ABSOLUTE;
        result.heading = this.heading;
        result.tilt = this.tilt;
        result.roll = this.roll;

        return result;
    };

    Navigator.prototype.setAsCamera = function (globe, camera) {
        if (!globe) {
            // Log missing globe
        }

        if (!camera) {
            // Log missing result
        }

        this.latitude = camera.latitude;
        this.longitude = camera.longitude;
        this.altitude = camera.altitude; // TODO: Interpret altitude based on the altitude mode.
        this.heading = camera.heading;
        this.tilt = camera.tilt;
        this.roll = camera.roll;
    };

    Navigator.prototype.getAsLookAt = function (globe, result) {
        if (!globe) {
            // Log missing globe
        }

        if (!result) {
            // Log missing result
        }

        this.getAsCamera(globe, this.scratchCamera);
        globe.cameraToLookAt()
    };

    Navigator.prototype.setAsLookAt = function (globe, lookAt) {
        if (!globe) {
            // Log missing globe
        }

        if (!lookAt) {
            // Log missing result
        }


    };

    /**
     * @return {NavigatorState}
     */
    Navigator.prototype.currentState = function(globe) {
        var camera = this.getAsLookAt(globe, new LookAt());

        var modelview = Matrix.fromIdentity();
        var projection = Matrix.fromIdentity();
        // Here I need to prepare all the transformation on modelview and projection matrix.
        // This is the part with most uncertainty for me.

        return new NavigatorState(modelview, projection, null, camera.heading, camera.tilt);

        /*this.applyLimits();

        var globe = this.worldWindow.globe,
            lookAtPosition = new Position(this.lookAtLocation.latitude, this.lookAtLocation.longitude, 0),
            modelview = Matrix.fromIdentity();
        modelview.multiplyByLookAtModelview(lookAtPosition, this.range, this.heading, this.tilt, this.roll, globe);

        return this.currentStateForModelview(modelview);*/
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