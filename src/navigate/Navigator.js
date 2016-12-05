define([
    '../error/ArgumentError',
    './Camera',
    '../util/Logger',
    '../geom/Matrix',
    './NavigatorState',
    '../geom/Position',
    '../geom/Vec3',
    '../util/WWMath'
], function (ArgumentError,
             Camera,
             Logger,
             Matrix,
             NavigatorState,
             Position,
             Vec3,
             WWMath) {
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

        this.latitude = 30;

        this.longitude = 110;

        this.altitude = 100000;

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
                return this._latitude;
            },
            set: function (latitude) {
                this._latitude = latitude;
            }
        },

        longitude: {
            get: function () {
                return this._longitude;
            },
            set: function (longitude) {
                this._longitude = longitude;
            }
        },

        altitude: {
            get: function () {
                return this._altitude;
            },
            set: function (altitude) {
                this._altitude = altitude;
            }
        },

        heading: {
            get: function () {
                return this._heading;
            },
            set: function (heading) {
                this._heading = heading;
            }
        },

        tilt: {
            get: function () {
                return this._tilt;
            },
            set: function (tilt) {
                this._tilt = tilt;
            }
        },

        roll: {
            get: function () {
                return this._roll;
            },
            set: function (roll) {
                this._roll = roll;
            }
        }
    });

    Navigator.prototype.getAsCamera = function (globe, result) {
        if (!globe) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "getAsCamera", "missing globe")
            );
        }

        if (!result) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "getAsCamera", "missing result")
            );
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
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "setAsCamera", "missing globe")
            );
        }

        if (!camera) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "setAsCamera", "missing camera")
            );
        }

        this.latitude = camera.latitude;
        this.longitude = camera.longitude;
        this.altitude = camera.altitude; // TODO: Interpret altitude based on the altitude mode.
        this.heading = camera.heading;
        this.tilt = camera.tilt;
        this.roll = camera.roll;

        return this;
    };

    Navigator.prototype.getAsLookAt = function (globe, result) {
        if (!globe) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "getAsLookAt", "missing globe")
            );
        }

        if (!result) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "getAsLookAt", "missing result")
            );
        }

        this.getAsCamera(globe, this.scratchCamera); // get this navigator's properties as a Camera
        globe.cameraToLookAt(this.scratchCamera, result); // convert the Camera to a LookAt

        return result;
    };

    Navigator.prototype.setAsLookAt = function (globe, lookAt) {
        if (!globe) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "setAsLookAt", "missing globe")
            );
        }

        if (!lookAt) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "setAsLookAt", "missing lookAt")
            );
        }

        globe.lookAtToCamera(lookAt, this.scratchCamera);
        this.setAsCamera(globe, this.scratchCamera);

        return this;
    };

    /**
     * @return {NavigatorState}
     */
    Navigator.prototype.currentState = function() {
        var camera = this.getAsCamera(this.worldWindow.globe, this.scratchCamera),
            modelview = Matrix.fromIdentity(),
            viewerPosition = new Position(this.latitude, this.longitude, this.altitude);

        modelview.multiplyByLookAtModelview(viewerPosition, camera.range, camera.heading, camera.tilt, camera.roll, this.worldWindow.globe);

        return this.currentStateForModelview(modelview, camera);
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
    Navigator.prototype.currentStateForModelview = function (modelviewMatrix, camera) {
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

        return new NavigatorState(modelviewMatrix, projectionMatrix, viewport, camera.heading, camera.tilt);
    };

    return Navigator;
});