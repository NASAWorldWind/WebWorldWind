define([
    '../error/ArgumentError',
    './Camera',
    '../util/Logger',
    '../geom/Matrix',
    './NavigatorState'
], function (ArgumentError,
             Camera,
             Logger,
             Matrix,
             NavigatorState) {
    /**
     * Current state of the eye point in the same form as for Camera.
     * @param worldWindow {WorldWindow} World Window to which this navigator is associated.
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

        /**
         * Field of view of the camera in degrees.
         * @type {number}
         */
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

        /**
         * Starting latitude of the navigator
         * @type {Number}
         */
        this.latitude = 30;

        /**
         * Starting longitude of the navigator
         * @type {Number}
         */
        this.longitude = -110;

        /**
         * Starting altitude of the navigator
         * @type {Number}
         */
        this.altitude = 10000000;

        /**
         * This navigator's roll, in degrees.
         * @type {Number}
         * @default 0
         */
        this.roll = 0;
    };

    Object.defineProperties(Navigator.prototype, {
        /**
         * Latitude of the virtual camera. Degrees north or south of the Equator (0 degrees). Values range from -90
         * degrees to 90 degrees.
         * @memberof Navigator.prototype
         * @readonly
         * @type {Number}
         */
        latitude: {
            get: function () {
                return this._latitude;
            },
            set: function (latitude) {
                this._latitude = latitude;
            }
        },

        /**
         * Longitude of the virtual camera (eye point). Angular distance in degrees, relative to the Prime Meridian.
         * Values west of the Meridian range from +-180 to 0 degrees. Values east of the Meridian range from 0
         * to 180 degrees.
         * @memberof Navigator.prototype
         * @readonly
         * @type {Number}
         */
        longitude: {
            get: function () {
                return this._longitude;
            },
            set: function (longitude) {
                this._longitude = longitude;
            }
        },

        /**
         * Distance of the camera from the earth's surface, in meters. Interpreted according to the Camera's
         * &lt;altitudeMode&gt; or &lt;gx:altitudeMode&gt;.
         * @memberOf Navigator.prototype
         * @readonly
         * @type {Number}
         */
        altitude: {
            get: function () {
                return this._altitude;
            },
            set: function (altitude) {
                this._altitude = altitude;
            }
        },

        /**
         * Direction (azimuth) of the camera, in degrees. Default=0 (true North). (See diagram.) Values range from
         * 0 to 360 degrees.
         * @memberof Camera.prototype
         * @readonly
         * @type {Number}
         */
        heading: {
            get: function () {
                return this._heading;
            },
            set: function (heading) {
                this._heading = heading;
            }
        },

        /**
         * Rotation, in degrees, of the camera around the X axis. A value of 0 indicates that the view is aimed
         * straight down toward the earth (the most common case). A value for 90 for &lt;tilt&gt; indicates that the
         * view
         * is aimed toward the horizon. Values greater than 90 indicate that the view is pointed up into the sky.
         * Values for &lt;tilt&gt; are clamped at +180 degrees.
         * @memberof Camera.prototype
         * @readonly
         * @type {Number}
         */
        tilt: {
            get: function () {
                return this._tilt;
            },
            set: function (tilt) {
                this._tilt = tilt;
            }
        },

        /**
         * Rotation, in degrees, of the camera around the Z axis. Values range from -180 to +180 degrees.
         * @memberof Camera.prototype
         * @readonly
         * @type {String}
         */
        roll: {
            get: function () {
                return this._roll;
            },
            set: function (roll) {
                this._roll = roll;
            }
        }
    });

    /**
     * It retrieves properties of this navigator in the form of camera.
     * @param globe {Globe} Unused here
     * @param result {Camera} Camera which will be returned with current properties of navigator imprinted on it.
     * @returns {Camera} result
     */
    Navigator.prototype.getAsCamera = function (globe, result) {
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

    /**
     * It sets properties of this navigator based on the supplied Camera.
     * @param globe {Globe} Actually unused in this computation.
     * @param camera {Camera} Camera representation of the properties.
     * @returns {Navigator} this
     */
    Navigator.prototype.setAsCamera = function (globe, camera) {
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

    /**
     * It retrieve properties of this navigator in the form of LookAt
     * @param globe {Globe} Globe used to do the computations.
     * @param result {LookAt} Current navigator properties represented as LookAt
     * @returns {LookAt} Updated result.
     */
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

    /**
     * It sets properties of this navigator based on the information supplies as LookAt.
     * @param globe {Globe} Globe used to do certain computations.
     * @param lookAt {LookAt} LookAt representation of the properties.
     * @returns {Navigator} this
     */
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
     * It transforms the properties of current navigator into the Navigator State. This means computing modelview matrix,
     * projection matrix and others documented in the NavigatorState.
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