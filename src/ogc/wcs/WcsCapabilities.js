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
 * @exports WcsCapabilities
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../ogc/ows/OwsDatasetSummary',
        '../../ogc/ows/OwsKeywords',
        '../../ogc/ows/OwsOperationsMetadata',
        '../../ogc/ows/OwsServiceIdentification',
        '../../ogc/ows/OwsServiceProvider'
    ],
    function (ArgumentError,
              Logger,
              OwsDatasetSummary,
              OwsKeywords,
              OwsOperationsMetadata,
              OwsServiceIdentification,
              OwsServiceProvider) {
        "use strict";

        /**
         * Constructs a WCS Capabilities instance from an XML DOM.
         * @alias WMSCapabilities
         * @constructor
         * @classdesc Represents the common properties of a WCS Capabilities document. This object represents a version
         * agnostic common model of a WCS Capabilities document. The common model is designed to facilitate use of the
         * service without requiring knowledge of the version. The original unmodified document object model is
         * referenced and available for query for advanced uses beyond the provided common model.
         * @param {{}} xmlDom An XML DOM representing the WMS Capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WcsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCapabilities", "constructor", "No XML DOM specified."));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
             * @private
             */
            this.xmlDom = xmlDom;

            this.assembleDocument();
        };

        WcsCapabilities.prototype.assembleDocument = function () {
            // Determine version and update sequence
            var root = this.xmlDom.documentElement;

            this.version = root.getAttribute("version");
            this.updateSequence = root.getAttribute("updateSequence");

            // WCS 1.0.0 does not utilize OWS Common GetCapabilities service and capability descriptions.
            if (this.version === "1.0.0") {
                this.assembleVersion100Document(root);
            } else {
                this.assembleVersion200Document(root);
            }
        };

        WcsCapabilities.prototype.assembleVersion200Document = function (root) {
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ServiceIdentification") {
                    this.serviceIdentification = new OwsServiceIdentification(child);
                } else if (child.localName === "ServiceProvider") {
                    this.serviceProvider = new OwsServiceProvider(child);
                } else if (child.localName === "OperationsMetadata") {
                    this.operationsMetadata = new OwsOperationsMetadata(child);
                } else if (child.localName === "ServiceMetadata") {
                    this.serviceMetadata = WcsCapabilities.assembleServiceMetadata(child);
                } else if (child.localName === "Contents") {
                    this.assembleContents(child);
                }
            }
        };

        WcsCapabilities.prototype.assembleVersion100Document = function (root) {
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Service") {
                    this.service = WcsCapabilities.assemble100Service(child);
                } else if (child.localName === "Capability") {
                    this.capability = WcsCapabilities.assemble100Capability(child);
                } else if (child.localName === "ContentMetadata") {
                    this.assembleContents(child);
                }
            }
        };

        WcsCapabilities.prototype.assembleContents = function (element) {
            var children = element.children || element.childNodes, coverage;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageSummary") {
                    // WCS 1.1+
                    coverage = new OwsDatasetSummary(child);
                    if (this.version === "2.0.0" || this.version === "2.0.1") {
                        coverage = WcsCapabilities.assembleDataset200Augment(child);
                    }
                    this.coverages = this.coverages || [];
                    this.coverages.push(coverage);
                } else if (child.localName === "CoverageOfferingBrief") {
                    // WCS 1.0.0
                    coverage = WcsCapabilities.assemble100Coverages(child);
                    this.coverages = this.coverages || [];
                    this.coverages.push(coverage);
                }
            }
        };

        WcsCapabilities.assembleDataset200Augment = function (element) {
            var children = element.children || element.childNodes, coverage = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageId") {
                    coverage.coverageId = child.textContent;
                } else if (child.localName === "CoverageSubtype") {
                    coverage.subType = coverage.subType || [];
                    coverage.subType.push(child.textContent);
                }
            }

            return coverage;
        };

        WcsCapabilities.assemble100Coverages = function (element) {
            var children = element.children || element.childNodes, coverage = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    coverage.coverageId = child.textContent;
                } else if (child.localName === "description") {
                    coverage.abstract = coverage.abstract || [];
                    coverage.abstract.push({value: child.textContent});
                } else if (child.localName === "label") {
                    // The label is being added to the abstract as there is not a comparable 2.0.0 element
                    coverage.abstract = coverage.abstract || [];
                    coverage.abstract.push({value: child.textContent});
                } else if (child.localName === "Keywords") {
                    // WCS 1.0.0 does not use OWS Keywords by namespace, but the implementation is identical
                    coverage.keywords = coverage.keywords || [];
                    coverage.keywords.push(new OwsKeywords(child));
                } else if (child.localName === "lonLatEnvelope") {
                    coverage.wgs84BoundingBox = WcsCapabilities.assembleLatLonBoundingBox(child);
                }
            }

            return coverage;
        };

        WcsCapabilities.assembleLatLonBoundingBox = function (element) {
            var children = element.children || element.childNodes, boundingBox = {}, previousValue, lonOne, lonTwo;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "pos") {
                    if (!previousValue) {
                        previousValue = child.textContent;
                        lonOne = new Number(previousValue.split(/\s+/)[0]);
                    } else {
                        lonTwo = new Number(child.textContent.split(/\s+/)[0]);
                        if (lonOne < lonTwo) {
                            boundingBox.lowerCorner = previousValue;
                            boundingBox.upperCorner = child.textContent;
                        } else {
                            boundingBox.lowerCorner = child.textContent;
                            boundingBox.upperCorner = previousValue;
                        }
                    }
                }
            }

            return boundingBox;
        };

        WcsCapabilities.assemble100Service = function (element) {
            var children = element.children || element.childNodes, service = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "description") {
                    service.description = child.textContent;
                } else if (child.localName === "name") {
                    service.name = child.textContent;
                } else if (child.localName === "label") {
                    service.label = child.textContent;
                } else if (child.localName === "fees") {
                    service.fees = child.textContent;
                } else if (child.localName === "accessConstraints") {
                    service.accessConstraints = service.accessConstraints || [];
                    service.accessConstraints.push(child.textContent);
                } else if (child.localName === "Keywords") {
                    // WCS 1.0.0 doesn't use the ogc namespace keywords, but the implementation is identical
                    service.keywords = new OwsKeywords(child);
                }

            }

            return service;
        };

        WcsCapabilities.assemble100Capability = function (element) {
            var children = element.children || element.childNodes, capability = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Request") {
                    capability.request = WcsCapabilities.assemble100RequestCapabilities(child);
                } else if (child.localName === "Exception") {
                    child = child.children || child.childNodes;
                    child = child[0];
                    // child should now be the Format element
                    capability.exception = capability.exception || [];
                    capability.exception.push(child.textContent);
                }
            }

            return capability;
        };

        WcsCapabilities.assemble100RequestCapabilities = function (element) {
            var children = element.children || element.childNodes, request = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "GetCapabilities") {
                    request.getCapabilities = WcsCapabilities.assemble100DCPType(child);
                } else if (child.localName === "DescribeCoverage") {
                    request.describeCoverage = this.assemble100DCPType(child);
                } else if (child.localName === "GetCoverage") {
                    request.getCoverage = WcsCapabilities.assemble100DCPType(child);
                }
            }

            return request;
        };

        // Internal use only. This flattens the DCPType structure to provide a simplified object model.
        WcsCapabilities.assemble100DCPType = function (element) {
            var children = element.children || element.childNodes, dcptype = {}, httpChild, method, onlineResource, url;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "DCPType") {
                    // Traverse the DCPType element to determine the GET/POST urls
                    httpChild = child.children || child.childNodes;
                    httpChild = httpChild[0];
                    method = httpChild.children || httpChild.childNodes;
                    method = method[0];
                    onlineResource = method.children || method.childNodes;
                    onlineResource = onlineResource[0];
                    url = onlineResource.getAttribute("xlink:href");
                    if (method.localName === "Get") {
                        dcptype.get = url;
                    } else if (method.localName === "Post") {
                        dcptype.post = url;
                    }
                }
            }

            return dcptype;
        };

        WcsCapabilities.assembleServiceMetadata = function (element) {
            var children = element.children || element.childNodes, serviceMetadata = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "formatSupported") {
                    serviceMetadata.formatsSupported = serviceMetadata.formatsSupported || [];
                    serviceMetadata.formatsSupported.push(child.textContent);
                } else if (child.localName === "Extension") {
                    serviceMetadata.extension = WcsCapabilities.assembleServiceMetadataExtension(child);
                }
            }

            return serviceMetadata;
        };

        WcsCapabilities.assembleServiceMetadataExtension = function (element) {
            var children = element.children || element.childNodes, len = children.length, extension = {};
            for (var c = 0; c < len; c++) {
                var child = children[c];

                if (child.localName === "crsSupported") {
                    extension.crsSupported = extension.crsSupported || [];
                    extension.crsSupported.push(child.textContent);
                } else if (child.localName === "interpolationSupported") {
                    extension.interpolationSupported = extension.interpolationSupported || [];
                    extension.interpolationSupported.push(child.textContent);
                }
            }

            return extension;
        };

        return WcsCapabilities;
    });
