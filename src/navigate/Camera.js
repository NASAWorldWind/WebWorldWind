/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Camera
 */
define([], function(){
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

    return Camera;
});