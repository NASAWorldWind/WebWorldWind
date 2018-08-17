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
    'src/BasicWorldWindowController',
    'src/render/DrawContext',
    'src/globe/ElevationModel',
    'src/globe/Globe',
    'src/geom/Matrix',
    'src/navigate/LookAtNavigator',
    'src/geom/Plane',
    'src/geom/Rectangle',
    'src/geom/Vec2',
    'src/geom/Vec3',
    'src/WorldWind',
    'src/WorldWindow',
    'test/CustomMatchers.test'
], function (BasicWorldWindowController, DrawContext, ElevationModel, Globe, Matrix, LookAtNavigator, Plane, Rectangle, Vec2, Vec3, WorldWind, WorldWindow, CustomMatchers) {
    "use strict";

    var MockGlContext = function () {
        this.drawingBufferWidth = 800;
        this.drawingBufferHeight = 800;
    };

    var viewport = new Rectangle(0, 0, 848, 848);
    var dummyParam = "dummy";
    var dc = new DrawContext(new MockGlContext());
    var MockWorldWindow = function () {
    };

    MockWorldWindow.prototype = Object.create(WorldWindow.prototype);

    // create a globe that returns mock elevations for a given sector so we don't have to rely on
    // asynchronous tile calls to finish.
    Globe.prototype.minAndMaxElevationsForSector = function (sector) {
        return [125.0, 350.0];
    };
    var mockGlobe = new Globe(new ElevationModel());
    var wwd = new MockWorldWindow();
    wwd.globe = mockGlobe;
    wwd.drawContext = dc;
    wwd.navigator = new LookAtNavigator();
    wwd.worldWindowController = new BasicWorldWindowController(wwd);
    wwd.viewport = viewport;
    wwd.depthBits = 24;
    wwd.scratchModelview = Matrix.fromIdentity();
    wwd.scratchProjection = Matrix.fromIdentity();
    wwd.layers = [];
    wwd.resetDrawContext();

    beforeEach(function () {
        jasmine.addMatchers(CustomMatchers);
    });

    describe("DrawContext Tests", function () {

        // describe("Calculates correct view transforms", function () {
        //     it("Computes the correct transform", function () {
        //         var expectedModelview = new Matrix(
        //             -0.342, 0, 0.940, 2.328e-10,
        //             0.470, 0.866, 0.171, 18504.138,
        //             -0.814, 0.500, -0.296, -16372797.556,
        //             0, 0, 0, 1
        //         );
        //         expectMatrixCloseTo(dc.modelview, expectedModelview);
        //
        //         var expectedProjection = new Matrix(
        //             2, 0, 0, 0,
        //             0, 2.000, 0, 0,
        //             0, 0, -1.197, -3254427.539,
        //             0, 0, -1, 0
        //         );
        //         expectMatrixCloseTo(dc.projection, expectedProjection);
        //
        //         var expectedMvp = new Matrix(
        //             -0.684, 0, 1.879, 4.656e-10,
        //             0.940, 1.732, 0.342, 37008.275,
        //             0.974, -0.598, 0.355, 16343261.657,
        //             0.814, -0.5, 0.296, 16372797.556);
        //         expectMatrixCloseTo(dc.modelviewProjection, expectedMvp);
        //
        //         var expectedEyePoint = new Vec3(-13332838.774, 8170373.752, -4852756.452);
        //         expectVec3CloseTo(dc.eyePoint, expectedEyePoint);
        //
        //         var expectedMvn = new Matrix(
        //             -0.342, 0, 0.940, 0,
        //             0.470, 0.866, 0.171, 0,
        //             -0.814, 0.5, -0.296, 0,
        //             0, 0, 0, 1);
        //         expectMatrixCloseTo(dc.modelviewNormalTransform, expectedMvn);
        //
        //         expect(dc.pixelSizeFactor).toBeCloseTo(0.00118, 5);
        //         expect(dc.pixelSizeOffset).toBeCloseTo(0, 5);
        //
        //         var expectedBottom = new Plane(0.784, 0.551, 0.285, 7338688.267);
        //         expectPlaneCloseTo(dc.frustumInModelCoordinates._bottom, expectedBottom);
        //
        //         var expectedFar = new Plane(-0.814, 0.5, -0.296, 149953.966);
        //         expectPlaneCloseTo(dc.frustumInModelCoordinates._far, expectedFar);
        //
        //         var expectedLeft = new Plane(0.058, -0.224, 0.973, 7322137.663);
        //         expectPlaneCloseTo(dc.frustumInModelCoordinates._left, expectedLeft);
        //
        //         var expectedNear = new Plane(0.814, -0.5, 0.296, 14891469.721);
        //         expectPlaneCloseTo(dc.frustumInModelCoordinates._near, expectedNear);
        //
        //         var expectedRight = new Plane(0.67, -0.224, -0.708, 7322137.663);
        //         expectPlaneCloseTo(dc.frustumInModelCoordinates._right, expectedRight);
        //
        //         var expectedTop = new Plane(-0.056, -0.998, -0.021, 7305587.059);
        //         expectPlaneCloseTo(dc.frustumInModelCoordinates._top, expectedTop);
        //     });
        // });

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

            // it("Computes the correct projection", function () {
            //     var modelPoint = new Vec3(-1405324.651, 5668987.866, -2535930.346);
            //     var result = new Vec3(0, 0, 0);
            //     var expectedResult = new Vec3(285.452, 703.234, 0.959);
            //     dc.project(modelPoint, result);
            //     expectVec3CloseTo(result, expectedResult);
            // });

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

            // it("Computes the correct projection with depth", function () {
            //     var modelPoint = new Vec3(-1405324.651, 5668987.866, -2535930.346);
            //     var result = new Vec3(0, 0, 0);
            //     var expectedResult = new Vec3(285.452, 703.234, 0.957);
            //     var depthOffset = -0.003;
            //     dc.projectWithDepth(modelPoint, depthOffset, result);
            //     expectVec3CloseTo(result, expectedResult);
            // });
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
                expect(result).toBeCloseToVec2(expectedResult, 2);
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