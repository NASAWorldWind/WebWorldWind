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
/**
 * @exports TestUtils
 */
define([
        'src/BasicWorldWindowController',
        'src/Camera',
        'src/render/DrawContext',
        'src/globe/EarthElevationModel',
        'src/globe/Globe',
        'src/navigate/LookAtNavigator',
        'src/geom/Matrix',
        'src/geom/Rectangle',
        'src/geom/Vec2',
        'src/geom/Vec3',
        'src/WorldWind',
        'src/WorldWindow',
    ],
    function (BasicWorldWindowController, Camera, DrawContext, EarthElevationModel, Globe, LookAtNavigator, Matrix, Rectangle, Vec2, Vec3, WorldWind, WorldWindow) {
        "use strict";

        var TestUtils = function () {
        };

        TestUtils.expectPlaneCloseTo = function (p1, p2) {
            expect(p1.distance).toBeCloseTo(p2.distance, 3);
            TestUtils.expectVec3CloseTo(p1.normal, p2.normal);
        };

        TestUtils.expectVec3CloseTo = function (v1, v2) {
            for (var i = 0; i < 3; i++) {
                expect(v1[i]).toBeCloseTo(v2[i], 3);
            }
        };

        TestUtils.expectMatrixEquality = function (matrix1, matrix2) {
            for (var i = 0; i < 16; i++) {
                expect(matrix1[i]).toEqual(matrix2[i]);
            }
        };

        TestUtils.expectMatrixCloseTo = function (matrix1, matrix2, precision) {
            if (precision === undefined) {
                precision = 3;
            }

            for (var i = 0; i < 16; i++) {
                expect(matrix1[i]).toBeCloseTo(matrix2[i], precision);
            }
        };

        TestUtils.getMockWwd = function () {
            var MockGlContext = function () {
                this.drawingBufferWidth = 800;
                this.drawingBufferHeight = 800;
            };

            var viewport = new Rectangle(0, 0, 848, 848);
            var dc = new DrawContext(new MockGlContext());
            var MockWorldWindow = function () {
            };

            MockWorldWindow.prototype = Object.create(WorldWindow.prototype);

            var mockGlobe = new Globe(new EarthElevationModel());
            var wwd = new MockWorldWindow();
            wwd.globe = mockGlobe;
            wwd.drawContext = dc;
            wwd.navigator = new LookAtNavigator(wwd);
            wwd.worldWindowController = new BasicWorldWindowController(wwd);
            wwd.viewport = viewport;
            wwd.depthBits = 24;
            wwd.canvas = {
                clientLeft: 0, clientTop: 0, getBoundingClientRect: function () {
                    return {left: 339.5, top: 225};
                }
            };
            wwd.scratchModelview = Matrix.fromIdentity();
            wwd.scratchProjection = Matrix.fromIdentity();
            wwd.camera = new Camera(wwd);
            return wwd;
        };

        return TestUtils;
    });

