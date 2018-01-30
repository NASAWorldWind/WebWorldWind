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
    });
});

