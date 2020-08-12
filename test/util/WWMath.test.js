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
        'src/geom/Vec3',
        'src/util/WWMath'
    ],
    function (Vec3, WWMath) {
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

            describe('computeTriangleNormal test', function () {

                it('Computes a triangle normals', function () {
                    var v1 = new Vec3(26, 2, 1);
                    var v2 = new Vec3(26, 2, 13);
                    var v3 = new Vec3(12, -23, 13);
                    var expectedNormal = new Vec3(0.8725060159497201, -0.48860336893184325, 0.0);
                    var normal = WWMath.computeTriangleNormal(v1, v2, v3);
                    expect(expectedNormal[0]).toBeCloseTo(normal[0]);
                    expect(expectedNormal[1]).toBeCloseTo(normal[1]);
                    expect(expectedNormal[2]).toBeCloseTo(normal[2]);

                    v1 = new Vec3(-12, 12, 26);
                    v2 = new Vec3(23, -23, 2);
                    v3 = new Vec3(13, 13, 13);
                    expectedNormal = new Vec3(0.4612242682795252, -0.1396190373706287, 0.8762298207398077);
                    normal = WWMath.computeTriangleNormal(v1, v2, v3);
                    expect(expectedNormal[0]).toBeCloseTo(normal[0]);
                    expect(expectedNormal[1]).toBeCloseTo(normal[1]);
                    expect(expectedNormal[2]).toBeCloseTo(normal[2]);
                });
            });
        });
    });