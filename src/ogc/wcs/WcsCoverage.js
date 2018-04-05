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
        '../../ogc/wcs/WcsCapabilities',
        '../../ogc/wcs/WcsDescribeCoverage'
    ],
    function (ArgumentError,
              Logger,
              WcsCapabilities,
              WcsDescribeCoverage) {
        "use strict";

        /**
         * A Web Coverage Service version agnostic simple object representation of a coverage. Provides utility methods
         * for common WCS Coverage operations.
         * @param coverageId the name or id of the coverage
         * @param getCapabilities the WcsCapabilities object representing the capabilities of this coverage
         * @param describeCoverage the WcsDescribeCoverage object representing the additional parameters of the coverage
         * @constructor
         */
        var WcsCoverage = function (coverageId, getCapabilities, describeCoverage) {

        };

        /**
         * Creates and returns a simple configuration object with required parameters of an ElevationCoverage.
         * @returns a simple configuration object for use by ElevationCoverage constructor
         */
        WcsCoverage.prototype.elevationConfig = function () {

        };

        return WcsCoverage;
    });
