/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports LookAt
 */
define([], function(){
    /**
     * It represents current position of the virtual camera (eye point). The eye is regarded as if it is on a location
     * watching earth ground.
     * @param latitude {Number} Latitude of the point the camera is looking at.
     * @param longitude {Number} Longitude of the point the camera is looking at.
     * @param altitude {Number} Distance from the earth's surface, in meters.
     * @param altitudeMode
     * @param range {Number} Distance in meters from the point specified by &lt;longitude&gt;, &lt;latitude&gt;, and &lt;altitude&gt; to the LookAt position.
     * @param heading {Number} Direction (that is, North, South, East, West), in degrees.
     * @param tilt {Number} Angle between the direction of the LookAt position and the normal to the surface of the earth.
     * @param roll {Number} Rotation, in degrees, of the camera around the Z axis.
     * @constructor
     */
    var LookAt = function(latitude, longitude, altitude, altitudeMode, range, heading, tilt, roll) {
        this._latitude = latitude || 0;
        this._longitude = longitude || 0;
        this._altitude = altitude || 0;
        this._altitudeMode = altitudeMode || WorldWind.ABSOLUTE;
        this._range = range || 0;
        this._heading = heading || 0;
        this._tilt = tilt || 0;
        this._roll = roll || 0;
    };

    Object.defineProperties(LookAt.prototype, {
        /**
         * Latitude of the point the camera is looking at. Degrees north or south of the Equator (0 degrees). Values
         * range from -90 degrees to 90 degrees.
         * @memberof LookAt.prototype
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
         * Longitude of the point the camera is looking at. Angular distance in degrees, relative to the Prime
         * Meridian. Values west of the Meridian range from -180 to 0 degrees. Values east of the Meridian range
         * from 0 to 180 degrees.
         * @memberof LookAt.prototype
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
         * Distance from the earth's surface, in meters. Interpreted according to the LookAt's altitude mode.
         * @memberof LookAt.prototype
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
         * Currently only ABSOLUTE is supported.
         *
         * Specifies how the &lt;altitude&gt; specified for the LookAt point is interpreted. Possible values are as
         * follows: clampToGround - (default) Indicates to ignore the &lt;altitude&gt; specification and place the LookAt
         * position on the ground. relativeToGround - Interprets the &lt;altitude&gt; as a value in meters above the
         * ground. absolute - Interprets the &lt;altitude&gt; as a value in meters above sea level.
         * @memberof KmlLookAt.prototype
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
         * Distance in meters from the point specified by &lt;longitude&gt;, &lt;latitude&gt;, and &lt;altitude&gt; to the LookAt
         * position.
         * @memberof LookAt.prototype
         * @readonly
         * @type {Number}
         */
        range: {
            get: function(){
                return this._range;
            },

            set: function(range) {
                this._range = range;
            }
        },

        /**
         * Direction (that is, North, South, East, West), in degrees. Default=0 (North). (See diagram below.) Values
         * range from 0 to 360 degrees.
         * @memberof LookAt.prototype
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
         * Angle between the direction of the LookAt position and the normal to the surface of the earth. (See
         * diagram below.) Values range from 0 to 90 degrees. Values for &lt;tilt&gt; cannot be negative. A &lt;tilt&gt; value
         * of 0 degrees indicates viewing from directly above. A &lt;tilt&gt; value of 90 degrees indicates viewing along
         * the horizon.
         * @memberof KmlLookAt.prototype
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
     * It sets all properties of this lookAt to the parameter lookAt
     * @param lookAt {LookAt} LookAt to rewrite properties of the lookAt with.
     * @returns {LookAt} This
     */
    LookAt.prototype.set = function(lookAt) {
        this.latitude = lookAt.latitude;
        this.longitude = lookAt.longitude;
        this.altitude = lookAt.altitude;
        this.altitudeMode = lookAt.altitudeMode;
        this.range = lookAt.range;
        this.heading = lookAt.heading;
        this.tilt = lookAt.tilt;
        this.roll = lookAt.roll;

        return this;
    };

    /**
     * Verifies whether both lookAts are equal.
     * @param lookAt {LookAt} lookAt to test against.
     * @returns {boolean}
     */
    LookAt.prototype.equals = function(lookAt) {
        return lookAt &&
            this.latitude == lookAt.latitude &&
            this.longitude == lookAt.longitude &&
            this.altitude == lookAt.altitude &&
            this.altitudeMode == lookAt.altitudeMode &&
            this.range == lookAt.range &&
            this.heading == lookAt.heading &&
            this.tilt == lookAt.tilt &&
            this.roll == lookAt.roll
    };

    /**
     * Utility function for printing the state when debugging. It is important for when you use console.log to log the
     * whole object, the inspection always take the last state of the object.
     */
    LookAt.prototype.toString = function() {
        return "LookAt{" +
            "latitude=" + this.latitude +
            ", longitude=" + this.longitude +
            ", altitude=" + this.altitude +
            ", altitudeMode=" + this.altitudeMode +
            ", range=" + this.range +
            ", heading=" + this.heading +
            ", tilt=" + this.tilt +
            ", roll=" + this.roll +
            '}';
    };

    return LookAt;
});