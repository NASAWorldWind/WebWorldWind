/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
define([
    'src/ogc/wcs/WcsCoverageDescriptions',
    'src/geom/Sector',
    'test/CustomMatchers.test'
], function (WcsCoverageDescriptions,
             Sector,
             CustomMatchers) {
    "use strict";

    beforeEach(function () {
        jasmine.addMatchers(CustomMatchers);
    });

    describe("Constructor testing", function () {

        it("should throw an exception when nothing is provided as an argument", function () {
            expect((function () {new WcsCoverageDescriptions(null)})).toThrow();
        });
    });

    describe("WSC 1.0.0 Describe Coverage", function () {
        var xmlDom;

        beforeAll(function (done) {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wcs/wcs100DescribeCoverage.xml", true);
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        xmlDom = xhr.responseXML;
                        done();
                    } else {
                        done("Test WCS Capabilities Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        describe("Utility Methods", function () {

            it("should match the expected bounding sector", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
                var expectedSector = new Sector(-90, 90, -180, 180);

                var actualSector = wcsCoverageDescriptions.getSector("testing:gebco");

                expect(actualSector).toBeSector(expectedSector, 1.0e-9);
            });

            it("should report a resolution of 0.008334 degrees", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
                var expectedResolution = 0.0083337;

                var actualResolution = wcsCoverageDescriptions.getResolution("testing:gebco");

                expect(actualResolution).toBeCloseTo(expectedResolution, 6);
            });

            it("should provide the request/response crs", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
                var expectedCrs = ["EPSG:4326"];

                var supportedCrs = wcsCoverageDescriptions.getSupportedCrs("testing:gebco");

                expect(supportedCrs.length).toBe(expectedCrs.length);
                expect(supportedCrs[0]).toBe(expectedCrs[0]);
            });
        });

        it("should match the coverage name testing:gebco", function () {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

            var name = wcsCoverageDescriptions.coverages[0].name;

            expect(name).toBe("testing:gebco");
        });

        it("should match the coverage label gebco", function () {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

            var label = wcsCoverageDescriptions.coverages[0].label;

            expect(label).toBe("gebco");
        });

        it("should match the coverage description Generated from GeoTIFF", function () {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

            var description = wcsCoverageDescriptions.coverages[0].description;

            expect(description).toBe("Generated from GeoTIFF");
        });

        it("should have the keywords gebco, WCS, GeoTIFF", function() {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

            var keywords = wcsCoverageDescriptions.coverages[0].keywords;

            expect(keywords[0].value).toBe("gebco");
            expect(keywords[1].value).toBe("WCS");
            expect(keywords[2].value).toBe("GeoTIFF");
        });

        it("should have a lonLatEnvelope srs of CRS84", function () {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

            var lonLatEnvelopSrs = wcsCoverageDescriptions.coverages[0].lonLatEnvelope.srsName;

            expect(lonLatEnvelopSrs).toBe("urn:ogc:def:crs:OGC:1.3:CRS84");
        });

        it("should have lonLatEnvelop positions spanning the globe", function () {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
            var error = 1e-9;

            var lonLatEnvelop = wcsCoverageDescriptions.coverages[0].lonLatEnvelope;

            expect(lonLatEnvelop.pos[0][0]).toBeCloseTo(-180.0, error);
            expect(lonLatEnvelop.pos[0][1]).toBeCloseTo(-90.0, error);
            expect(lonLatEnvelop.pos[1][0]).toBeCloseTo(180.0, error);
            expect(lonLatEnvelop.pos[1][1]).toBeCloseTo(90.0, error);
        });

        it("should show support for the EPSG:4326 CRS", function () {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

            var supportedRequestCrs = wcsCoverageDescriptions.coverages[0].supportedCrs.requests[0];
            var supportedResponseCrs = wcsCoverageDescriptions.coverages[0].supportedCrs.responses[0];

            expect(supportedRequestCrs).toBe("EPSG:4326");
            expect(supportedResponseCrs).toBe("EPSG:4326");
        });

        describe("Supported Formats", function () {

            it("should have 12 supported formats", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var supportedFormatsCount = wcsCoverageDescriptions.coverages[0].supportedFormats.formats.length;

                expect(supportedFormatsCount).toBe(12);
            });

            it("should show a native format of GeoTIFF", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var nativeFormat = wcsCoverageDescriptions.coverages[0].supportedFormats.nativeFormat;

                expect(nativeFormat).toBe("GeoTIFF");
            });

            it("should have support for GeoPackage (tiles)", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var formatSupported = wcsCoverageDescriptions.coverages[0].supportedFormats.formats[3];

                expect(formatSupported).toBe("GeoPackage (tiles)");
            });
        });
        
        describe("Supported Interpolations", function () {
            
            it("should have three supported interpolation methods", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var numberOfSupportedInterpolationMethods = wcsCoverageDescriptions.coverages[0].supportedInterpolations.methods.length;

                expect(numberOfSupportedInterpolationMethods).toBe(3);
            });

            it("should show a default nearest neighbor interpolation method", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var defaultInterpolation = wcsCoverageDescriptions.coverages[0].supportedInterpolations.default;

                expect(defaultInterpolation).toBe("nearest neighbor");
            });

            it("should support bilinear interpolation", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var bilinearInterpolationMethod = wcsCoverageDescriptions.coverages[0].supportedInterpolations.methods[1];

                expect(bilinearInterpolationMethod).toBe("bilinear");
            });
        });

        describe("Spatial Domain Set", function () {

            it("Should have an envelope with an EPSG:4326 srs name", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var envelopSrsName = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.envelope.srsName;

                expect(envelopSrsName).toBe("EPSG:4326");
            });

            it("Should have an envelope which spans the entire globe", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
                var error = 1e-9;

                var domainEnvelope = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.envelope.pos;

                expect(domainEnvelope[0][0]).toBeCloseTo(-180.0, error);
                expect(domainEnvelope[0][1]).toBeCloseTo(-90.0, error);
                expect(domainEnvelope[1][0]).toBeCloseTo(180.0, error);
                expect(domainEnvelope[1][1]).toBeCloseTo(90.0, error);
            });

            it("should have the correct axis names of x and y", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var axisNames = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.rectifiedGrid.axisNames;

                expect(axisNames[0]).toBe("x");
                expect(axisNames[1]).toBe("y");
            });

            it("should have an origin of -179.99583333333334 89.99583333333334", function() {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var pos = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.rectifiedGrid.origin.pos.pos;

                expect(pos[0]).toBeCloseTo(-179.99583333333334, 0.000001);
                expect(pos[1]).toBeCloseTo(89.99583333333334, 0.000001);
            });

            it("should have a low grid envelope of 0, 0", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var lowEnvelope = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.rectifiedGrid.limits.low;

                expect(lowEnvelope[0]).toBe("0");
                expect(lowEnvelope[1]).toBe("0");
            });

            it("should have a high grid envelope of 43199, 21599", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var highEnvelope = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.rectifiedGrid.limits.high;

                expect(highEnvelope[0]).toBe("43199");
                expect(highEnvelope[1]).toBe("21599");
            });

            it("should have offset vector values of 0.0 0.008333333333333333 for the first offset", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var values = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.rectifiedGrid.offsetVector[0].values;

                expect(values[0]).toBeCloseTo(0, 0.000001);
                expect(values[1]).toBeCloseTo(0.008333333333333333, 0.0000001);
            });

            it("should have offset vector values of -0.008333333333333333 0.0 for the second offset", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var values = wcsCoverageDescriptions.coverages[0].domainSet.spatialDomain.rectifiedGrid.offsetVector[1].values;

                expect(values[0]).toBeCloseTo(-0.008333333333333333, 0.0000001);
                expect(values[1]).toBeCloseTo(0, 0.000001);
            });
        });

        describe("Range Set", function () {

            it("should have a range set name gebco", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var rangeSetName = wcsCoverageDescriptions.coverages[0].rangeSet.name;

                expect(rangeSetName).toBe("gebco");
            });

            it ("should have a range set label gebco", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var rangeSetLabel = wcsCoverageDescriptions.coverages[0].rangeSet.label;

                expect(rangeSetLabel).toBe("gebco");
            });

            it("should have a range set axis description name: Band", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var rangeSetAxisName = wcsCoverageDescriptions.coverages[0].rangeSet.axisDescriptions[0].name;

                expect(rangeSetAxisName).toBe("Band");
            });

            it("should have a range set axis description label: Band", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var rangeSetAxisLabel = wcsCoverageDescriptions.coverages[0].rangeSet.axisDescriptions[0].label;

                expect(rangeSetAxisLabel).toBe("Band");
            });
        });
    });

    describe("WSC 2.0.1 Describe Coverage", function () {
        var xmlDom;

        beforeAll(function (done) {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wcs/wcs201DescribeCoverage.xml", true);
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        xmlDom = xhr.responseXML;
                        done();
                    } else {
                        done("Test WCS Capabilities Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        describe("Utility Methods", function () {

            it("should match the expected bounding sector", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
                var expectedSector = new Sector(-90, 90, -180, 180);

                var actualSector = wcsCoverageDescriptions.getSector("testing__gebco");

                expect(actualSector).toBeSector(expectedSector, 1.0e-9);
            });

            it("should report a resolution of 0.008334 degrees", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
                var expectedResolution = 0.0083337;

                var actualResolution = wcsCoverageDescriptions.getResolution("testing__gebco");

                expect(actualResolution).toBeCloseTo(expectedResolution, 6);
            });

            it("should provide the request/response crs", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);
                var expectedCrs = ["http://www.opengis.net/def/crs/EPSG/0/4326"];

                var supportedCrs = wcsCoverageDescriptions.getSupportedCrs("testing__gebco");

                expect(supportedCrs.length).toBe(expectedCrs.length);
                expect(supportedCrs[0]).toBe(expectedCrs[0]);
            });
        });

        it("should match the coverage id testing__gebco", function () {
            var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

            var name = wcsCoverageDescriptions.coverages[0].coverageId;

            expect(name).toBe("testing__gebco");
        });

        describe("Domain Set", function () {

            it("should have the correct gml:id of grid00__testing__gebco", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var gmlDomainSetId = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.id;

                expect(gmlDomainSetId).toBe("grid00__testing__gebco");
            });

            it("should have the correct axis labels of i and j", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var axisLabels = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.axisLabels;

                expect(axisLabels[0]).toBe("i");
                expect(axisLabels[1]).toBe("j");
            });

            it("should have an origin of 89.99583333333334 -179.99583333333334", function() {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var pos = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.origin.point.pos.pos;

                expect(pos[0]).toBeCloseTo(89.99583333333334, 0.000001);
                expect(pos[1]).toBeCloseTo(-179.99583333333334, 0.000001);
            });

            it("should have a low grid envelope of 0, 0", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var lowEnvelope = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.limits.low;

                expect(lowEnvelope[0]).toBe("0");
                expect(lowEnvelope[1]).toBe("0");
            });

            it("should have a high grid envelope of 43199, 21599", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var highEnvelope = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.limits.high;

                expect(highEnvelope[0]).toBe("43199");
                expect(highEnvelope[1]).toBe("21599");
            });

            it("should have an offset vector srsName of 4326 for the first and second offsets", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var offsetSrsOne = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.offsetVector[0].srsName;
                var offsetSrsTwo = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.offsetVector[1].srsName;

                expect(offsetSrsOne).toBe("http://www.opengis.net/def/crs/EPSG/0/4326");
                expect(offsetSrsTwo).toBe("http://www.opengis.net/def/crs/EPSG/0/4326");
            });

            it("should have offset vector values of 0.0 0.008333333333333333 for the first offset", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var values = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.offsetVector[0].values;

                expect(values[0]).toBeCloseTo(0, 0.000001);
                expect(values[1]).toBeCloseTo(0.008333333333333333, 0.0000001);
            });

            it("should have offset vector values of -0.008333333333333333 0.0 for the second offset", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var values = wcsCoverageDescriptions.coverages[0].domainSet.rectifiedGrid.offsetVector[1].values;

                expect(values[0]).toBeCloseTo(-0.008333333333333333, 0.0000001);
                expect(values[1]).toBeCloseTo(0, 0.000001);
            });

        });

        describe("BoundedBy", function () {

            it("should have a bounded by envelope srs name of http://www.opengis.net/def/crs/EPSG/0/4326", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var boundedBySrsName = wcsCoverageDescriptions.coverages[0].boundedBy.envelope.srsName;

                expect(boundedBySrsName).toBe("http://www.opengis.net/def/crs/EPSG/0/4326");
            });

            it("should have a bounded by envelope axis labels of Lat and Lon", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var boundedByAxisLabels = wcsCoverageDescriptions.coverages[0].boundedBy.envelope.axisLabels;

                expect(boundedByAxisLabels[0]).toBe("Lat");
                expect(boundedByAxisLabels[1]).toBe("Long");
            });

            it("should have a bounded by envelope uom labels of Deg and Deg", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var boundedByUomLabels = wcsCoverageDescriptions.coverages[0].boundedBy.envelope.uomLabels;

                expect(boundedByUomLabels[0]).toBe("Deg");
                expect(boundedByUomLabels[1]).toBe("Deg");
            });

            it("should have a bounded by envelope srs dimension of 2", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var boundedBySrsDimension = wcsCoverageDescriptions.coverages[0].boundedBy.envelope.srsDimension;

                expect(boundedBySrsDimension).toBe(2);
            });

            it("should have a bounded by envelope lower corner of -90.0 and -180.0", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var boundedByLowerCorner = wcsCoverageDescriptions.coverages[0].boundedBy.envelope.lower;

                expect(boundedByLowerCorner[0]).toBeCloseTo(-90.0, 0.000001);
                expect(boundedByLowerCorner[1]).toBeCloseTo(-180.0, 0.000001);
            });

            it("should have a bounded by envelope upper corner of 90.0 and 180.0", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var boundedByUpperCorner = wcsCoverageDescriptions.coverages[0].boundedBy.envelope.upper;

                expect(boundedByUpperCorner[0]).toBeCloseTo(90.0, 0.000001);
                expect(boundedByUpperCorner[1]).toBeCloseTo(180.0, 0.000001);
            });
        });

        describe("Service Parameters", function () {

            it("should have a subtype of RectifiedGridCoverage", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var serviceParameterSubtype = wcsCoverageDescriptions.coverages[0].serviceParameters.coverageSubtype;

                expect(serviceParameterSubtype).toBe("RectifiedGridCoverage");
            });

            it("should have a native format of image/tiff", function () {
                var wcsCoverageDescriptions = new WcsCoverageDescriptions(xmlDom);

                var serviceParameterNativeFormat = wcsCoverageDescriptions.coverages[0].serviceParameters.nativeFormat;

                expect(serviceParameterNativeFormat).toBe("image/tiff");
            });
        });
    });
});
