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
 * @exports WebCoverageService
 */
define([
    '../../error/ArgumentError',
    '../../util/Logger',
    '../../util/Promise',
    '../../ogc/wcs/WcsCapabilities',
    '../../ogc/wcs/WcsCoverage',
    '../../ogc/wcs/WcsDescribeCoverage'
    ],
    function (ArgumentError,
              Logger,
              Promise,
              WcsCapabilities,
              WcsCoverage,
              WcsDescribeCoverage) {
        "use strict";

        /**
         * Represents a Web Coverage Service and provides functionality for interacting with the service. Includes
         * functionality for retrieving DescribeCoverage documents and providing WCS version agnostic coverage objects.
         * @param serviceAddress the url of the Web Coverage Service
         * @param getCapabilities {WcsCapabilities}
         * @constructor
         */
        var WebCoverageService = function (serviceAddress, getCapabilities) {

        };

        /**
         * Creates a WebCoverageService based on the provided service address. This function handles version negotiation
         * and capabilities document retrieval. The return is a Promise which returns the completed WebCoverageService.
         * @param serviceAddress the url of the Web Coverage Service
         * @param version optional WCS version
         * @returns {Promise} a Promise of a WebCoverageService
         */
        WebCoverageService.connect = function (serviceAddress, version) {

        };

        /**
         * Returns a Promise to an array of version agnostic WcsCoverage objects for the provided array of coverage
         * names or ids.
         * @param coverageIds an optional array of the requested coverage arrays. If no coverage ids are specified, all
         * coverages expressed in the GetCapabilities document are returned
         * @returns {Promise} a Promise of an array of WcsCoverage objects
         */
        WebCoverageService.prototype.coverages = function (coverageIds) {

        };

        return WebCoverageService;
    });
