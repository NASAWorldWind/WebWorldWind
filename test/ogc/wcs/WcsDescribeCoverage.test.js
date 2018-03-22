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
    'src/error/ArgumentError',
    'src/ogc/wcs/WcsDescribeCoverage'
], function (ArgumentError,
             WcsDescribeCoverage) {
    "use strict";

    describe("Constructor testing", function () {

        it("should throw an exception when nothing is provided as an argument", function () {
            expect((function () {new WcsDescribeCoverage(null)})).toThrow();
        });
    });

    describe("WSC 1.0.0 Describe Coverage", function () {
        var xmlDom;

        beforeEach(function (done) {

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

        it("should match the coverage id testing:gebco", function () {
            var wcsDescribeCoverage = new WcsDescribeCoverage(xmlDom);

            var name = wcsDescribeCoverage.coverages[0].name;

            expect(name).toBe("testing:gebco");
        });
    });

    describe("WSC 2.0.1 Describe Coverage", function () {
        var xmlDom;

        beforeEach(function (done) {

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

        it("should match the coverage id testing__gebco", function () {
            var wcsDescribeCoverage = new WcsDescribeCoverage(xmlDom);

            var name = wcsDescribeCoverage.coverages[0].coverageId;

            expect(name).toBe("testing__gebco");
        });

        describe("Domain Set", function () {

            it("should have the correct gml:id of grid00__testing__gebco", function () {
                var wcsDescribeCoverage = new WcsDescribeCoverage(xmlDom);

                var gmlDomainSetId = wcsDescribeCoverage.coverages[0].domainSet.rectifiedGrid.id;

                expect(gmlDomainSetId).toBe("grid00__testing__gebco");
            });

            it("should have the correct axis labels of i and j", function () {
                var wcsDescribeCoverage = new WcsDescribeCoverage(xmlDom);

                var axisLabels = wcsDescribeCoverage.coverages[0].domainSet.rectifiedGrid.axisLabels;

                expect(axisLabels[0]).toBe("i");
                expect(axisLabels[1]).toBe("j");
            });

            it("should have an origin of 89.99583333333334 -179.99583333333334", function() {
                var wcsDescribeCoverage = new WcsDescribeCoverage(xmlDom);

                var pos = wcsDescribeCoverage.coverages[0].domainSet.rectifiedGrid.origin.point.pos.pos;

                expect(pos[0]).toBeCloseTo(89.99583333333334, 0.000001);
                expect(pos[1]).toBeCloseTo(-179.99583333333334, 0.000001);
            });

            it("should have a low grid envelope of 0, 0", function () {
                var wcsDescribeCoverage = new WcsDescribeCoverage(xmlDom);

                var lowEnvelope = wcsDescribeCoverage.coverages[0].domainSet.rectifiedGrid.limits.low;

                expect(lowEnvelope[0]).toBe("0");
                expect(lowEnvelope[1]).toBe("0");
            });

            it("should have a high grid envelope of 43199, 21599", function () {
                var wcsDescribeCoverage = new WcsDescribeCoverage(xmlDom);

                var highEnvelope = wcsDescribeCoverage.coverages[0].domainSet.rectifiedGrid.limits.high;

                expect(highEnvelope[0]).toBe("43199");
                expect(highEnvelope[1]).toBe("21599");
            });
        });
    });
});
