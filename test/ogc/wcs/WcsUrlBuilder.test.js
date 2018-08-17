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
    'src/util/LevelSet',
    'src/util/Promise',
    'src/geom/Sector',
    'src/util/Tile',
    'src/ogc/wcs/WcsCapabilities',
    'src/ogc/wcs/WcsUrlBuilder',
    'src/ogc/wcs/WebCoverageService'
], function (LevelSet,
             Promise,
             Sector,
             Tile,
             WcsCapabilities,
             WcsUrlBuilder,
             WebCoverageService) {
    "use strict";

    describe("1.0.0 WCS Url Builder", function () {

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

        it ("should generate the appropriate url GetCoverage request", function () {
            //sector, levelZeroDelta, numLevels, tileWidth, tileHeight
            var mockLevelSet = new LevelSet(Sector.FULL_SPHERE, 90, 5, 256, 256);
            var mockSector = new Sector(22.5, 45, -90, -67.5);
            var mockTile = new Tile(mockSector, mockLevelSet.level(1), 3, 5);
            var coverage = webCoverageService.coverages[1];
            var expectedUrl = encodeURI("http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=" +
                "1.0.0&COVERAGE=testing:pacificnw_usgs_ned_10m&CRS=EPSG:4326&WIDTH=256&HEIGHT=256&FORMAT=GeoTIFF&" +
                "BBOX=" + mockSector.minLongitude + "," + mockSector.minLatitude + "," + mockSector.maxLongitude +
                 "," + mockSector.maxLatitude);
            var wcsUrlBuilder = new WcsUrlBuilder(coverage.coverageId, webCoverageService);

            var coverageUrl = wcsUrlBuilder.urlForTile(mockTile, "GeoTIFF");

            expect(coverageUrl).toBe(expectedUrl);
        });
    });

    describe("2.0.1 WCS Url Builder", function () {

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

        it ("should generate the appropriate url GetCoverage request", function () {
            //sector, levelZeroDelta, numLevels, tileWidth, tileHeight
            var mockLevelSet = new LevelSet(Sector.FULL_SPHERE, 90, 5, 256, 256);
            var mockSector = new Sector(22.5, 45, -90, -67.5);
            var mockTile = new Tile(mockSector, mockLevelSet.level(1), 3, 5);
            var coverage = webCoverageService.coverages[1];
            var expectedUrl = encodeURI("http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=" +
                "2.0.1&COVERAGEID=testing__pacificnw_usgs_ned_10m&FORMAT=image/tiff&SCALESIZE=i(256),j(256)" +
                "&OVERVIEWPOLICY=NEAREST&SUBSET=Lat(" + mockSector.minLatitude + "," + mockSector.maxLatitude + ")" +
                "&SUBSET=Long(" + mockSector.minLongitude + "," + mockSector.maxLongitude + ")");

            var wcsUrlBuilder = new WcsUrlBuilder(coverage.coverageId, webCoverageService);

            var coverageUrl = wcsUrlBuilder.urlForTile(mockTile, "image/tiff");

            expect(coverageUrl).toBe(expectedUrl);
        });
    });
});
