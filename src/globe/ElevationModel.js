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
             * The list of all elevation coverages usable by this model.
             * @type {Array}
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

                    var i, len;
                    for (i = 0, len = this.coverages.length; i < len; i++) {
                        var coverage = this.coverages[i];
                        if (maxTimestamp < coverage.timestamp) {
                            maxTimestamp = coverage.timestamp;
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

                    var i, len;
                    for (i = 0, len = this.coverages.length; i < len; i++) {
                        var coverage = this.coverages[i];
                        if (coverage.enabled && coverage.minElevation < minElevation) {
                            minElevation = coverage.minElevation;
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
                    var maxElevation = -Number.MAX_VALUE;

                    var i, len;
                    for (i = 0, len = this.coverages.length; i < len; i++) {
                        var coverage = this.coverages[i];
                        if (coverage.enabled && maxElevation < coverage.maxElevation) {
                            maxElevation = coverage.maxElevation;
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
         * @ignore
         */
        ElevationModel.prototype.computeStateKey = function () {
            this.id = ++ElevationModel.idPool;
            this.stateKey = "elevationModel " + this.id.toString() + " ";
        };

        /**
         * Internal use only
         * The comparison function used for sorting elevation coverages.
         * @ignore
         */
        ElevationModel.prototype.coverageComparator = function (coverage1, coverage2) {
            var res1 = coverage1.resolution;
            var res2 = coverage2.resolution;
            // sort from lowest resolution to highest
            return res1 > res2 ? -1 : res1 === res2 ? 0 : 1;
        };

        /**
         * Internal use only
         * The sort function used for sorting coverages according to their distance from a desired resolution.
         * @ignore
         */
        ElevationModel.prototype.sortForTargetResolution = function (resolution) {
            var coverageList = this.coverages.slice();
            coverageList.sort(function (coverage1, coverage2) {
                var d1 = Math.abs(coverage1.resolution - resolution);
                var d2 = Math.abs(coverage2.resolution - resolution);
                return d1 > d2 ? -1 : d1 === d2 ? 0 : 1;
            });

            return coverageList;
        };

        /**
         * Internal use only
         * Perform common actions required when the list of available coverages changes.
         * @ignore
         */
        ElevationModel.prototype.performCoverageListChangedActions = function () {
            if (this.coverages.length > 1) {
                this.coverages.sort(this.coverageComparator);
            }
            this.computeStateKey();
        };

        /**
         * Adds an elevation coverage to this elevation model and sorts the list. Duplicate coverages will be ignored.
         *
         * @param coverage The elevation coverage to add.
         * @return {Boolean} true if the ElevationCoverage as added; false if the coverage was a duplicate.
         * @throws ArgumentError if the specified elevation coverage is null.
         */
        ElevationModel.prototype.addCoverage = function (coverage) {
            if (!coverage) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "addCoverage", "missingCoverage"));
            }

            if (!this.containsCoverage(coverage)) {
                this.coverages.push(coverage);
                this.performCoverageListChangedActions();
                return true;
            }

            return false;
        };

        /**
         * Removes all elevation coverages from this elevation model.
         */
        ElevationModel.prototype.removeAllCoverages = function () {
            if (this.coverages.length > 0) {
                this.coverages = [];
                this.performCoverageListChangedActions();
            }
        };

        /**
         * Removes a specific elevation coverage from this elevation model.
         *
         * @param coverage The elevation model to remove.
         *
         * @throws ArgumentError if the specified elevation coverage is null.
         */
        ElevationModel.prototype.removeCoverage = function (coverage) {
            if (!coverage) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "removeCoverage", "missingCoverage"));
            }

            var index = this.coverages.indexOf(coverage);
            if (index >= 0) {
                this.coverages.splice(index, 1);
                this.performCoverageListChangedActions();
            }
        };

        /**
         * Returns true if this ElevationModel contains the specified ElevationCoverage, and false otherwise.
         *
         * @param coverage the ElevationCoverage to test.
         * @return {Boolean} true if the ElevationCoverage is in this ElevationModel; false otherwise.
         * @throws ArgumentError if the ElevationCoverage is null.
         */
        ElevationModel.prototype.containsCoverage = function (coverage) {
            if (!coverage) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "containsCoverage", "missingCoverage"));
            }
            var index = this.coverages.indexOf(coverage);
            return index >= 0;
        };

        /**
         * Returns the minimum and maximum elevations within a specified sector.
         * @param {Sector} sector The sector for which to determine extreme elevations.
         * @returns {Number[]} An array containing the minimum and maximum elevations within the specified sector. If no coverage
         * can satisfy the request, a min and max of zero is returned.
         * @throws {ArgumentError} If the specified sector is null or undefined.
         */
        ElevationModel.prototype.minAndMaxElevationsForSector = function (sector) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "minAndMaxElevationsForSector", "missingSector"));
            }

            var i,
                n = this.coverages.length,
                coverageResult;

            var result = [Number.MAX_VALUE, -Number.MAX_VALUE];
            var failoverResult = null;
            for (i = n - 1; i >= 0; i--) {
                var coverage = this.coverages[i];
                if (coverage.enabled && coverage.coverageSector.intersects(sector)) {
                    if (failoverResult === null) {
                        failoverResult = [coverage.minElevation, coverage.maxElevation];
                    }
                    coverageResult = coverage.minAndMaxElevationsForSector(sector);
                    if (coverageResult) {
                        result[0] = Math.min(result[0], coverageResult[0]);
                        result[1] = Math.max(result[1], coverageResult[1]);
                    }
                }
            }

            if (result[0] === Number.MAX_VALUE) {
                if (failoverResult === null) {
                    return [0, 0];
                }

                return failoverResult;
            }
            return result;
        };

        /**
         * Returns the elevation at a specified location.
         * @param {Number} latitude The location's latitude in degrees.
         * @param {Number} longitude The location's longitude in degrees.
         * @param {Number} resolution The desired elevation resolution, in degrees. (To compute degrees from
         * meters, divide the number of meters by the globe's radius to obtain radians and convert the result to degrees.)
         * @returns {Number} The elevation at the specified location, in meters. Returns zero if the location is
         * outside the coverage area of this model.
         * @throws {ArgumentError} If the specified resolution is not positive.
         */
        ElevationModel.prototype.elevationAtLocation = function (latitude, longitude, resolution) {

            if (resolution !== null && resolution !== undefined && resolution <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "elevationAtLocation", "invalidResolution"));
            }

            var coverageList = this.coverages;
            if (resolution) {
                coverageList = this.sortForTargetResolution(resolution);
            }

            var i, n = coverageList.length;
            for (i = n - 1; i >= 0; i--) {
                var coverage = coverageList[i];
                if (coverage.enabled && coverage.coverageSector.containsLocation(latitude, longitude)) {
                    var elevation = coverage.elevationAtLocation(latitude, longitude);
                    if (elevation !== null) {
                        return elevation;
                    }
                }
            }

            return 0;
        };

        /**
         * Returns the best coverage available for a particular resolution,
         * @param {Number} latitude The location's latitude in degrees.
         * @param {Number} longitude The location's longitude in degrees.
         * @param {Number} resolution The desired elevation resolution, in degrees. (To compute degrees from
         * meters, divide the number of meters by the globe's radius to obtain radians and convert the result to degrees.)
         * @returns {ElevationCoverage} The coverage most closely matching the requested resolution. Returns null if no coverage is available at this
         * location.
         * @throws {ArgumentError} If the specified resolution is not positive.
         */
        ElevationModel.prototype.bestCoverageAtLocation = function (latitude, longitude, resolution) {

            if (!resolution || resolution < 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "bestCoverageAtLocation", "invalidResolution"));
            }

            var coverageList = this.sortForTargetResolution(resolution);

            var i, n = coverageList.length;
            for (i = n - 1; i >= 0; i--) {
                var coverage = coverageList[i];
                if (coverage.enabled && coverage.coverageSector.containsLocation(latitude, longitude)) {
                    return coverage;
                }
            }

            return null;
        };

        /**
         * Returns the elevations at locations within a specified sector.
         * @param {Sector} sector The sector for which to determine the elevations.
         * @param {Number} numLat The number of latitudinal sample locations within the sector.
         * @param {Number} numLon The number of longitudinal sample locations within the sector.
         * @param {Number} targetResolution The desired elevation resolution, in degrees. (To compute degrees from
         * meters, divide the number of meters by the globe's radius to obtain radians and convert the result to degrees.)
         * @param {Number[]} result An array in which to return the requested elevations.
         * @returns {Number} The resolution actually achieved, which may be greater than that requested if the
         * elevation data for the requested resolution is not currently available.
         * @throws {ArgumentError} If the specified sector, targetResolution, or result array is null or undefined, or if either of the
         * specified numLat or numLon values is less than one.
         */
        ElevationModel.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "elevationsForGrid", "missingSector"));
            }

            if (!numLat || !numLon || numLat < 1 || numLon < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "elevationsForGrid",
                        "The specified number of latitudinal or longitudinal positions is less than one."));
            }

            if (!targetResolution) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "elevationsForGrid", "missingTargetResolution"));
            }

            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationModel", "elevationsForGrid", "missingResult"));
            }

            result.fill(NaN);
            var resolution = Number.MAX_VALUE, i, n = this.coverages.length, resultFilled = false;
            for (i = n - 1; !resultFilled && i >= 0; i--) {
                var coverage = this.coverages[i];
                if (coverage.enabled && coverage.coverageSector.intersects(sector)) {
                    resultFilled = coverage.elevationsForGrid(sector, numLat, numLon, targetResolution, result);
                    if (resultFilled) {
                        resolution = coverage.resolution;
                    }
                }
            }

            if (!resultFilled) {
                n = result.length;
                for (i = 0; i < n; i++) {
                    if (isNaN(result[i])) {
                        result[i] = 0;
                    }
                }
            }
            return resolution;
        };

        return ElevationModel;
    });
