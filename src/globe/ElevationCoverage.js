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
define(['../util/Logger',
        '../error/UnsupportedOperationError'],
    function (Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * Constructs an ElevationCoverage
         * @alias ElevationCoverage
         * @constructor
         */
        var ElevationCoverage = function () {

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
            this.displayName = "Elevations";

            /**
             * Indicates whether or not to use this coverage.
             * @type {Boolean}
             * @default true
             */
            this.enabled = true;
        };

        /**
         * Returns the minimum and maximum elevations within a specified sector.
         * @param {Sector} sector The sector for which to determine extreme elevations.
         * @returns {Number[]} An array containing the minimum and maximum elevations within the specified sector,
         * or null if the specified sector is outside this elevation model's coverage area.
         * @throws {ArgumentError} If the specified sector is null or undefined.
         */
        ElevationCoverage.prototype.minAndMaxElevationsForSector = function (sector) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "minAndMaxElevationsForSector", "abstractInvocation"));
        };

        /**
         * Returns the elevation at a specified location.
         * @param {Number} latitude The location's latitude in degrees.
         * @param {Number} longitude The location's longitude in degrees.
         * @returns {Number} The elevation at the specified location, in meters. Returns zero if the location is
         * outside the coverage area of this coverage.
         */
        ElevationCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "elevationAtLocation", "abstractInvocation"));
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
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "elevationsForGrid", "abstractInvocation"));
        };

        /**
         * Indicates the best resolution attainable for a specified sector.
         *
         * @param sector the sector in question. If null, the elevation coverage's best overall resolution is returned. This is
         *               the best attainable at <em>some</em> locations but not necessarily at all locations.
         *
         * @return the best resolution attainable for the specified sector, in radians, or {@link Number.MAX_VALUE} if the
         *         sector does not intersect the elevation model.
         */
        ElevationCoverage.prototype.getBestResolution = function (sector) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationCoverage", "getBestResolution", "abstractInvocation"));
        };

        return ElevationCoverage;
    });