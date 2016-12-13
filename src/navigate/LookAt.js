/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BasicWorldWindController
 */
define([], function(){
    /**
     *
     * @param latitude
     * @param longitude
     * @param altitude
     * @param altitudeMode
     * @param range
     * @param heading
     * @param tilt
     * @param roll
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
        latitude: {
            get: function(){
                return this._latitude;
            },

            set: function(latitude) {
                this._latitude = latitude;
            }
        },

        longitude: {
            get: function(){
                return this._longitude;
            },

            set: function(longitude) {
                this._longitude = longitude;
            }
        },

        altitude: {
            get: function(){
                return this._altitude;
            },

            set: function(altitude) {
                this._altitude = altitude;
            }
        },

        altitudeMode: {
            get: function(){
                return this._altitudeMode;
            },

            set: function(altitudeMode) {
                this._altitudeMode = altitudeMode;
            }
        },

        range: {
            get: function(){
                return this._range;
            },

            set: function(range) {
                this._range = range;
            }
        },

        heading: {
            get: function(){
                return this._heading;
            },

            set: function(heading) {
                this._heading = heading;
            }
        },

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

    return LookAt;
});