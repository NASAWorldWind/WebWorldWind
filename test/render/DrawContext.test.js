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
    'src/BasicWorldWindowController',
    'src/render/DrawContext',
    'src/globe/EarthElevationModel',
    'src/globe/Globe',
    'src/LookAt',
    'src/geom/Matrix',
    'src/navigate/LookAtNavigator',
    'src/geom/Plane',
    'src/geom/Rectangle',
    'src/geom/Vec2',
    'src/geom/Vec3',
    'src/WorldWind',
    'src/WorldWindow',
    'test/util/TestUtils.test'
], function (BasicWorldWindowController, DrawContext, EarthElevationModel, Globe, LookAt, Matrix, LookAtNavigator, Plane, Rectangle, Vec2, Vec3, WorldWind, WorldWindow, TestUtils) {
    "use strict";

    // create a globe that returns mock elevations for a given sector so we don't have to rely on
    // asynchronous tile calls to finish.
    Globe.prototype.minAndMaxElevationsForSector = function (sector) {
        return [125.0, 350.0];
    };
    var wwd = TestUtils.getMockWwd();
    wwd.resetDrawContext();
    var dc = wwd.drawContext;

    describe("DrawContext Tests", function () {

        describe("Calculates correct view transforms", function () {
        //     it("Computes the correct transform", function () {
        //         var expectedModelview = new Matrix(
        //             -0.342, 0, 0.940, 2.328e-10,
        //             0.470, 0.866, 0.171, 18504.157,
        //             -0.814, 0.500, -0.296, -16372797.556,
        //             0, 0, 0, 1
        //         );
        //         TestUtils.expectMatrixCloseTo(dc.modelview, expectedModelview);
        //
        //         var expectedProjection = new Matrix(
        //             2, 0, 0, 0,
        //             0, 2.000, 0, 0,
        //             0, 0, -1.197, -3254427.539,
        //             0, 0, -1, 0
        //         );
        //         TestUtils.expectMatrixCloseTo(dc.projection, expectedProjection);
        //
        //         var expectedMvp = new Matrix(
        //             -0.684, 0, 1.879, 4.656e-10,
        //             0.940, 1.732, 0.342, 37008.314,
        //             0.974, -0.598, 0.355, 16343261.657,
        //             0.814, -0.5, 0.296, 16372797.556);
        //         TestUtils.expectMatrixCloseTo(dc.modelviewProjection, expectedMvp);
        //
        //         var expectedEyePoint = new Vec3(-13332838.783, 8170373.735, -4852756.455);
        //         TestUtils.expectVec3CloseTo(dc.eyePoint, expectedEyePoint);
        //
        //         var expectedMvn = new Matrix(
        //             -0.342, 0, 0.940, 0,
        //             0.470, 0.866, 0.171, 0,
        //             -0.814, 0.5, -0.296, 0,
        //             0, 0, 0, 1);
        //         TestUtils.expectMatrixCloseTo(dc.modelviewNormalTransform, expectedMvn);
        //
        //         expect(dc.pixelSizeFactor).toBeCloseTo(0.00118, 5);
        //         expect(dc.pixelSizeOffset).toBeCloseTo(0, 5);
        //
        //         var expectedBottom = new Plane(0.784, 0.551, 0.285, 7338688.285);
        //         TestUtils.expectPlaneCloseTo(dc.frustumInModelCoordinates._bottom, expectedBottom);
        //
        //         var expectedFar = new Plane(-0.814, 0.5, -0.296, 149953.966);
        //         TestUtils.expectPlaneCloseTo(dc.frustumInModelCoordinates._far, expectedFar);
        //
        //         var expectedLeft = new Plane(0.058, -0.224, 0.973, 7322137.663);
        //         TestUtils.expectPlaneCloseTo(dc.frustumInModelCoordinates._left, expectedLeft);
        //
        //         var expectedNear = new Plane(0.814, -0.5, 0.296, 14891469.721);
        //         TestUtils.expectPlaneCloseTo(dc.frustumInModelCoordinates._near, expectedNear);
        //
        //         var expectedRight = new Plane(0.67, -0.224, -0.708, 7322137.663);
        //         TestUtils.expectPlaneCloseTo(dc.frustumInModelCoordinates._right, expectedRight);
        //
        //         var expectedTop = new Plane(-0.056, -0.998, -0.021, 7305587.042);
        //         TestUtils.expectPlaneCloseTo(dc.frustumInModelCoordinates._top, expectedTop);
        //     });
        });

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
                // var modelPoint = new Vec3(-1405324.651, 5668987.866, -2535930.346);
                // var result = new Vec3(0, 0, 0);
                // var expectedResult = new Vec3(285.452, 703.234, 0.959);
                // dc.project(modelPoint, result);
                // TestUtils.expectVec3CloseTo(result, expectedResult);
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
                // var modelPoint = new Vec3(-1405324.651, 5668987.866, -2535930.346);
                // var result = new Vec3(0, 0, 0);
                // var expectedResult = new Vec3(285.452, 703.234, 0.957);
                // var depthOffset = -0.003;
                // dc.projectWithDepth(modelPoint, depthOffset, result);
                // TestUtils.expectVec3CloseTo(result, expectedResult);
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