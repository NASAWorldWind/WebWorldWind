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
    'src/geom/Camera',
    'src/globe/ElevationModel',
    'src/globe/Globe',
    'src/geom/LookAt',
    'src/geom/Matrix',
    'src/geom/Position',
    'test/util/TestUtils.test'
], function (Camera, ElevationModel, Globe, LookAt, Matrix, Position, TestUtils) {
    "use strict";

    var mockGlobe = new Globe(new ElevationModel());
    var wwd = TestUtils.getMockWwd(mockGlobe);

    describe("View tests", function () {

        describe("View calculations", function () {
            // TODO This tests require normal GLContext mock
            // it("Correctly calculates camera from lookAt", function () {
            //     var camera = wwd.camera;
            //     var lookAt = new LookAt();
            //     camera.position = new Position(30, -110, 10000000);
            //     for (var a = 0; a < 90; a++) {
            //         wwd.cameraAsLookAt(lookAt);
            //         console.log(lookAt.toString());
            //         lookAt.heading = a;
            //         wwd.cameraFromLookAt(lookAt);
            //         console.log(camera.toString());
            //         console.log('===');
            //     }
            // });
            // it("Correctly calculates viewing matrix", function () {
            //     var testView = wwd.camera;
            //     testView.position = new Position(30, -110, 10e6);
            //     var result = Matrix.fromIdentity();
            //     wwd.cameraToViewingTransform(result);
            //     var expectedModelview = new Matrix(
            //         -0.3420201433256687, 0.0, 0.9396926207859083, 0.0,
            //         0.46984631039295405, 0.8660254037844386, 0.17101007166283433, 18504.157,
            //         -0.8137976813493737, 0.4999999999999999, -0.2961981327260238, -1.63727975559594E7,
            //         0.0, 0.0, 0.0, 1.0);
            //     TestUtils.expectMatrixCloseTo(result, expectedModelview);
            // });
            //
            // it("Correctly calculates viewing matrix from 0,0", function () {
            //     var testView = wwd.camera;
            //     testView.position = new Position(0, 0, 10e6);
            //     var result = Matrix.fromIdentity();
            //     wwd.cameraToViewingTransform(result);
            //     var expectedModelview = new Matrix(
            //         1.0, 0.0, 0.0, -0.0,
            //         0.0, 1.0, 0.0, -0.0,
            //         0.0, 0.0, 1.0, -1.6378137E7,
            //         0.0, 0.0, 0.0, 1.0);
            //     TestUtils.expectMatrixCloseTo(result, expectedModelview);
            // });
            // it("Correctly calculates viewing matrix from 30,0", function () {
            //     var testView = wwd.camera;
            //     testView.position = new Position(30, 0, 10e6);
            //     var result = Matrix.fromIdentity();
            //     wwd.cameraToViewingTransform(result);
            //     var expectedModelview = new Matrix(
            //         1.0,0.0,0.0,-0.0,
            //         0.0,0.8660254037844387,-0.5,18504.125313225202,
            //         0.0,0.5,0.8660254037844387,-1.6372797555959404E7,
            //         0.0,0.0,0.0,1.0);
            //     TestUtils.expectMatrixCloseTo(result, expectedModelview);
            // });
            //
            // it("Correctly calculates camera from lookat", function () {
            //     var camera = wwd.camera;
            //     var lookAt = new LookAt();
            //     lookAt.range = 1.131761199603698E7;
            //     lookAt.position = new Position(30, -90, 0);
            //     wwd.cameraFromLookAt(lookAt);
            //     expect(camera.position.latitude).toBeCloseTo(30.0, 6);
            //     expect(camera.position.longitude).toBeCloseTo(-90.0, 6);
            //     expect(camera.position.altitude).toBeCloseTo(1.131761199603698E7, 6);
            //     expect(camera.heading).toBeCloseTo(0, 6);
            //     expect(camera.tilt).toBeCloseTo(0, 6);
            //     expect(camera.roll).toBeCloseTo(0, 6);
            // });
            //
            // it("Correctly calculates camera from transformed lookat", function () {
            //     var camera = wwd.camera;
            //     var lookAt = new LookAt();
            //     lookAt.range = 1.131761199603698E7;
            //     lookAt.tilt = 5;
            //     lookAt.roll = 5;
            //     lookAt.heading = 15;
            //     lookAt.position = new Position(30, -90, 0);
            //     wwd.cameraFromLookAt(lookAt);
            //     expect(camera.position.latitude).toBeCloseTo(26.90254740059172, 6);
            //     expect(camera.position.longitude).toBeCloseTo(-90.92754733364956, 6);
            //     expect(camera.position.altitude).toBeCloseTo(11302122.347, 3);
            //     expect(camera.heading).toBeCloseTo(14.557895813118208, 6);
            //     expect(camera.tilt).toBeCloseTo(1.7970369431725128, 6);
            //     expect(camera.roll).toBeCloseTo(5, 6);
            // });
        });

        describe("Indicates whether the components of two cameras are equal", function () {

            it("Equal cameras", function () {
                var c1 = new Camera();
                var c2 = new Camera();
                expect(c1.equals(c2)).toBe(true);
            });

            it("Not equal cameras", function () {
                var c1 = new Camera();
                var c2 = new Camera();
                c2.heading = c1.heading + 1;
                expect(c1.equals(c2)).toBe(false);
                c2.heading = c1.heading;
                expect(c1.equals(c2)).toBe(true);
                c2.tilt = c1.tilt + 1;
                expect(c1.equals(c2)).toBe(false);
                c2.tilt = c1.tilt;
                expect(c1.equals(c2)).toBe(true);
                c2.roll = c1.roll + 1;
                expect(c1.equals(c2)).toBe(false);
                c2.roll = c1.roll;
                expect(c1.equals(c2)).toBe(true);
                c2.position.latitude = c1.position.latitude + 1;
                expect(c1.equals(c2)).toBe(false);
                c2.position.latitude = c1.position.latitude;
                expect(c1.equals(c2)).toBe(true);
            });

            it("Null comparison", function () {
                var c1 = new Camera();
                expect(c1.equals(null)).toBe(false);
                expect(c1.equals(undefined)).toBe(false);
            });
        });

        describe("Camera cloning and copying", function () {
            it("Correctly copy cameras", function () {
                var c1 = new Camera();
                var c2 = new Camera();
                c2.heading = c1.heading + 1;
                c2.tilt = c1.tilt + 1;
                c2.roll = c1.roll + 1;
                c2.position.latitude = c1.position.latitude + 1;
                c1.copy(c2);
                expect(c1.equals(c2)).toBe(true);
            });

            it("Correctly clones cameras", function () {
                var c1 = new Camera();
                c1.heading = c1.heading + 1;
                c1.tilt = c1.tilt + 1;
                c1.roll = c1.roll + 1;
                c1.position.latitude = c1.position.latitude + 1;
                var c2 = c1.clone();
                expect(c1.equals(c2)).toBe(true);
            });
        });
    });
});

