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
 * @exports WcsDescribeCoverage
 */
define([
        '../../error/ArgumentError',
        '../../ogc/gml/GmlBoundedBy',
        '../../ogc/gml/GmlDomainSet',
        '../../ogc/gml/GmlRectifiedGrid',
        '../../util/Logger',
        '../../ogc/ows/OwsKeywords'
    ],
    function (ArgumentError,
              GmlBoundedBy,
              GmlDomainSet,
              GmlRectifiedGrid,
              Logger,
              OwsKeywords) {
        "use strict";

        var WcsDescribeCoverage = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsDescribeCoverage", "constructor", "missingXmlDom"));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
             */
            this.xmlDom = xmlDom;

            this.assembleDocument();
        };

        WcsDescribeCoverage.prototype.assembleDocument = function () {
            // Determine version and update sequence
            var root = this.xmlDom.documentElement;

            if (root.localName === "CoverageDescription") {
                this.assemble100Document(root);
            } else if (root.localName === "CoverageDescriptions") {
                this.assemble201Document(root);
            } else {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsCapabilities", "assembleDocument", "unsupportedWcsVersion"));
            }
        };

        WcsDescribeCoverage.prototype.assemble100Document = function (element) {
            this.version = element.getAttribute("version");

            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageOffering") {
                    this.coverages = this.coverages || [];
                    this.coverages.push(this.assemble100Coverages(child));
                }
            }
        };

        WcsDescribeCoverage.prototype.assemble201Document = function (element) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageDescription") {
                    this.coverages = this.coverages || [];
                    this.coverages.push(this.assemble201Coverages(child));
                }
            }
        };

        WcsDescribeCoverage.prototype.assemble100Coverages = function (element) {
            var children = element.children || element.childNodes, coverage = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    coverage.name = child.textContent;
                } else if (child.localName === "description") {
                    coverage.description = child.textContent;
                } else if (child.localName === "label") {
                    coverage.label = child.textContent;
                } else if (child.localName === "keywords") {
                    // the OWS keywords namespace isn't used but the format is similar
                    coverage.keywords = new OwsKeywords(child).keywords;
                } else if (child.localName === "lonLatEnvelope") {
                    coverage.lonLatEnvelope = this.assemble100LonLatEnvelope(child);
                } else if (child.localName === "supportedCRSs") {
                    coverage.supportedCrs = this.assemble100SupportedCrs(child);
                } else if (child.localName === "supportedFormats") {
                    coverage.supportedFormats = this.assemble100SupportedFormats(child);
                } else if (child.localName === "supportedInterpolations") {
                    coverage.supportedInterpolations = this.assemble100SupportedInterpolations(child);
                } else if (child.localName === "domainSet") {
                    coverage.domainSet = this.assemble100DomainSet(child);
                } else if (child.localName === "rangeSet") {
                    coverage.rangeSet = this.assemble100RangeSet(child);
                }
            }

            return coverage;
        };

        WcsDescribeCoverage.prototype.assemble201Coverages = function (element) {
            var children = element.children || element.childNodes, coverage = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "CoverageId") {
                    coverage.coverageId = child.textContent;
                } else if (child.localName === "domainSet") {
                    coverage.domainSet = new GmlDomainSet(child);
                } else if (child.localName === "boundedBy") {
                    coverage.boundedBy = new GmlBoundedBy(child);
                } else if (child.localName === "ServiceParameters") {
                    coverage.serviceParameters = this.assemble201ServiceParameters(child);
                } else if (child.localName === "rangeType") {
                    // The information from rangeType is not required for forming a request. Instead of implementing a
                    // complex parser for the SWE DataRecord, a reference to the particular dom element will be provided
                    coverage.rangeType = child;
                }
            }

            return coverage;
        };

        WcsDescribeCoverage.prototype.assemble201ServiceParameters = function (element) {
            var children = element.children || element.childNodes, serviceParameters = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "nativeFormat") {
                    serviceParameters.nativeFormat = child.textContent;
                } else if (child.localName === "CoverageSubtype") {
                    serviceParameters.coverageSubtype = child.textContent;
                }
                // TODO CoverageSubtypeParent, Extension
            }

            return serviceParameters;
        };

        WcsDescribeCoverage.prototype.assemble100LonLatEnvelope = function (element) {
            var children = element.children || element.childNodes, latLonEnvelope = {};

            latLonEnvelope.srsName = element.getAttribute("srsName");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "pos") {
                    latLonEnvelope.pos = latLonEnvelope.pos || [];
                    latLonEnvelope.pos.push(WcsDescribeCoverage.parseSpacedFloatArray(child.textContent));
                }
            }

            return latLonEnvelope;
        };

        WcsDescribeCoverage.prototype.assemble100SupportedCrs = function (element) {
            var children = element.children || element.childNodes, supportedCrs = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "requestResponseCRSs") {
                    supportedCrs.requests = supportedCrs.requests || [];
                    supportedCrs.requests.push(child.textContent);
                    supportedCrs.responses = supportedCrs.responses || [];
                    supportedCrs.responses.push(child.textContent);
                } else if (child.localName === "requestCRSs") {
                    supportedCrs.requests = supportedCrs.requests || [];
                    supportedCrs.push(child.textContent);
                } else if (child.localName === "responseCRSs") {
                    supportedCrs.responses = supportedCrs.responses || [];
                    supportedCrs.push(child.textContent);
                } else if (child.localName === "NativeCRSs") {
                    supportedCrs.nativeCrs = supportedCrs.nativeCrs || [];
                    supportedCrs.push(child.textContent);
                }
            }

            return supportedCrs;
        };

        WcsDescribeCoverage.prototype.assemble100SupportedFormats = function (element) {
            var children = element.children || element.childNodes, supportedFormats = {};

            supportedFormats.nativeFormat = element.getAttribute("nativeFormat");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "formats") {
                    supportedFormats.formats = supportedFormats.formats || [];
                    supportedFormats.formats.push(child.textContent);
                }
            }

            return supportedFormats;
        };

        WcsDescribeCoverage.prototype.assemble100SupportedInterpolations = function (element) {
            var children = element.children || element.childNodes, supportedInterpolations = {};

            supportedInterpolations.default = element.getAttribute("default");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "interpolationMethod") {
                    supportedInterpolations.methods = supportedInterpolations.methods || [];
                    supportedInterpolations.methods.push(child.textContent);
                }
            }

            return supportedInterpolations;
        };

        WcsDescribeCoverage.prototype.assemble100DomainSet = function (element) {
            var children = element.children || element.childNodes, domainSet = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "spatialDomain") {
                    domainSet.spatialDomain = this.assemble100SpatialDomain(child);
                }
            }

            return domainSet;
        };

        WcsDescribeCoverage.prototype.assemble100SpatialDomain = function (element) {
            var children = element.children || element.childNodes, spatialDomain = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Envelope") {
                    spatialDomain.envelope = this.assemble100LonLatEnvelope(child);
                } else if (child.localName === "RectifiedGrid") {
                    spatialDomain.rectifiedGrid = new GmlRectifiedGrid(child);
                }
            }

            return spatialDomain;
        };

        WcsDescribeCoverage.prototype.assemble100RangeSet = function (element) {
            var children = element.children || element.childNodes, rangeSet = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "RangeSet") {
                    // Jump into the first similarly named element
                    return this.assemble100RangeSetElement(child);
                }
            }
        };

        WcsDescribeCoverage.prototype.assemble100RangeSetElement = function (element) {
            var children = element.children || element.childNodes, rangeSet = {};

            rangeSet.semantic = element.getAttribute("semantic");
            rangeSet.refSys = element.getAttribute("refSys");
            rangeSet.refSysLable = element.getAttribute("refSysLabel");

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    rangeSet.name = child.textContent;
                } else if (child.localName === "label") {
                    rangeSet.label = child.textContent;
                } else if (child.localName === "axisDescription") {
                    rangeSet.axisDescriptions = this.assemble100RangeSetAxisDescription(child);
                }
            }

            return rangeSet;
        };

        WcsDescribeCoverage.prototype.assemble100RangeSetAxisDescription = function (element) {
            var children = element.children || element.childNodes, axisDescriptions = [];

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "AxisDescription") {
                    axisDescriptions.push(this.assemble100RangeSetAxisDescriptionElement(child));
                }
            }

            return axisDescriptions;
        };

        WcsDescribeCoverage.prototype.assemble100RangeSetAxisDescriptionElement = function (element) {
            var children = element.children || element.childNodes, axisDescription = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "name") {
                    axisDescription.name = child.textContent;
                } else if (child.localName === "label") {
                    axisDescription.label = child.textContent;
                } else if (child.localName === "values") {
                    axisDescription.values = this.assemble100RangeSetValues(child);
                }
            }

            return axisDescription;
        };

        WcsDescribeCoverage.prototype.assemble100RangeSetValues = function (element) {
            var children = element.children || element.childNodes, values = {};

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "singleValue") {
                    values.singleValue = child.textContent;
                }
                // TODO intervals value type
            }

            return values;
        };

        WcsDescribeCoverage.parseSpacedFloatArray = function (line) {
            var result = [], elements = line.split(/\s+/);

            for (var i = 0; i < elements.length; i++) {
                result.push(parseFloat(elements[i]));
            }

            return result;
        };

        return WcsDescribeCoverage;
    });
