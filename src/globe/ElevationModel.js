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
 * @exports ElevationModel
 */
define(['../error/ArgumentError',
        '../util/Logger'],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs an elevation model.
         * @alias ElevationModel
         * @constructor
         * @classdesc Represents the elevations for an area, often but not necessarily the whole globe.
         */
        var ElevationModel = function () {

            /**
             * Internal use only
             * The unique ID of this model.
             * @type {Array}
             * @ignore
             */
            this.id = 0;

            /**
             * A string identifying this elevation model's current state. Used to compare states during rendering to
             * determine whether globe-state dependent cached values must be updated. Applications typically do not
             * interact with this property. It is primarily used by shapes and terrain generators.
             * @memberof ElevationModel.prototype
             * @readonly
             * @type {String}
             */
            this.stateKey = "";

            /**
             * Internal use only
             * The list of all elevation coverages useable by this model.
             * @type {Array}
             * @ignore
             */
            this.coverages = [];

            this.computeStateKey();

        };

        Object.defineProperties(ElevationModel.prototype, {
            /**
             * Indicates the last time the coverages changed, in milliseconds since midnight Jan 1, 1970.
             * @type {Number}
             * @readonly
             */
            timestamp: {
                get: function () {
                    var maxTimestamp = 0;

                    for (var i = 0; i < this.coverages.length; i++) {
                        if (maxTimestamp < this.coverages[i].timestamp) {
                            maxTimestamp = this.coverages[i].timestamp;
                        }
                    }

                    return maxTimestamp;
                }
            },

            /**
             * This model's minimum elevation in meters across all coverages.
             * @type {Number}
             * @readonly
             */
            minElevation: {
                get: function () {
                    var minElevation = Number.MAX_VALUE;

                    for (var i = 0; i < this.coverages.length; i++) {
                        if (this.coverages[i].minElevation < minElevation) {
                            minElevation = this.coverages[i].minElevation;
                        }
                    }

                    return minElevation;
                }
            },

            /**
             * This model's maximum elevation in meters across all coverages.
             * @type {Number}
             * @readonly
             */
            maxElevation: {
                get: function () {
                    var maxElevation = Number.MIN_VALUE;

                    for (var i = 0; i < this.coverages.length; i++) {
                        if (maxElevation < this.coverages[i].maxElevation) {
                            maxElevation = this.coverages[i].maxElevation;
                        }
                    }

                    return maxElevation;
                }
            }
        });

        /**
         * Internal use only
         * Used to assign unique IDs to elevation models for use in their state key.
         * @type {Number}
         * @ignore
         */
        ElevationModel.idPool = 0;

        /**
         * Internal use only
         * Sets the state key to a new unique value.
         * @type {Array}
         * @ignore
         */
        ElevationModel.prototype.computeStateKey = function () {
            this.id = ++ElevationModel.idPool;
            this.stateKey = "elevationModel " + this.id.toString() + " ";
        };

        ElevationModel.prototype.addCoverage = function (coverage) {
            if (!coverage) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "addCoverage", "missingCoverage"));
            }

            var index = this.coverages.indexOf(coverage);
            if (index < 0) {
                this.coverages.push(coverage);
                this.computeStateKey();
                return true;
            }

            return false;
        };

        /**
         * Returns the minimum and maximum elevations within a specified sector.
         * @param {Sector} sector The sector for which to determine extreme elevations.
         * @returns {Number[]} An array containing the minimum and maximum elevations within the specified sector,
         * or null if the specified sector is outside this elevation model's coverage area.
         * @throws {ArgumentError} If the specified sector is null or undefined.
         */
        ElevationModel.prototype.minAndMaxElevationsForSector = function (sector) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "minAndMaxElevationsForSector", "missingSector"));
            }

            var result = [Number.MAX_VALUE, Number.MIN_VALUE];

            for (var i = 0; i < this.coverages.length; i++) {
                var coverageResult = this.coverages[i].minAndMaxElevationsForSector(sector);
                if (coverageResult) {
                    result[0] = coverageResult[0] < Number.MAX_VALUE ? coverageResult[0] : result[0];
                    result[1] = coverageResult[1] > Number.MIN_VALUE ? coverageResult[1] : result[1];
                }
            }

            return result;
        };

        /**
         * Returns the elevation at a specified location.
         * @param {Number} latitude The location's latitude in degrees.
         * @param {Number} longitude The location's longitude in degrees.
         * @returns {Number} The elevation at the specified location, in meters. Returns zero if the location is
         * outside the coverage area of this coverage.
         */
        ElevationModel.prototype.elevationAtLocation = function (latitude, longitude) {
            var result = 0;
            for (var i = 0; i < this.coverages.length; i++) {
                var elevation = this.coverages[i].elevationAtLocation(latitude, longitude);
                if (elevation !== 0) {
                    result = elevation;
                }
            }
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
        ElevationModel.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "elevationsForSector", "missingSector"));
            }

            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "elevationsForSector", "missingResult"));
            }

            if (!numLat || !numLon || numLat < 1 || numLon < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "constructor",
                        "The specified number of latitudinal or longitudinal positions is less than one."));
            }

            var resolution = Number.MAX_VALUE;
            var coverageResult = new Float64Array(result.length);
            for (var i = 0; i < this.coverages.length; i++) {
                var coverageResolution = this.coverages[i].elevationsForGrid(sector, numLat, numLon, targetResolution, coverageResult);
                if (coverageResolution < Number.MAX_VALUE) {
                    resolution = coverageResolution;
                    for (var j = 0; j < result.length; j++) {
                        result[j] = coverageResult[j];
                    }
                }
            }

            return resolution;
        };

        return ElevationModel;

    });