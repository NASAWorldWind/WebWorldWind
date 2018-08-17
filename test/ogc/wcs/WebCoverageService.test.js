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
    'src/util/Promise',
    'src/ogc/wcs/WcsCapabilities',
    'src/ogc/wcs/WebCoverageService'
], function (Promise,
             WcsCapabilities,
             WebCoverageService) {
    "use strict";

    describe("1.0.0 WebCoverageService", function () {

        var webCoverageService;

        beforeAll(function (done) {

            WebCoverageService.prototype.retrieveCapabilities = function () {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "../base/test/ogc/wcs/wcs100GetCapabilities.xml", true);
                    xhr.addEventListener('load', function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                resolve(new WcsCapabilities(xhr.responseXML));
                            } else {
                                reject("failure");
                            }
                        }
                    });
                    xhr.send(null);
                });
            };

            WebCoverageService.prototype.retrieveCoverageDescriptions = function () {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "../base/test/ogc/wcs/wcs100DescribeCoverage.xml", true);
                    xhr.addEventListener('load', function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                resolve(xhr.responseXML);
                            } else {
                                reject("failure");
                            }
                        }
                    });
                    xhr.send(null);
                });
            };

            WebCoverageService.create("not real")
                .then(function (wcs) {
                    webCoverageService = wcs;
                    done();
                })
                .catch(function (e) {
                    fail(e);
                });
        });

        it ("should have 2 coverages defined", function () {
            var coverageCount = webCoverageService.coverages.length;

            expect(coverageCount).toBe(2);
        });
    });

    describe("2.0.1 WebCoverageService", function () {

        var webCoverageService;

        beforeAll(function (done) {

            WebCoverageService.prototype.retrieveCapabilities = function () {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "../base/test/ogc/wcs/wcs201GetCapabilities.xml", true);
                    xhr.addEventListener('load', function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                resolve(new WcsCapabilities(xhr.responseXML));
                            } else {
                                reject("failure");
                            }
                        }
                    });
                    xhr.send(null);
                });
            };

            WebCoverageService.prototype.retrieveCoverageDescriptions = function () {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "../base/test/ogc/wcs/wcs201DescribeCoverage.xml", true);
                    xhr.addEventListener('load', function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                resolve(xhr.responseXML);
                            } else {
                                reject("failure");
                            }
                        }
                    });
                    xhr.send(null);
                });
            };

            WebCoverageService.create("not real")
                .then(function (wcs) {
                    webCoverageService = wcs;
                    done();
                })
                .catch(function (e) {
                    fail(e);
                });
        });

        it ("should have 2 coverages defined", function () {
            var coverageCount = webCoverageService.coverages.length;

            expect(coverageCount).toBe(2);
        });
    });
});
