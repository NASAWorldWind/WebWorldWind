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
/**
 * @exports ElevationCoverage
 */
define(['../error/ArgumentError',
        '../util/Logger',
        '../geom/Sector'],
    function (ArgumentError,
              Logger,
              Sector) {
        "use strict";

        /**
         * Constructs an ElevationCoverage
         * @alias ElevationCoverage
         * @constructor
         * @classdesc When used directly and not through a subclass, this class represents an elevation coverage
         * whose elevations are zero at all locations.
         * @param {Number} resolution The resolution of the coverage in meters.
         * @throws {ArgumentError} If the resolution argument is null, undefined, or zero.
         */
        var ElevationCoverage = function (resolution) {
            if (!resolution) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "constructor",
                        "missingResolution"));
            }

            /**
             * Indicates the last time this coverage changed, in milliseconds since midnight Jan 1, 1970.
             * @type {Number}
             * @readonly
             * @default Date.now() at construction
             */
            this.timestamp = Date.now();

            /**
             * Indicates this coverage's display name.
             * @type {String}
             * @default "Elevations"
             */
            this.displayName = "Zero Elevations";

            /**
             * Indicates whether or not to use this coverage.
             * @type {Boolean}
             * @default true
             */
            this.enabled = true;

            /**
             * The resolution of this coverage in meters.
             * @type {Number}
             */
            this.resolution = resolution;

            /**
             * The sector this coverage spans.
             * @type {Sector}
             * @readonly
             */
            this.coverageSector = Sector.FULL_SPHERE;
        };

        /**
         * Returns the minimum and maximum elevations within a specified sector.
         * @param {Sector} sector The sector for which to determine extreme elevations.
         * @returns {Number[]} An array containing the minimum and maximum elevations within the specified sector,
         * or null if the specified sector is outside this elevation model's coverage area.
         * @throws {ArgumentError} If the specified sector is null or undefined.
         */
        ElevationCoverage.prototype.minAndMaxElevationsForSector = function (sector) {
            return [0, 0];
        };

        /**
         * Returns the elevation at a specified location.
         * @param {Number} latitude The location's latitude in degrees.
         * @param {Number} longitude The location's longitude in degrees.
         * @returns {Number} The elevation at the specified location, in meters. Returns zero if the location is
         * outside the coverage area of this coverage.
         */
        ElevationCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
            return 0;
        };

        /**
         * Returns the elevations at locations within a specified sector.
         * @param {Sector} sector The sector for which to determine the elevations.
         * @param {Number} numLat The number of latitudinal sample locations within the sector.
         * @param {Number} numLon The number of longitudinal sample locations within the sector.
         * @param {Number} targetResolution The desired elevation resolution, in radians. (To compute radians from
         * meters, divide the number of meters by the globe's radius.)
         * @param {Number[]} result An array in which to return the requested elevations.
         * @returns {Number} The resolution actually achieved, which may be greater than that requested if the
         * elevation data for the requested resolution is not currently available.
         * @throws {ArgumentError} If the specified sector or result array is null or undefined, or if either of the
         * specified numLat or numLon values is less than one.
         */
        ElevationCoverage.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "elevationsForGrid", "missingSector"));
            }

            if (numLat <= 0 || numLon <= 0) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage",
                    "elevationsForGrid", "numLat or numLon is less than 1"));
            }

            if (!result || result.length < numLat * numLon) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage",
                    "elevationsForGrid", "missingArray"));
            }

            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = 0;
            }

            return 0;
        };

        return ElevationCoverage;
    });