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
    'src/globe/ElevationModel',
    'src/globe/Globe',
    'test/util/TestUtils.test'
], function (ElevationModel, Globe, TestUtils) {
    "use strict";

    var mockGlobe = new Globe(new ElevationModel());
    var wwd = TestUtils.getMockWwd(mockGlobe);
    wwd.resetDrawContext();

    describe("WorldWindow Tests", function () {

        describe("Correctly computes a ray originating at the cameras's point and extending through the specified point in window coordinates", function () {
            it("Should throw an exception on missing input parameter", function () {
                expect(function () {
                    dc.rayThroughScreenPoint(null);
                }).toThrow();
            });

            // it("Calculates rayThroughScreenPoint correctly", function () {
            //     var screenPoint = new Vec2(13.5, 635);
            //     var expectedOrigin = new Vec3(-13332838.774, 8170373.752, -4852756.452);
            //     var expectedDirection = new Vec3(0.758, -0.628, -0.177);
            //     var line = wwd.rayThroughScreenPoint(screenPoint);
            //     var result = line.origin;
            //     expect(result).toBeCloseToVec3(expectedOrigin, 3);
            //     result = line.direction;
            //     expect(result).toBeCloseToVec3(expectedDirection, 3);
            // });
        });

        describe("Correctly computes the approximate size of a pixel at a specified distance from the cameras's point", function () {
            it("Calculates pixelSizeAtDistance correctly", function () {
                var distance = 10097319.189;
                var expectedSize = 9864.261; // FOV based approach gives another result then old pixel metrics based on frustum
                var pixelSize = wwd.pixelSizeAtDistance(distance);
                expect(pixelSize).toBeCloseTo(expectedSize, 3);
            });
        });
    });
});

