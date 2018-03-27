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
         * @alias WcsCapabilities
         * @constructor
         * @classdesc Represents the common properties of a WCS Capabilities document. Common properties are parsed and
         * mapped to a plain javascript object model. Most fields can be accessed as properties named according to their
         * document names converted to camel case. This model supports version 1.0.0 and 2.0.1 of the WCS specification.
         * Not all properties are mapped to this representative javascript object model.
         */
        var WcsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCapabilities", "constructor", "missingXmlDom"));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
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
            } else if (this.version === "2.0.1") {
                this.assembleVersion200Document(root);
            } else {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCapabilities", "assembleDocument", "unsupportedWcsVersion"));
            }
        };

        WcsCapabilities.prototype.assembleVersion100Document = function (root) {
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Service") {
                    this.service = this.assemble100Service(child);
                } else if (child.localName === "Capability") {
                    this.capability = this.assemble100Capability(child);
                } else if (child.localName === "ContentMetadata") {
                    this.assemble100Contents(child);
                }
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
                    this.serviceMetadata = this.assembleServiceMetadata(child);
                } else if (child.localName === "Contents") {
                    this.assemble201Contents(child);
                }
            }
        };

        WcsCapabilities.prototype.assemble100Contents = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageOfferingBrief") {
                    this.coverages = this.coverages || [];
                    this.coverages.push(this.assemble100Coverages(child));
                }
            }
        };

        WcsCapabilities.prototype.assemble201Contents = function (element) {
            var children = element.children || element.childNodes, coverage;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageSummary") {
                    coverage = new OwsDatasetSummary(child);
                    this.assembleDataset201Augment(child, coverage);
                    this.coverages = this.coverages || [];
                    this.coverages.push(coverage);
                }
            }
        };

        WcsCapabilities.prototype.assembleDataset201Augment = function (element, coverage) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageId") {
                    coverage.coverageId = child.textContent;
                } else if (child.localName === "CoverageSubtype") {
                    coverage.subType = coverage.subType || [];
                    coverage.subType.push(child.textContent);
                }
            }
        };

        WcsCapabilities.prototype.assemble100Coverages = function (element) {
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
                    coverage.wgs84BoundingBox = this.assembleLatLonBoundingBox(child);
                }
            }

            return coverage;
        };

        WcsCapabilities.prototype.assemble100Service = function (element) {
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

        WcsCapabilities.prototype.assemble100Capability = function (element) {
            var children = element.children || element.childNodes, capability = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Request") {
                    capability.request = this.assemble100RequestCapabilities(child);
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

        WcsCapabilities.prototype.assemble100RequestCapabilities = function (element) {
            var children = element.children || element.childNodes, request = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "GetCapabilities") {
                    request.getCapabilities = this.assemble100DCPType(child);
                } else if (child.localName === "DescribeCoverage") {
                    request.describeCoverage = this.assemble100DCPType(child);
                } else if (child.localName === "GetCoverage") {
                    request.getCoverage = this.assemble100DCPType(child);
                }
            }

            return request;
        };

        // Internal use only. This flattens the DCPType structure to provide a simplified object model.
        WcsCapabilities.prototype.assemble100DCPType = function (element) {
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

        WcsCapabilities.prototype.assembleLatLonBoundingBox = function (element) {
            var children = element.children || element.childNodes, boundingBox = {}, previousValue, lonOne, lonTwo;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "pos") {
                    if (!previousValue) {
                        previousValue = child.textContent;
                        lonOne = parseFloat(previousValue.split(/\s+/)[0]);
                    } else {
                        lonTwo = parseFloat(child.textContent.split(/\s+/)[0]);
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

        WcsCapabilities.prototype.assembleServiceMetadata = function (element) {
            var children = element.children || element.childNodes, serviceMetadata = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "formatSupported") {
                    serviceMetadata.formatsSupported = serviceMetadata.formatsSupported || [];
                    serviceMetadata.formatsSupported.push(child.textContent);
                } else if (child.localName === "Extension") {
                    serviceMetadata.extension = this.assembleServiceMetadataExtension(child);
                }
            }

            return serviceMetadata;
        };

        WcsCapabilities.prototype.assembleServiceMetadataExtension = function (element) {
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
