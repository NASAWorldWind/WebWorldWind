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
    'src/LookAt',
    'src/geom/Matrix',
    'src/geom/Position',
    'test/util/TestUtils.test'
], function (LookAt, Matrix, Position, TestUtils) {
    "use strict";

    var wwd = TestUtils.getMockWwd();

    describe("LookAt tests", function () {

        describe("View calculations", function () {
            it("Correctly calculates viewing matrix", function () {
                var lookAt = new LookAt();
                lookAt.lookAtPosition = new Position(30, -90, 0);
                lookAt.range = 1.131761199603698E7;
                var result = Matrix.fromIdentity();
                lookAt.computeViewingTransform(wwd.globe, result);
                var expectedModelview = new Matrix(
                    6.123233995736767E-17, -3.0814879110195774E-33, 1.0, 2.0679515313825692E-25,
                    0.5, 0.8660254037844387, -3.0616169978683836E-17, 18504.138,
                    -0.8660254037844387, 0.5, 5.302876193624535E-17, -1.7690409551996384E7,
                    0.0, 0.0, 0.0, 1.0);
                TestUtils.expectMatrixCloseTo(result, expectedModelview);
            });
        });

        describe("Indicates whether the components of two lookats are equal", function () {

            it("Equal lookats", function () {
                var l1 = new LookAt();
                var l2 = new LookAt();
                expect(l1.equals(l2)).toBe(true);
            });

            it("Not equal lookats", function () {
                var l1 = new LookAt();
                var l2 = new LookAt();
                l2.heading = l1.heading + 1;
                expect(l1.equals(l2)).toBe(false);
                l2.heading = l1.heading;
                expect(l1.equals(l2)).toBe(true);
                l2.tilt = l1.tilt + 1;
                expect(l1.equals(l2)).toBe(false);
                l2.tilt = l1.tilt;
                expect(l1.equals(l2)).toBe(true);
                l2.roll = l1.roll + 1;
                expect(l1.equals(l2)).toBe(false);
                l2.roll = l1.roll;
                expect(l1.equals(l2)).toBe(true);
                l2.lookAtPosition.latitude = l1.lookAtPosition.latitude + 1;
                expect(l1.equals(l2)).toBe(false);
                l2.lookAtPosition.latitude = l1.lookAtPosition.latitude;
                expect(l1.equals(l2)).toBe(true);
            });

            it("Null comparison", function () {
                var l1 = new LookAt();
                expect(l1.equals(null)).toBe(false);
                expect(l1.equals(undefined)).toBe(false);
            });
        });

        describe("LookAt cloning and copying", function () {
            it("Correctly copy lookats", function () {
                var l1 = new LookAt();
                var l2 = new LookAt();
                l2.heading = l1.heading + 1;
                l2.tilt = l1.tilt + 1;
                l2.roll = l1.roll + 1;
                l2.lookAtPosition.latitude = l1.lookAtPosition.latitude + 1;
                l1.copy(l2);
                expect(l1.equals(l2)).toBe(true);
            });

            it("Correctly clones lookats", function () {
                var l1 = new LookAt();
                l1.heading = l1.heading + 1;
                l1.tilt = l1.tilt + 1;
                l1.roll = l1.roll + 1;
                l1.lookAtPosition.latitude = l1.lookAtPosition.latitude + 1;
                var l2 = l1.clone();
                expect(l1.equals(l2)).toBe(true);
            });
        });
    });
});

