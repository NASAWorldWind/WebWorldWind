/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
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

        describe("Elevation Config", function () {
            WcsCoverage.prototype.determineFormatFromService = function () {
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
                var elevationConfig = wcsCoverage.elevationConfig;

                expect(elevationConfig.coverageSector).toBeSector(mockSector);
                expect(elevationConfig.resolution).toBe(resolution);
                expect(elevationConfig.retrievalImageFormat).toBe("image/tiff");
            });
        });
    });
});
