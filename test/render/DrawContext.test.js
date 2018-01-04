/*
 * Copyright 2015-2017 WorldWind Contributors
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
    'src/render/DrawContext',
    'src/geom/Matrix',
    'src/navigate/NavigatorState',
    'src/geom/Rectangle',
    'src/geom/Vec2',
    'src/geom/Vec3',
    'src/WorldWind'
], function (DrawContext, Matrix, NavigatorState, Rectangle, Vec2, Vec3, WorldWind) {
    "use strict";

    var modelView = new Matrix(
        -0.342, 0, 0.939, 2.328e-10,
        0.469, 0.866, 0.171, 18504.137,
        -0.813, 0.500, -0.296, -16372797.555,
        0, 0, 0, 1
    );

    var projection = new Matrix(
        2, 0, 0, 0,
        0, 2, 0, 0,
        0, 0, -1.196, -3254427.538,
        0, 0, -1, 0
    );

    var viewport = new Rectangle(0, 0, 848, 848);
    var dummyParam = "dummy";
    var dc = new DrawContext(dummyParam);
    dc.navigatorState = new NavigatorState(modelView, projection, viewport, 0, 0, dc);
    dc.viewport = viewport;
    dc.computeViewingTransform();

    describe("DrawContext Tests", function () {

        describe("Calculates correct projections", function () {
            it("Should throw an exception on missing input parameter", function () {
                expect(function () {
                    dc.project(null, dummyParam);
                }).toThrow();
            });

            it("Should throw an exception on missing output variable", function () {
                expect(function () {
                    dc.project(dummyParam, null);
                }).toThrow();
            });

            it("Computes the correct projection", function () {
                var modelPoint = new Vec3(-1405324.651, 5668987.866, -2535930.346);
                var result = new Vec3(0, 0, 0);
                var expectedResult = new Vec3(285.597, 703.273, 0.958);
                dc.project(modelPoint, result);
                for (var i = 0; i < 3; i++) {
                    expect(result[i]).toBeCloseTo(expectedResult[i], 3);
                }

            });

            it("Should throw an exception on missing input parameter", function () {
                expect(function () {
                    dc.projectWithDepth(null, dummyParam, dummyParam);
                }).toThrow();
            });

            it("Should throw an exception on missing output variable", function () {
                expect(function () {
                    dc.projectWithDepth(dummyParam, dummyParam, null);
                }).toThrow();
            });

            it("Computes the correct projection with depth", function () {
                var modelPoint = new Vec3(-1405324.651, 5668987.866, -2535930.346);
                var result = new Vec3(0, 0, 0);
                var expectedResult = new Vec3(285.597, 703.273, 0.956);
                var depthOffset = -0.003;
                dc.projectWithDepth(modelPoint, depthOffset, result);
                for (var i = 0; i < 3; i++) {
                    expect(result[i]).toBeCloseTo(expectedResult[i], 3);
                }

            });
        });

        describe("Calculates correct WebGL screen coordinates", function () {
            it("Should throw an exception on missing input parameter", function () {
                expect(function () {
                    dc.convertPointToViewport(null, dummyParam);
                }).toThrow();
            });

            it("Should throw an exception on missing output variable", function () {
                expect(function () {
                    dc.convertPointToViewport(dummyParam, null);
                }).toThrow();
            });

            it("Correctly converts a window coordinate to WebGL screen coordinate", function () {
                var windowPoint = new Vec2(2.5, 69);
                var result = new Vec2(0, 0);
                var expectedResult = new Vec2(2.5, 779);
                dc.convertPointToViewport(windowPoint, result);
                for (var i = 0; i < 2; i++) {
                    expect(result[i]).toBeCloseTo(expectedResult[i], 2);
                }

            });
        });

        describe("Correctly computes a ray originating at the navigator's eyePoint and extending through the specified point in window coordinates", function () {
            it("Should throw an exception on missing input parameter", function () {
                expect(function () {
                    dc.rayThroughScreenPoint(null);
                }).toThrow();
            });

            it("Calculates rayThroughScreenPoint correctly", function () {
                var screenPoint = new Vec2(13.5, 635);
                var expectedOrigin = new Vec3(-13319762.852, 8170374.195, -4849512.284);
                var expectedDirection = new Vec3(0.758, -0.628, -0.177);
                var line = dc.rayThroughScreenPoint(screenPoint);
                var result = line.origin;
                for (var i = 0; i < 3; i++) {
                    expect(result[i]).toBeCloseTo(expectedOrigin[i], 3);
                }
                result = line.direction;
                for (i = 0; i < 3; i++) {
                    expect(result[i]).toBeCloseTo(expectedDirection[i], 3);
                }
            });
        });

        describe("Correctly computes the approximate size of a pixel at a specified distance from the navigator's eye point", function () {
            it("Calculates pixelSizeAtDistance correctly", function () {
                var distance = 10097319.189;
                var expectedSize = 11907.216;
                var pixelSize = dc.pixelSizeAtDistance(distance);
                expect(pixelSize).toBeCloseTo(expectedSize, 3);
            });
        });
    });
});