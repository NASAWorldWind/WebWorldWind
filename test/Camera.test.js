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
    'src/Camera',
    'src/render/DrawContext',
    'src/globe/EarthElevationModel',
    'src/globe/Globe',
    'src/globe/Globe2D',
    'src/geom/Matrix',
    'src/navigate/LookAtNavigator',
    'src/geom/Position',
    'src/geom/Rectangle',
    'src/geom/Vec2',
    'src/geom/Vec3',
    'src/WorldWind',
    'src/WorldWindow'
], function (BasicWorldWindowController, Camera, DrawContext, EarthElevationModel, Globe, Globe2D, Matrix, LookAtNavigator, Position, Rectangle, Vec2, Vec3, WorldWind, WorldWindow) {
    "use strict";

    var expectMatrixCloseTo = function (matrix1, matrix2) {
        for (var i = 0; i < 16; i++) {
            expect(matrix1[i]).toBeCloseTo(matrix2[i], 3);
        }
    };

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
    wwd._worldWindowView = new Camera(wwd);
    wwd._editWorldWindowView = new Camera(wwd);

    describe("Camera tests", function () {

        describe("View calculations", function () {
            it("Correctly calculates viewing matrix", function () {
                var testCamera = new Camera(wwd);
                testCamera.cameraPosition = new Position(30, -90, 1.1317611996036978E7);
                var result = Matrix.fromIdentity();
                testCamera.computeViewingTransform(result);
                var expectedModelview = new Matrix(
                    6.123233995736766E-17, -3.0814879110195774E-33, 1.0, 0.0,
                    0.5000000016807186, 0.8660254028140754, -3.061617008159816E-17, 18504.15964544285,
                    -0.8660254028140754, 0.5000000016807186, 5.302876187682773E-17, -1.7690409551960476E7,
                    0.0, 0.0, 0.0, 1.0);
                expectMatrixCloseTo(result, expectedModelview);

            });
        });
    });
});

