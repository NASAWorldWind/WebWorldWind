/*
 * Copyright 2018 WorldWind Contributors
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
 * @exports WcsCoverage
 */
define([
        '../../error/ArgumentError',
        '../../geom/Location',
        '../../util/Logger',
        '../../ogc/wcs/WcsUrlBuilder'
    ],
    function (ArgumentError,
              Location,
              Logger,
              WcsUrlBuilder) {
        "use strict";

        /**
         * A simple object representation of a Web Coverage Service coverage. Provides utility methods and properties
         * for use in common WCS Coverage operations.
         * @param {String} coverageId the name or id of the coverage
         * @param {WebCoverageService} webCoverageService the WebCoverageService providing the coverage
         * @constructor
         */
        var WcsCoverage = function (coverageId, webCoverageService) {
            if (!coverageId) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverage", "constructor",
                        "The specified coverage id is null or undefined."));
            }

            if (!webCoverageService) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCoverage", "constructor",
                        "The specified WebCoverageService is null or undefined."));
            }

            /**
             * The Web Coverage Service Coverages id or name as assigned by the providing service.
             * @type {String}
             */
            this.coverageId = coverageId;

            /**
             * The WebCoverageService responsible for managing this Coveragea and Web Coverage Service.
             * @type {WebCoverageService}
             */
            this.service = webCoverageService;

            /**
             * The Sector representing the bounds of the coverage.
             * @type {Sector}
             */
            this.sector = this.service.coverageDescriptions.getSector(this.coverageId);

            /**
             * The resolution of the coverage, in degrees.
             * @type {Number}
             */
            this.resolution = this.service.coverageDescriptions.getResolution(this.coverageId);

            /**
             * A configuration object for use by TiledElevationCoverage.
             * @type {{}}
             */
            this.elevationConfiguration = this.createElevationConfiguration();
        };

        /**
         * Preferred formats used for fuzzy comparison to available formats.
         * @type {string[]}
         */
        WcsCoverage.PREFERRED_FORMATS = ["geotiff", "tiff"];

        /**
         * The default data format.
         * @type {string}
         */
        WcsCoverage.DEFAULT_FORMAT = "image/tiff";

        /**
         * The default data width.
         * @type {number}
         */
        WcsCoverage.DEFAULT_TILE_WIDTH = 256;

        /**
         * The default data height.
         * @type {number}
         */
        WcsCoverage.DEFAULT_TILE_HEIGHT = 256;

        /**
         * A default level zero tile delta for global coverages.
         * @type {Location}
         */
        WcsCoverage.DEFAULT_LEVEL_ZERO_DELTA = new Location(45, 45);

        // Internal use only
        WcsCoverage.prototype.createElevationConfiguration = function () {
            return {
                coverageSector: this.sector,
                resolution: this.resolution,
                retrievalImageFormat: this.determineFormatFromService(),
                levelZeroDelta: WcsCoverage.DEFAULT_LEVEL_ZERO_DELTA,
                numLevels: WcsCoverage.calculateNumberOfLevels(this.resolution),
                tileWidth: WcsCoverage.DEFAULT_TILE_WIDTH,
                tileHeight: WcsCoverage.DEFAULT_TILE_HEIGHT,
                cachePath: this.coverageId,
                minElevation: -11000,
                maxElevation: 8850,
                urlBuilder: new WcsUrlBuilder(this)
            };
        };

        // Internal use only
        WcsCoverage.prototype.determineFormatFromService = function () {
            var version = this.service.capabilities.version, availableFormats, format, coverageDescription;

            // find the associated coverage description
            if (version === "1.0.0") {
                for (var i = 0, len = this.service.coverageDescriptions.coverages.length; i < len; i++) {
                    if (this.coverageId === this.service.coverageDescriptions.coverages[i].name) {
                        availableFormats = this.service.coverageDescriptions.coverages[i].supportedFormats.formats;
                        break;
                    }
                }
            } else if (version === "2.0.1" || version === "2.0.0") {
                availableFormats = this.service.capabilities.serviceMetadata.formatsSupported
            }

            if (!availableFormats) {
                return WcsCoverage.DEFAULT_FORMAT;
            }

            for (i = 0; i < WcsCoverage.PREFERRED_FORMATS.length; i++) {
                format = WcsCoverage.PREFERRED_FORMATS[i].toLowerCase();
                for (var j = 0; j < availableFormats.length; j++) {
                    if (availableFormats[j].toLowerCase().indexOf(format) >= 0) {
                        return availableFormats[j];
                    }
                }
            }

            return WcsCoverage.DEFAULT_FORMAT;
        };

        // Internal use only - See WWA LevelSetConfig
        WcsCoverage.calculateNumberOfLevels = function (degreesPerPixel) {
            var firstLevelDegreesPerPixel = 90 / WcsCoverage.DEFAULT_TILE_HEIGHT;
            var level = Math.log(firstLevelDegreesPerPixel / degreesPerPixel) / Math.log(2); // fractional level address
            var levelNumber = Math.floor(level); // floor prevents exceeding the min scale

            if (levelNumber < 0) {
                levelNumber = 0; // need at least one level, even if it exceeds the desired resolution
            }

            return levelNumber; // convert level number to level count
        };

        return WcsCoverage;
    });
