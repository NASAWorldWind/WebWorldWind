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
        'src/util/WWMath'
    ],
    function (WWMath) {
        'use strict';

        describe('WWMath test', function () {

            describe('normalizeAngle360 test', function () {

                it('Normalize an angle to be between [0, 360)', function () {
                    var angles = [0, -10, 360, 1000];
                    var expectedAngles = [0, 350, 0, 280];
                    var computedAngles = angles.map(function (angle) {
                        return WWMath.normalizeAngle360(angle);
                    });
                    expectedAngles.forEach(function (expectedResult, i) {
                        expect(expectedResult).toBeCloseTo(computedAngles[i]);
                    });
                });

            });

        });
    });