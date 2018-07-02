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
    'src/globe/Globe',
    'src/globe/Globe2D',
    'src/geom/Matrix',
    'src/navigate/LookAtNavigator',
    'src/geom/Rectangle',
    'src/geom/Vec2',
    'src/geom/Vec3',
    'src/WorldWind',
    'src/WorldWindow'
], function (BasicWorldWindowController, DrawContext, Globe, Globe2D, Matrix, LookAtNavigator, Rectangle, Vec2, Vec3, WorldWind, WorldWindow) {
    "use strict";

    var MockGlContext = function () {
        this.drawingBufferWidth = 800;
        this.drawingBufferHeight = 800;
    };

    var viewport = new Rectangle(0, 0, 848, 848);
    var dc = new DrawContext(new MockGlContext());
    var MockWorldWindow = function () {
    };

    MockWorldWindow.prototype = Object.create(WorldWindow.prototype);

    var mockGlobe = new Globe2D();
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
    wwd.layers = [];
    wwd.scratchModelview = Matrix.fromIdentity();
    wwd.scratchProjection = Matrix.fromIdentity();
    wwd.resetDrawContext();

    describe("BasicWorldWindowController tests", function () {

        describe("Calculate 2D drag", function () {
            it("Correctly interprets 2D drag gesture", function () {
                var recognizer = {state: "changed", clientX: 0, clientY: 0, translationX: 0, translationY: 0};
                wwd.worldWindowController.beginPoint = new Vec2(693, 428);
                wwd.worldWindowController.lastPoint = new Vec2(693.4, 429.2);
                wwd.worldWindowController.handlePanOrDrag2D(recognizer);

                var navigator = wwd.navigator;
                expect(navigator.range).toEqual(10000000);
                expect(navigator.tilt).toEqual(0);
                expect(navigator.roll).toEqual(0);
                expect(navigator.heading).toEqual(0);
                expect(navigator.lookAtLocation.latitude).toBeCloseTo(29.8728799, 7);
                expect(navigator.lookAtLocation.longitude).toBeCloseTo(-109.9576266, 7);
            });
        });
    });
});

