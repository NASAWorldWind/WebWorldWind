/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Camera
 */
define([], function(){
    /**
     * It represents current position of the camera in the camera mode. Unlike for LookAt mode this actually allows us
     * to look away from the Earth.
     * @param latitude {Number} latitude position of camera
     * @param longitude {Number} longitude position of camera
     * @param altitude {Number} altitude of the camera from the 0 height.
     * @param altitudeMode {WorldWind.AltitudeMode} It isn't used yet.
     * @param heading {Number}
     * @param tilt {Number}
     * @param roll {Number}
     * @constructor
     */
    var Camera = function(latitude, longitude, altitude, altitudeMode, heading, tilt, roll) {
        this._latitude = latitude || 0;
        this._longitude = longitude || 0;
        this._altitude = altitude || 0;
        this._altitudeMode = altitudeMode || WorldWind.ABSOLUTE;
        this._heading = heading || 0;
        this._tilt = tilt || 0;
        this._roll = roll || 0;
    };

    Object.defineProperties(Camera.prototype, {
        /**
         * Latitude of the virtual camera. Degrees north or south of the Equator (0 degrees). Values range from -90
         * degrees to 90 degrees.
         * @memberof Camera.prototype
         * @readonly
         * @type {Number}
         */
        latitude: {
            get: function(){
                return this._latitude;
            },

            set: function(latitude) {
                this._latitude = latitude;
            }
        },

        /**
         * Longitude of the virtual camera (eye point). Angular distance in degrees, relative to the Prime Meridian.
         * Values west of the Meridian range from +-180 to 0 degrees. Values east of the Meridian range from 0
         * to 180 degrees.
         * @memberof Camera.prototype
         * @readonly
         * @type {Number}
         */
        longitude: {
            get: function(){
                return this._longitude;
            },

            set: function(longitude) {
                this._longitude = longitude;
            }
        },

        /**
         * Distance of the camera from the earth's surface, in meters. Interpreted according to the Camera's
         * &lt;altitudeMode&gt; or &lt;gx:altitudeMode&gt;.
         * @memberOf Camera.prototype
         * @readonly
         * @type {Number}
         */
        altitude: {
            get: function(){
                return this._altitude;
            },

            set: function(altitude) {
                this._altitude = altitude;
            }
        },

        /**
         * Currently only ABSOLUTE is supported the other will be treated in the same way.
         *
         * Specifies how the &lt;altitude&gt; specified for the Camera is interpreted. Possible values are as
         * follows:
         * relativeToGround - (default) Interprets the &lt;altitude&gt; as a value in meters above the ground. If the
         * point is over water, the &lt;altitude&gt; will be interpreted as a value in meters above sea level. See
         * &lt;gx:altitudeMode&gt; below to specify points relative to the sea floor. clampToGround - For a camera, this
         * setting also places the camera relativeToGround, since putting the camera exactly at terrain height
         * would
         * mean that the eye would intersect the terrain (and the view would be blocked). absolute - Interprets the
         * &lt;altitude&gt; as a value in meters above sea level.
         * @memberof Camera.prototype
         * @readonly
         * @type {String}
         */
        altitudeMode: {
            get: function(){
                return this._altitudeMode;
            },

            set: function(altitudeMode) {
                this._altitudeMode = altitudeMode;
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
            get: function(){
                return this._heading;
            },

            set: function(heading) {
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
            get: function(){
                return this._tilt;
            },

            set: function(tilt) {
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
            get: function(){
                return this._roll;
            },

            set: function(roll) {
                this._roll = roll;
            }
        }
    });

    /**
     * It sets all properties of this camera to the parameter camera
     * @param camera {Camera} Camera to rewrite properties of the camera with.
     * @returns {Camera} This
     */
    Camera.prototype.set = function(camera) {
        this.latitude = camera.latitude;
        this.longitude = camera.longitude;
        this.altitude = camera.altitude;
        this.altitudeMode = camera.altitudeMode;
        this.heading = camera.heading;
        this.tilt = camera.tilt;
        this.roll = camera.roll;

        return this;
    };

    /**
     * Verifies whether both cameras are equal.
     * @param camera {Camera} camera to test against.
     * @returns {boolean}
     */
    Camera.prototype.equals = function(camera) {
        return camera &&
            this.latitude == camera.latitude &&
            this.longitude == camera.longitude &&
            this.altitude == camera.altitude &&
            this.altitudeMode == camera.altitudeMode &&
            this.heading == camera.heading &&
            this.tilt == camera.tilt &&
            this.roll == camera.roll;
    };

    /**
     * Utility function for printing the state when debugging. It is important for when you use console.log to log the
     * whole object, the inspection always take the last state of the object.
     */
    Camera.prototype.toString = function() {
        return "Camera{" +
            "latitude=" + this.latitude +
            ", longitude=" + this.longitude +
            ", altitude=" + this.altitude +
            ", altitudeMode=" + this.altitudeMode +
            ", heading=" + this.heading +
            ", tilt=" + this.tilt +
            ", roll=" + this.roll +
            '}';
    };

    return Camera;
});