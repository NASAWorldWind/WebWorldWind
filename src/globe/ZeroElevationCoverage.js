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
/**
 * @exports ZeroElevationCoverage
 */
define([
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../geom/Sector',
        '../globe/TiledElevationCoverage'],
    function (ArgumentError,
              Location,
              Logger,
              Sector,
              TiledElevationCoverage) {
        "use strict";

        /**
         * Constructs a Zero elevation coverage whose elevations are zero at every location.
         * @alias ZeroElevationCoverage
         * @constructor
         * @classdesc Represents an elevation coverage whose elevations are zero at all locations.
         * @augments TiledElevationCoverage
         */
        var ZeroElevationCoverage = function () {
            TiledElevationCoverage.call(this, Sector.FULL_SPHERE, new Location(45, 45), 1, " ", " ", 150, 150);

            /**
             * Indicates this elevation coverage's display name.
             * @type {string}
             * @default "Zero Elevations"
             */
            this.displayName = "Zero Elevations";

            /**
             * Indicates the last time this elevation coverage changed. Since a zero elevation coverage never changes, this
             * property always returns the date and time at which the elevation coverage was constructed, in milliseconds
             * since midnight Jan 1, 1970.
             * @type {number}
             * @default Date.getTime() at construction
             * @readonly
             */
            this.timestamp = Date.now();

            /**
             * This elevation coverage's minimum elevation, which is always 0.
             * @type {number}
             * @default 0
             * @readonly
             */
            this.minElevation = 0;

            /**
             * This elevation coverage's maximum elevation, which is always 0.
             * @type {number}
             * @default 0
             * @readonly
             */
            this.maxElevation = 0;
        };

        // Inherit from the abstract elevation coverage class.
        ZeroElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

        /**
         * Returns minimum and maximum elevations of 0.
         * @param {Sector} sector The sector for which to determine extreme elevations.
         * @returns {Number[]} An array containing minimum and maximum elevations of 0.
         */
        ZeroElevationCoverage.prototype.minAndMaxElevationsForSector = function (sector) {
            return [0, 0];
        };

        /**
         * Returns 0 as the elevation at a specified location.
         * @param {Number} latitude The location's latitude in degrees.
         * @param {Number} longitude The location's longitude in degrees.
         * @returns {Number} 0.
         */
        ZeroElevationCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
            return 0;
        };

        /**
         * Returns the elevations at locations within a specified sector. For this elevation coverage they are all 0.
         * @param {Sector} sector The sector for which to determine the elevations.
         * @param {Number} numLat The number of latitudinal sample locations within the sector.
         * @param {Number} numLon The number of longitudinal sample locations within the sector.
         * @param {Number} targetResolution The desired elevation resolution.
         * @param {Number[]} result An array of size numLat x numLon to contain the requested elevations.
         * This array must be allocated when passed to this function.
         * @returns {Number} The resolution actually achieved, which may be greater than that requested if the
         * elevation data for the requested resolution is not currently available.
         * @throws {ArgumentError} If the specified sector or result array is null or undefined, if either of the
         * specified numLat or numLon values is less than 1, or the result array is not of sufficient length
         * to hold numLat x numLon values.
         */
        ZeroElevationCoverage.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ZeroElevationCoverage", "elevationsForSector", "missingSector"));
            }

            if (numLat <= 0 || numLon <= 0) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ZeroElevationCoverage",
                    "elevationsForSector", "numLat or numLon is less than 1"));
            }

            if (!result || result.length < numLat * numLon) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ZeroElevationCoverage",
                    "elevationsForSector", "missingArray"));
            }

            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = 0;
            }

            return 0;
        };

        return ZeroElevationCoverage;
    });