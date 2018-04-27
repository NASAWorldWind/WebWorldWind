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
    'test/CustomMatchers.test',
    'src/geom/Sector',
    'src/ogc/wcs/WcsCoverage'
], function (
    CustomMatchers,
    Sector,
    WcsCoverage) {
    "use strict";

    beforeEach(function () {
        jasmine.addMatchers(CustomMatchers);
    });

    describe("WcsCoverage", function () {

        describe("Number of levels calculation", function () {

            it("should calculate the appropriate number of levels", function () {

                var levels = WcsCoverage.calculateNumberOfLevels(0.0003433227539);

                expect(levels).toBe(11);
            });
        });

        describe("Elevation Config", function () {
            WcsCoverage.prototype.findPreferredFormat = function () {
                return "image/tiff";
            };

            it ("should generate a elevation config", function () {
                var resolution = 0.0003433227539;
                var mockSector = new Sector(25, 50, -120, -90);
                var mockWebCoverageService = {
                    coverageDescriptions: {
                        getSector: function (name) {
                            return mockSector;
                        },
                        getResolution: function (name) {
                            return resolution;
                        }
                    }
                };
                var wcsCoverage = new WcsCoverage("id", mockWebCoverageService);
                var elevationConfig = wcsCoverage.elevationConfiguration;

                expect(elevationConfig.cachePath).toBe("id");
                expect(elevationConfig.coverageSector).toBeSector(mockSector);
                expect(elevationConfig.resolution).toBe(resolution);
                expect(elevationConfig.retrievalImageFormat).toBe("image/tiff");
                expect(elevationConfig.numLevels).toBe(11);
            });
        });
    });
});
