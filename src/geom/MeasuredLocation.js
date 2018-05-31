/*
 * Copyright 2015-2018 WorldWind Contributors
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
define([
    './Location'
], function (Location) {

    /**
     * It constructs measured location from a specified latitude, longitude and measure.
     * @classdesc It represents a pair of latitude and longitude with associated measure.
     * @alias MeasuredLocation
     * @augments Location
     * @param latitude {Number} The latitude in degrees
     * @param longitude {Number} The longitude in degrees
     * @param measure {Number} The measure associated with the location
     * @constructor
     */
    var MeasuredLocation = function (latitude, longitude, measure) {
        Location.call(this, latitude, longitude);

        /**
         * The measure (intensity) associated with current location.
         * @type {Number}
         */
        this.measure = measure;
    };

    MeasuredLocation.prototype = Object.create(Location.prototype);

    /**
     * Measured Location with latitude, longitude and measure all set to 0.
     * @constant
     * @type {MeasuredLocation}
     */
    MeasuredLocation.ZERO = new MeasuredLocation(0,0,0);

    /**
     * It copies latitude, longitude and measure from passed in MeasuredLocation to current location.
     * @param measuredLocation {MeasuredLocation} The location to copy on this one.
     * @return {MeasuredLocation} This location with updated properties.
     */
    MeasuredLocation.prototype.copy = function (measuredLocation) {
        Location.prototype.copy.call(this, measuredLocation);

        this.measure = measuredLocation.measure;

        return this;
    };

    /**
     * It sets current properties to the ones passed in.
     * @param latitude {Number} The latitude to set
     * @param longitude {Number} The longitude to set
     * @param measure {Number} The measure to set.
     * @return {MeasuredLocation} This location set to the specified location.
     */
    MeasuredLocation.prototype.set = function (latitude, longitude, measure) {
        Location.prototype.set.call(this, latitude, longitude);

        this.measure = measure;

        return this;
    };

    /**
     * It indicates whether this location is equal to a passed in measured location.
     * @param measuredLocation {MeasuredLocation} The location to compare.
     * @returns {boolean} <code>true</code> if this location is equal to the passed in location, otherwise
     * <code>false</code>.
     */
    MeasuredLocation.prototype.equals = function(measuredLocation) {
        return Location.prototype.equals.call(this, measuredLocation) &&
            (this.measure === measuredLocation.measure);
    };

    return MeasuredLocation;
});