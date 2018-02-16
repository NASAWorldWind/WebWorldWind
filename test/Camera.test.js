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
    'src/Camera',
    'test/CustomMatchers.test',
    'src/LookAt',
    'src/geom/Line',
    'src/geom/Matrix',
    'src/geom/Position',
    'test/util/TestUtils.test',
    'src/geom/Vec3'
], function (Camera,
             CustomMatchers,
             LookAt,
             Line,
             Matrix,
             Position,
             TestUtils,
             Vec3) {
    "use strict";

    describe("Camera tests", function () {

        it("Converts Camera to LookAt (and back) under a variety of conditions", function () {
            var wwd = TestUtils.getMockWwd();
            var testFunction = function (latitude, altitude, heading, tilt, roll) {
                var expectedCamera = new Camera(wwd);
                expectedCamera.position.latitude = latitude;
                expectedCamera.position.longitude = 0;
                expectedCamera.position.altitude = altitude;
                expectedCamera.heading = heading;
                expectedCamera.tilt = tilt;
                expectedCamera.roll = roll;

                var lookAt = expectedCamera.getAsLookAt(new LookAt());
                var actualCamera = expectedCamera.clone().setFromLookAt(lookAt);

                //var lookAt = getAsLookAt2(expectedCamera, new LookAt());
                //var actualCamera = setFromLookAt2(expectedCamera.clone(), lookAt);

                var expectedPos = expectedCamera.position,
                    actualPos = actualCamera.position,
                    expectedPoint = wwd.globe.computePointFromPosition(expectedPos.latitude, expectedPos.longitude, expectedPos.altitude, new Vec3()),
                    actualPoint = wwd.globe.computePointFromPosition(actualPos.latitude, actualPos.longitude, actualPos.altitude, new Vec3()),
                    posDifference = expectedPoint.distanceTo(actualPoint),
                    headingDifference = Math.abs(expectedCamera.heading - actualCamera.heading),
                    tiltDifference = Math.abs(expectedCamera.tilt - actualCamera.tilt),
                    rollDifference = Math.abs(expectedCamera.roll - actualCamera.roll);

                console.log(latitude +
                    "\t" + altitude +
                    "\t" + heading +
                    "\t" + tilt +
                    "\t" + roll +
                    "\t" + posDifference +
                    "\t" + headingDifference +
                    "\t" + tiltDifference +
                    "\t" + rollDifference);
            };

            [0, 30, 60, 85, -30, -60, -85].forEach(function (latitude) {
                [0, 45, 90, 135].forEach(function (heading) {
                    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85].forEach(function (tilt) {
                        [0, 45, 90, 135].forEach(function (roll) {
                            testFunction(latitude, 10, heading, tilt, roll);
                            testFunction(latitude, 10e3, heading, tilt, roll);
                            if (tilt <= 20) {
                                testFunction(latitude, 10e6, heading, tilt, roll);
                            }
                        });
                    })
                })
            });
        });

        // function getAsLookAt2(camera, lookAt) {
        //     var modelview = new Matrix(), eyePoint = new Vec3(), forward = new Vec3(),
        //         lookAtPoint = new Vec3(), lookAtPos = new Position();
        //     modelview.setToIdentity();
        //     modelview.multiplyByFirstPersonModelview(camera.position, camera.heading, camera.tilt, camera.roll, camera.wwd.globe);
        //     modelview.extractEyePoint(eyePoint);
        //     modelview.extractForwardVector(forward);
        //
        //     camera.wwd.globe.intersectsLine(new Line(eyePoint, forward), lookAtPoint);
        //     camera.wwd.globe.computePositionFromPoint(lookAtPoint[0], lookAtPoint[1], lookAtPoint[2], lookAtPos);
        //     modelview.multiplyByLocalCoordinateTransform(lookAtPoint, camera.wwd.globe);
        //
        //     lookAt.lookAtPosition = new Position().copy(lookAtPos);
        //     lookAt.range = -modelview[11];
        //     lookAt.heading = modelview.extractHeading(camera.roll);
        //     lookAt.tilt = modelview.extractTilt();
        //     lookAt.roll = camera.roll;
        //
        //     return lookAt;
        // }
        //
        // function setFromLookAt2(camera, lookAt) {
        //     var modelview = new Matrix(), eyePoint = new Vec3(), eyePos = new Position();
        //     modelview.setToIdentity();
        //     modelview.multiplyByLookAtModelview(lookAt.lookAtPosition, lookAt.range, lookAt.heading, lookAt.tilt, lookAt.roll, camera.wwd.globe);
        //     modelview.extractEyePoint(eyePoint);
        //
        //     camera.wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], eyePos);
        //     modelview.multiplyByLocalCoordinateTransform(eyePoint, camera.wwd.globe);
        //
        //     camera.position = new Position().copy(eyePos);
        //     camera.heading = modelview.extractHeading(lookAt.roll);
        //     camera.tilt = modelview.extractTilt();
        //     camera.roll = lookAt.roll;
        //
        //     return camera;
        // }

        // it("Correctly calculates viewing matrix", function () {
        //     var testView = wwd.camera;
        //     testView.position = new Position(30, -110, 10e6);
        //     var result = Matrix.fromIdentity();
        //     testView.computeViewingTransform(result);
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
        //     testView.computeViewingTransform(result);
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
        //     testView.computeViewingTransform(result);
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
        //     lookAt.lookAtPosition = new Position(30, -90, 0);
        //     camera.setFromLookAt(lookAt);
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
        //     lookAt.lookAtPosition = new Position(30, -90, 0);
        //     camera.setFromLookAt(lookAt);
        //     expect(camera.position.latitude).toBeCloseTo(26.90254740059172, 6);
        //     expect(camera.position.longitude).toBeCloseTo(-90.92754733364956, 6);
        //     expect(camera.position.altitude).toBeCloseTo(11302122.347, 3);
        //     expect(camera.heading).toBeCloseTo(14.557895813118208, 6);
        //     expect(camera.tilt).toBeCloseTo(1.7970369431725128, 6);
        //     expect(camera.roll).toBeCloseTo(5, 6);
        // });
    });
});

