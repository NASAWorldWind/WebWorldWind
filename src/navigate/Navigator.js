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
    /**
     *
     * @param worldWindow
     * @constructor
     */
    var Navigator = function (worldWindow) {
        this.scratchCamera = new Camera();

        /**
         * The {@link WorldWindow} associated with this navigator.
         * @type {WorldWindow}
         * @readonly
         */
        this.worldWindow = worldWindow;

        this.fieldOfView = 45;

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

        this.altitude = 10000000;

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
     * TODO: There are differences between the modelview, projection and frustum against the relevant previous version.
     * @return {NavigatorState}
     */
    Navigator.prototype.currentState = function(globe) {
        var camera = this.getAsCamera(globe, this.scratchCamera),
            modelview = Matrix.fromIdentity(),
            projection = Matrix.fromIdentity(),
            infiniteProjection = Matrix.fromIdentity(),
            viewport = this.worldWindow.viewport;

        this.worldWindow.computeViewingTransform(projection, modelview); // This dependency makes it very difficult to test.
        infiniteProjection.setToInfiniteProjection(viewport.width, viewport.height, this.fieldOfView, 1.0);
        infiniteProjection.multiplyMatrix(modelview);

        return new NavigatorState(modelview, projection, infiniteProjection, viewport, camera.heading, camera.tilt);
    };

    return Navigator;
});