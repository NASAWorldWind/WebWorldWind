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
    'src/ogc/wcs/WcsCapabilities'
], function (WcsCapabilities) {
    "use strict";

    describe("Constructor testing", function () {

        it("should throw an exception when nothing is provided as an argument", function () {
            expect((function () {
                new WcsCapabilities(null)
            })).toThrow();
        });
    });

    describe("WCS 2.0.1 Capabilities Parsing", function () {

        var xmlDom;

        beforeAll(function (done) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wcs/wcs201GetCapabilities.xml", true);
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

        it("should have a 2.0.1 version", function () {
            var wcsCaps = new WcsCapabilities(xmlDom);

            var version = wcsCaps.version;

            expect(version).toBe("2.0.1");
        });

        it("should have a update sequence of 5", function () {
            var wcsCaps = new WcsCapabilities(xmlDom);

            var updateSequence = wcsCaps.updateSequence;

            expect(updateSequence).toBe("11");
        });

        describe("Utility Methods", function () {

            it("should provide the get coverage base url", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);
                var expectedUrl = "http://localhost:8080/geoserver/wcs?";

                var actualUrl = wcsCaps.getCoverageBaseUrl();

                expect(actualUrl).toBe(expectedUrl);
            });
        });

        describe("Service Identification", function () {

            it("should have scaling extension detailed in the profile", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var scalingExtension = wcsCaps.serviceIdentification.profile[8];

                expect(scalingExtension)
                    .toBe("http://www.opengis.net/spec/WCS_service-extension_scaling/1.0/conf/scaling");
            });
        });

        describe("Operations Metadata", function () {

            it("should have a GET GetCoverage link defined", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var url = wcsCaps.operationsMetadata.getOperationMetadataByName("GetCoverage").dcp[0].getMethods[0].url;

                expect(url).toBe("http://localhost:8080/geoserver/wcs?");
            });
        });

        describe("Service Metadata", function () {

            it("should have seven supported formats", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var formatsSupported = wcsCaps.serviceMetadata.formatsSupported.length;

                expect(formatsSupported).toBe(7);
            });

            it("should suport image/tiff as the sixth format", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var imageTiffFormat = wcsCaps.serviceMetadata.formatsSupported[5];

                expect(imageTiffFormat).toBe("image/tiff");
            });

            it("should include 5841 supported crs", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var supportedCrsCount = wcsCaps.serviceMetadata.extension.crsSupported.length;

                expect(supportedCrsCount).toBe(5841);
            });

            it("should include three supported interpolation methods", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var supportedInterpolationMethods = wcsCaps.serviceMetadata.extension.interpolationSupported.length;

                expect(supportedInterpolationMethods).toBe(3);
            });
        });

        describe("Contents", function () {

            it("should provide a coverageId of testing__pacificnw_usgs_ned_10m", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var coverageId = wcsCaps.coverages[1].coverageId;

                expect(coverageId).toBe("testing__pacificnw_usgs_ned_10m");
            });
        });
    });

    describe("WCS 1.0.0 Capabilities Parsing", function () {
        var xmlDom;

        beforeAll(function (done) {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wcs/wcs100GetCapabilities.xml", true);
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

        it("should have a 1.0.0 version", function () {
            var wcsCaps = new WcsCapabilities(xmlDom);

            var version = wcsCaps.version;

            expect(version).toBe("1.0.0");
        });

        it("should have a update sequence of 5", function () {
            var wcsCaps = new WcsCapabilities(xmlDom);

            var updateSequence = wcsCaps.updateSequence;

            expect(updateSequence).toBe("11");
        });

        describe("Utility Methods", function () {

            it("should provide the get coverage base url", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);
                var expectedUrl = "http://localhost:8080/geoserver/wcs?";

                var actualUrl = wcsCaps.getCoverageBaseUrl();

                expect(actualUrl).toBe(expectedUrl);
            });
        });

        describe("Coverages", function () {

            it("should provide a name of testing:pacificnw_usgs_ned_10m", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var name = wcsCaps.coverages[1].name;

                expect(name).toBe("testing:pacificnw_usgs_ned_10m");
            });

            it("should have a bounding box with the correct order", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                // determine the lowest longitude value and ensure that coordinate is specified first in the bounding box
                var lowerValue = parseFloat(wcsCaps.coverages[0].wgs84BoundingBox.lowerCorner.split(/\s+/)[0]);
                var upperValue = parseFloat(wcsCaps.coverages[0].wgs84BoundingBox.upperCorner.split(/\s+/)[0]);

                expect(lowerValue).toBeLessThan(upperValue);
            });
        });

        describe("Service", function () {

            it("should have the wcs name", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var name = wcsCaps.service.name;

                expect(name).toBe("WCS");
            });

            it("should have NONE fees", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var fees = wcsCaps.service.fees;

                expect(fees).toBe("NONE");
            });

            it("should have NONE accessConstraints", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var accessContraints = wcsCaps.service.accessConstraints[0];

                expect(accessContraints).toBe("NONE");
            });
        });

        describe("Capability", function () {

            it("should have a get capabilities GET url of http://localhost:8080/geoserver/wcs?", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var getCapabilitiesUrl = wcsCaps.capability.request.getCapabilities.get;

                expect(getCapabilitiesUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a get capabilities POST url of http://localhost:8080/geoserver/wcs?", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var getCapabilitiesUrl = wcsCaps.capability.request.getCapabilities.post;

                expect(getCapabilitiesUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a describe coverage GET url of http://localhost:8080/geoserver/wcs?", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var describeCoverageUrl = wcsCaps.capability.request.describeCoverage.get;

                expect(describeCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a describe coverage POST url of http://localhost:8080/geoserver/wcs?", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var describeCoverageUrl = wcsCaps.capability.request.describeCoverage.post;

                expect(describeCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a get coverage GET url of http://localhost:8080/geoserver/wcs?", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var getCoverageUrl = wcsCaps.capability.request.getCoverage.get;

                expect(getCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a get coverage POST url of http://localhost:8080/geoserver/wcs?", function () {
                var wcsCaps = new WcsCapabilities(xmlDom);

                var getCoverageUrl = wcsCaps.capability.request.getCoverage.post;

                expect(getCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });
        });
    });
});
