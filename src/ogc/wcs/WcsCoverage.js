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
        '../../util/Logger',
        '../../geom/Sector'
    ],
    function (ArgumentError,
              Logger,
              Sector) {
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
            this.webCoverageService = webCoverageService;

            /**
             * The Sector representing the bounds of the coverage.
             */
            this.sector = this.webCoverageService.coverageDescriptions.getSector(this.coverageId);

            /**
             * The resolution of the coverage, in degrees.
             */
            this.resolution = this.webCoverageService.coverageDescriptions.getResolution(this.coverageId);

            /**
             * A configuration object for use by TiledElevationCoverage.
             */
            this.elevationConfiguration = this.createElevationConfiguration();
        };

        // Internal use only
        WcsCoverage.prototype.createElevationConfiguration = function () {
            // TODO
            return {};
        };

        return WcsCoverage;
    });
