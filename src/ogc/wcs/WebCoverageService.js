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
         * @constructor
         */
        var WebCoverageService = function () {

            /**
             * The URL for the Web Coverage Service
             */
            this.serviceAddress = null;

            /**
             * A collection of the coverages available from this service. Not populated until service is initialized by
             * the connect method.
             * @type {Array}
             */
            this.coverages = [];

            /**
             * The WCS GetCapabilities document for this service.
             * @type {WcsCapabilities}
             */
            this.capabilities = null;

            /**
             * A map of the coverages to their corresponding DescribeCoverage documents.
             * @type {WcsDescribeCoverage}
             */
            this.coverageDescriptions = null;
        };

        /**
         * An array of compatible WCS versions supported by this client service.
         * @type {string[]}
         */
        WebCoverageService.COMPATIBLE_WCS_VERSIONS = ["1.0.0", "2.0.0", "2.0.1"];

        WebCoverageService.WCS_XLMNS = "http://www.opengis.net/wcs";

        WebCoverageService.WCS_2_XLMNS = "http://www.opengis.net/wcs/2.0";

        /**
         * Contacts the Web Coverage Service specified by the service address. This function handles version negotiation
         * and capabilities and describe coverage document retrieval. The return is a Promise to a fully initialized
         * WebCoverageService which includes an array of WcsCoverage objects available from this service.
         * @param serviceAddress the url of the WebCoverageService
         * @returns {PromiseLike<WebCoverageService>}
         */
        WebCoverageService.create = function (serviceAddress) {
            var service = new WebCoverageService();
            service.serviceAddress = serviceAddress;

            // Make the initial request for version 2.0.1, the retrieveCapabilities method will renegotiate if needed
            return service.retrieveCapabilities()
                .then(function (wcsCapabilities) {
                    service.capabilities = wcsCapabilities;
                    return service.describeCoverages(wcsCapabilities);
                })
                .then(function (coverages) {
                    service.parseCoverages(coverages);
                    return service;
                });
        };

        /**
         * Returns the coverage associated with the provided id or name
         * @param coverageId the requested coverage id or name
         * @returns {WcsCoverage}
         */
        WebCoverageService.prototype.getCoverage = function (coverageId) {
            // TODO
        };

        // Internal use only
        WebCoverageService.prototype.retrieveCapabilities = function () {
            var self = this;

            return self.retrieveXml(self.buildCapabilitiesXmlRequest("2.0.1"))
                // Check if the server supports our preferred version of 2.0.1 or 2.0.0
                .then(function (xmlDom) {
                    if (self.isCompatibleWcsVersion(xmlDom)) {
                        return xmlDom;
                    } else {
                        // If needed, try the server again with a 1.0.0 request
                        return self.retrieveXml(self.buildCapabilitiesXmlRequest("1.0.0"));
                    }
                })
                // Parse the result, if there is an error it will bubble to the client catch
                .then(function (xmlDom) {
                    return new WcsCapabilities(xmlDom);
                });
        };

        // Internal use only
        WebCoverageService.prototype.describeCoverages = function () {
            return this.retrieveXml(this.buildDescribeCoverageXmlRequest());
        };

        // Internal use only
        WebCoverageService.prototype.parseCoverages = function (xmlDom) {
            this.coverageDescriptions = new WcsDescribeCoverage(xmlDom);
            var coverageCount = this.coverageDescriptions.coverages.length;

            for (var i = 0; i < coverageCount; i++) {
                this.coverages.push(this.coverageDescriptions.coverages[i]);
            }
        };

        // Internal use only
        WebCoverageService.prototype.retrieveXml = function (request) {
            var url = request.url;

            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(xhr.responseXML);
                        } else {
                            reject(new Error(Logger.log(Logger.LEVEL_WARNING,"XML retrieval failed (" + xhr.statusText + "): " + url)));
                        }
                    }
                };
                xhr.onerror = function () {
                    reject(new Error(Logger.log(Logger.LEVEL_WARNING, "XML retrieval failed: " + url)));
                };
                xhr.ontimeout = function () {
                    reject(new Error(Logger.log(Logger.LEVEL_WARNING, "XML retrieval timed out: " + url)));
                };
                xhr.send(request.body);
            });
        };

        // Internal use only
        WebCoverageService.prototype.buildCapabilitiesXmlRequest = function (version) {
            var capabilitiesElement;

            if (version === "1.0.0") {
                capabilitiesElement = document.createElementNS(WebCoverageService.WCS_XLMNS, "GetCapabilities");
                capabilitiesElement.setAttribute("service", "WCS");
                capabilitiesElement.setAttribute("version", "1.0.0");
            } else if (version === "2.0.1" || version === "2.0.0") {
                capabilitiesElement = document.createElementNS(WebCoverageService.WCS_2_XLMNS, "GetCapabilities");
                capabilitiesElement.setAttribute("service", "WCS");
                capabilitiesElement.setAttribute("version", version);
            }

            return {
                url: this.serviceAddress,
                body: new XMLSerializer().serializeToString(capabilitiesElement)
            };
        };

        // Internal use only
        WebCoverageService.prototype.buildDescribeCoverageXmlRequest = function () {
            var version = this.capabilities.version, describeElement, coverageCount = this.capabilities.coverages.length,
                coverageElement, requestUrl;

            if (version === "1.0.0") {
                describeElement = document.createElementNS(WebCoverageService.WCS_XLMNS, "DescribeCoverage");
                describeElement.setAttribute("service", "WCS");
                describeElement.setAttribute("version", "1.0.0");
                requestUrl = this.capabilities.capability.request.describeCoverage.get;
            } else if (version === "2.0.1" || version === "2.0.0") {
                describeElement = document.createElementNS(WebCoverageService.WCS_2_XLMNS, "DescribeCoverage");
                describeElement.setAttribute("service", "WCS");
                describeElement.setAttribute("version", version);
                requestUrl = this.capabilities.operationsMetadata.getOperationMetadataByName("DescribeCoverage").dcp[0].getMethods[0].url;
            }

            for (var i = 0; i < coverageCount; i++) {
                if (version === "1.0.0") {
                    coverageElement = document.createElementNS(WebCoverageService.WCS_XLMNS, "Coverage");
                    //coverageElement.innerText = this.capabilities.coverages[i].name;
                    coverageElement.appendChild(document.createTextNode(this.capabilities.coverages[i].name));
                } else if (version === "2.0.1" || version === "2.0.0") {
                    coverageElement = document.createElementNS(WebCoverageService.WCS_2_XLMNS, "CoverageId");
                    //coverageElement.innerText = this.capabilities.coverages[i].coverageId;
                    coverageElement.appendChild(document.createTextNode(this.capabilities.coverages[i].coverageId));
                }
                describeElement.appendChild(coverageElement);
            }

            return {
                url: requestUrl,
                body: new XMLSerializer().serializeToString(describeElement)
            };
        };

        // Internal use only
        WebCoverageService.prototype.isCompatibleWcsVersion = function (xmlDom) {
            if (!xmlDom) {
                return false;
            }

            var version = xmlDom.documentElement.getAttribute("version");

            return WebCoverageService.COMPATIBLE_WCS_VERSIONS.indexOf(version) >= 0;
        };

        return WebCoverageService;
    });
