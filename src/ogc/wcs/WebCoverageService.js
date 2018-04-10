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
         * @constructor
         */
        var WebCoverageService = function (serviceAddress) {

            /**
             * The URL for the Web Coverage Service
             */
            this.serviceAddress = serviceAddress;

            /**
             * A collection of the coverages available from this service. Not populated until service is initialized by
             * the connect method.
             * @type {Array}
             */
            this.coverages = [];

            this._connectPromise = null;
        };

        /**
         * Connects to the Web Coverage Service specified in the constructor. This function handles version negotiation
         * and capabilities document retrieval. The return is a Promise which returns the initialized
         * WebCoverageService.
         * @returns {Promise} a Promise of a WebCoverageService
         */
        WebCoverageService.prototype.connect = function () {
            var self = this;

            if (!self._connectPromise) {
                self._connectPromise = new Promise(function (resolve, reject) {

                    // Configuration Steps
                    // 1. Retrieve Capabilities Document
                    // 2. Parse, ensure version is compatible
                    // 3. Retry if necessary with error fallback
                    // 4. Create DescribeCoverage request(s)
                    // 5. Parse Describe Coverage
                    // 6. Setup 'coverages' array
                    self.negotiateService()
                        .then(self.retrieveDescribeCoverage)
                        .then(function (describeCoverages) {
                            var len = describeCoverages.length, coverageDescription, coverageCount;
                            for (var i = 0; i < len; i++) {
                                coverageDescription = new WcsDescribeCoverage(describeCoverages[i]);
                                coverageCount = coverageDescription.coverages.length;
                                for (var j = 0; j < coverageCount; j++) {
                                    self.coverages.push(coverageDescription.coverages[i]);
                                }
                            }
                            resolve(self);
                        })
                        .catch(function (e) {
                            reject(e);
                        });
                });
            }

            return self._connectPromise;
        };

        /**
         * Returns the coverage associated with the provided id or name
         * @param coverageId the requested coverage id or name
         * @returns {WcsCoverage}
         */
        WebCoverageService.prototype.getCoverage = function (coverageId) {

        };

        // Internal use only
        WebCoverageService.prototype.retrieveDescribeCoverage = function (wcsCaps) {
            if (!wcsCaps) {
                throw new Error("no capabilities document");
            }

            var len = wcsCaps.coverages.length, version = wcsCaps.version, coverageIds = [], coverage, baseUrl,
                remainingCharCount, characterCount = 0, coverageId, requests = [];

            if (version === "1.0.0") {
                baseUrl = wcsCaps.capability.request.describeCoverage.get
                    + "SERVICE=WCS&REQUEST=DescribeCoverage&VERSION=1.0.0&COVERAGES=";
            } else if (version === "2.0.0" || version === "2.0.1") {
                baseUrl = wcsCaps.operationsMetadata.getOperationMetadataByName("DescribeCoverage").dcp[0].getMethods[0].url
                    + "SERVICE=WCS&REQUEST=DescribeCoverage&VERSION=" + version + "&COVERAGEID=";
            }
            remainingCharCount = 2083 - baseUrl.length;

            for (var i = 0; i < len; i++) {
                coverage = wcsCaps.coverages[i];
                if (version === "1.0.0") {
                    coverageId = coverage.name;
                } else if (version === "2.0.0" || version === "2.0.1") {
                    coverageId = coverage.coverageId;
                }

                if (coverageId.length + characterCount > remainingCharCount) {
                    requests.push(WebCoverageService.retrieveXml(baseUrl + coverageIds.join(",")));
                    characterCount = 0;
                    coverageIds = [];
                }

                coverageIds.push(coverageId);
                characterCount += coverageId.length;
            }

            requests.push(WebCoverageService.retrieveXml(baseUrl + coverageIds.join(",")));

            return Promise.all(requests);
        };

        // Internal use only
        WebCoverageService.prototype.negotiateService = function (version) {
            var wcsCaps, self = this;

            return new Promise(function (resolve, reject) {

                WebCoverageService.retrieveXml(self.buildGetCapabilitiesUrl(version))
                    .then(function (xml) {
                        try {
                            wcsCaps = new WcsCapabilities(xml);
                            resolve(wcsCaps);
                        } catch (e) {
                            if (!version) {
                                resolve(self.negotiateService("1.0.0"));
                            } else {
                                reject(Error("unable to parse"));
                            }
                        }
                    });
            });
        };

        // Internal use only
        WebCoverageService.retrieveXml = function (url) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.onloadend = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseXML);
                        }
                    }
                };
                xhr.onerror = function () {
                    reject(Error(xhr.statusText));
                };
                xhr.send();
            });
        };

        // Internal use only
        WebCoverageService.prototype.buildGetCapabilitiesUrl = function (version) {
            var requestUrl;

            if (this.serviceAddress.indexOf("?") > 0) {
                requestUrl = this.serviceAddress + "&";
            } else {
                requestUrl = this.serviceAddress + "?";
            }

            requestUrl += "SERVICE=WCS";
            requestUrl += "&REQUEST=GetCapabilities";
            if (version) {
                requestUrl += "&VERSION=" + version;
            }

            return encodeURI(requestUrl);
        };

        // Internal use only
        WebCoverageService.prototype.buildDescribeCoverageUrl = function (wcsCaps) {
            if (!wcsCaps) {
                throw new ArgumentError("blaa"); // TODO
            }
            var version = wcsCaps.version;

            if (version === "1.0.0") {
                return wcsCaps.capability.request.describeCoverage.get + "?SERVICE=WCS&REQUEST=DescribeCoverage&VERSION=1.0.0&COVERAGES=";
            } else if (version === "2.0.0" || version === "2.0.1") {
                return wcsCaps.operationsMetadata.getOperationMetadataByName("DescribeCoverage").dcp[0].getMethods[0].url
                    + "?SERVICE=WCS&REQUEST=DescribeCoverage&VERSION=" + version + "COVERAGEID=";
            }
        };

        return WebCoverageService;
    });
