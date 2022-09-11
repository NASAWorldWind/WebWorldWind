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
    'src/globe/Globe2D',
    'src/geom/LookAt',
    'src/geom/Vec2',
    'test/util/TestUtils.test'
], function (Globe2D, LookAt, Vec2, TestUtils) {
    "use strict";

    var mockGlobe = new Globe2D();
    var wwd = TestUtils.getMockWwd(mockGlobe);
    wwd.resetDrawContext();

    describe("BasicWorldWindowController tests", function () {

        describe("Calculate 2D drag", function () {
            // TODO This tests require normal GLContext mock
            // it("Correctly interprets 2D drag gesture", function () {
            //     var recognizer = {state: "changed", clientX: 0, clientY: 0, translationX: 0, translationY: 0};
            //     wwd.worldWindowController.beginPoint = new Vec2(693, 428);
            //     wwd.worldWindowController.lastPoint = new Vec2(693.4, 429.2);
            //     wwd.worldWindowController.handlePanOrDrag2D(recognizer);
            //
            //     var lookAt = new LookAt();
            //     wwd.cameraAsLookAt(lookAt);
            //
            //     expect(lookAt.range).toEqual(10000000);
            //     expect(lookAt.tilt).toEqual(0);
            //     expect(lookAt.roll).toEqual(0);
            //     expect(lookAt.heading).toEqual(0);
            //     expect(lookAt.position.latitude).toBeCloseTo(29.8728799, 7);
            //     expect(lookAt.position.longitude).toBeCloseTo(-109.9576266, 7);
            // });
        });
    });
});

