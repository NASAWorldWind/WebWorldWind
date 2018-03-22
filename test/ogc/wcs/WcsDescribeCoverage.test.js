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
    });
});
