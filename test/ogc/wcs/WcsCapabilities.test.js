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
define([
    'src/ogc/wcs/WcsCapabilities'
], function (WcsCapabilities) {
    "use strict";

    describe("WCS 2.0.1 Capabilities Parsing", function () {
        var xmlDom;

        beforeEach(function (done) {

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

        it("Should provide a coverageId of test:pacificnw_usgs_ned_10m", function () {

            var wcs = new WcsCapabilities(xmlDom);

            expect(wcs.coverages[0].coverageId).toBe("test__pacificnw_usgs_ned_10m");
        });

        it("Should have a 2.0.1 version", function() {

            var wcs = new WcsCapabilities(xmlDom);

            expect(wcs.version).toBe("2.0.1");
        });

        it("Should have a update sequence of 5", function () {

            var wcs = new WcsCapabilities(xmlDom);

            expect(wcs.updateSequence).toBe("5");
        });

        it("Should have scaling extension detailed in the profile", function () {

            var wcs = new WcsCapabilities(xmlDom);

            expect(wcs.serviceIdentification.profile[8])
                .toBe("http://www.opengis.net/spec/WCS_service-extension_scaling/1.0/conf/scaling");
        });

        it("Should have a GET GetCoverage link defined", function () {

            var wcs = new WcsCapabilities(xmlDom);
            var url = wcs.operationsMetadata.getOperationMetadataByName("GetCoverage").dcp[0].getMethods[0].url;

            expect(url).toBe("http://localhost:8080/geoserver/wcs?");
        });

        // Service Metadata
        it("should have seven supported formats", function () {
            var wcs = new WcsCapabilities(xmlDom);
            var formatsSupported = wcs.serviceMetadata.formatsSupported.length;

            expect(formatsSupported).toBe(7);
        });

        it("should suport image/tiff as the sixth format", function () {
            var wcs = new WcsCapabilities(xmlDom);
            var imageTiffFormat = wcs.serviceMetadata.formatsSupported[5];

            expect(imageTiffFormat).toBe("image/tiff");
        });

        it("should include 5841 supported crs", function () {
            var wcs = new WcsCapabilities(xmlDom);
            var supportedCrsCount = wcs.serviceMetadata.extension.crsSupported.length;

            expect(supportedCrsCount).toBe(5841);
        });

        it("should include three supported interpolation methods", function () {
            var wcs = new WcsCapabilities(xmlDom);
            var supportedInterpolationMethods = wcs.serviceMetadata.extension.interpolationSupported.length;

            expect(supportedInterpolationMethods).toBe(3);
        });
    });

    describe("WCS 1.0.0 Capabilities Parsing", function () {
        var xmlDom;

        beforeEach(function (done) {

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

        it("Should have a 1.0.0 version", function() {

            var wcs = new WcsCapabilities(xmlDom);

            expect(wcs.version).toBe("1.0.0");
        });

        it("Should have a update sequence of 5", function () {

            var wcs = new WcsCapabilities(xmlDom);

            expect(wcs.updateSequence).toBe("5");
        });

        describe("Coverages", function () {

            it("Should provide a coverageId of test:pacificnw_usgs_ned_10m", function () {

                var wcs = new WcsCapabilities(xmlDom);

                expect(wcs.coverages[0].coverageId).toBe("test:pacificnw_usgs_ned_10m");
            });

            it("Should have a bounding box with the correct order", function () {

                var wcs = new WcsCapabilities(xmlDom);

                // determine the lowest longitude value and ensure that coordinate is specified first in the bounding box
                var lowerValue = new Number(wcs.coverages[0].wgs84BoundingBox.lowerCorner.split(/\s+/)[0]);
                var upperValue = new Number(wcs.coverages[0].wgs84BoundingBox.upperCorner.split(/\s+/)[0]);

                expect(lowerValue).toBeLessThan(upperValue);

            });
        });

        describe("Service", function () {

            it("should have the wcs name", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var name = wcs.service.name;

                expect(name).toBe("WCS");
            });

            it("should have NONE fees", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var fees = wcs.service.fees;

                expect(fees).toBe("NONE");
            });

            it("should have NONE accessConstraints", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var accessContraints = wcs.service.accessConstraints[0];

                expect(accessContraints).toBe("NONE");
            });
        });

        describe("Capability", function () {

            it("should have a get capabilities GET url of http://localhost:8080/geoserver/wcs?", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var getCapabilitiesUrl = wcs.capability.request.getCapabilities.get;

                expect(getCapabilitiesUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a get capabilities POST url of http://localhost:8080/geoserver/wcs?", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var getCapabilitiesUrl = wcs.capability.request.getCapabilities.post;

                expect(getCapabilitiesUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a describe coverage GET url of http://localhost:8080/geoserver/wcs?", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var describeCoverageUrl = wcs.capability.request.describeCoverage.get;

                expect(describeCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a describe coverage POST url of http://localhost:8080/geoserver/wcs?", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var describeCoverageUrl = wcs.capability.request.describeCoverage.post;

                expect(describeCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a get coverage GET url of http://localhost:8080/geoserver/wcs?", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var getCoverageUrl = wcs.capability.request.getCoverage.get;

                expect(getCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });

            it("should have a get coverage POST url of http://localhost:8080/geoserver/wcs?", function () {
                var wcs = new WcsCapabilities(xmlDom);

                var getCoverageUrl = wcs.capability.request.getCoverage.post;

                expect(getCoverageUrl).toBe("http://localhost:8080/geoserver/wcs?");
            });
        });
    });
});
