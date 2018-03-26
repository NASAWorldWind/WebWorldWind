/*
 * Copyright 2015-2017 WorldWind Contributors
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
define(['../../geom/Location'], function(Location){
    "use strict";

    /**
     * It represents Position with added intensity vector.
     * @constructor
     * @augments Location
     * @inheritDoc
     * @intensity {Number} Number representing the intensity of the source for this position;
     * @alias IntensityLocation
     */
    var IntensityLocation = function(latitude, longitude, intensity) {
        Location.call(this, latitude, longitude);

        /**
         * Arbitrary number representing the intensity of the source for this position.
         * @type {Number}
         */
        this.intensity = intensity;
    };

    IntensityLocation.prototype = Object.create(Location.prototype);

    /**
     *
     * @param sector
     * @returns {boolean}
     */
    IntensityLocation.prototype.isInSector = function(sector) {
        return this.latitude >= sector.minLatitude && this.latitude <= sector.maxLatitude &&
            this.longitude >= sector.minLongitude && this.longitude <= sector.maxLongitude;
    };

    /**
     *
     * @param sector
     * @param height
     * @returns {number} Position on the height in pixels. THe result needs to start with 0
     */
    IntensityLocation.prototype.latitudeInSector = function(sector, height) {
        // Percentage of the available space.
        var sizeOfArea = sector.maxLatitude - sector.minLatitude;
        var locationInArea = this.latitude - sector.minLatitude;
        return Math.ceil((locationInArea / sizeOfArea) * (height - 1));
    };

    /**
     *
     * @param sector
     * @param width
     * @returns {number}
     */
    IntensityLocation.prototype.longitudeInSector = function(sector, width) {
        var sizeOfArea = sector.maxLongitude - sector.minLongitude ;
        var locationInArea = this.longitude - sector.minLongitude;
        return Math.ceil((locationInArea / sizeOfArea) * (width - 1));
    };

    return IntensityLocation;
});