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
    'src/geom/Matrix',
    'src/navigate/LookAtNavigator',
    'src/geom/Rectangle',
    'src/geom/Vec2',
    'src/geom/Vec3',
    'src/WorldWind',
    'src/WorldWindow'
], function (BasicWorldWindowController, DrawContext, EarthElevationModel, Globe, Matrix, LookAtNavigator, Rectangle, Vec2, Vec3, WorldWind, WorldWindow) {
    "use strict";

    var expectVec3CloseTo = function (v1, v2) {
        for (var i = 0; i < 3; i++) {
            expect(v1[i]).toBeCloseTo(v2[i], 3);
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

    // create a globe that returns mock elevations for a given sector so we don't have to rely on
    // asynchronous tile calls to finish.
    Globe.prototype.minAndMaxElevationsForSector = function (sector) {
        return [125.0, 350.0];
    };
    var mockGlobe = new Globe(new EarthElevationModel());
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

    describe("WorldWindow Tests", function () {

        describe("Correctly computes a ray originating at the navigator's eyePoint and extending through the specified point in window coordinates", function () {
            it("Should throw an exception on missing input parameter", function () {
                expect(function () {
                    dc.rayThroughScreenPoint(null);
                }).toThrow();
            });

            it("Calculates rayThroughScreenPoint correctly", function () {
                var screenPoint = new Vec2(13.5, 635);
                var expectedOrigin = new Vec3(-13332838.774, 8170373.752, -4852756.452);
                var expectedDirection = new Vec3(0.758, -0.628, -0.177);
                var line = wwd.rayThroughScreenPoint(screenPoint);
                var result = line.origin;
                expectVec3CloseTo(result, expectedOrigin);
                result = line.direction;
                expectVec3CloseTo(result, expectedDirection);
            });
        });

        describe("Correctly computes the approximate size of a pixel at a specified distance from the navigator's eye point", function () {
            it("Calculates pixelSizeAtDistance correctly", function () {
                var distance = 10097319.189;
                var expectedSize = 11907.216;
                var pixelSize = wwd.pixelSizeAtDistance(distance);
                expect(pixelSize).toBeCloseTo(expectedSize, 3);
            });
        });
    });
});

