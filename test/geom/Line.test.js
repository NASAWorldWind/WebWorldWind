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
    'src/geom/Line',
    'src/geom/Vec3'
], function (Line, Vec3) {
    "use strict";

    describe("Line Tests", function () {

        describe("Line Constructor", function () {

            it("Should construct a line correctly", function () {
                var origin = new Vec3(0, 0, 0);
                var direction = new Vec3(1, 2, 3);
                var line = new Line(origin, direction);
                expect(line.origin).toEqual(origin);
                expect(line.direction).toEqual(direction);
            });

            describe("Incorrect line", function () {

                it("Should throw an exception on missing origin", function () {
                    expect(function () {
                        var direction = new Vec3(1, 2, 3);
                        new Line(null, direction);
                    }).toThrow();
                });

                it("Should throw an exception on missing direction", function () {
                    expect(function () {
                        var origin = new Vec3(0, 0, 0);
                        new Line(origin, null);
                    }).toThrow();
                });
            });

        });

        describe("Line from segment", function () {

            it("Should construct a line from a segment", function () {
                var A = new Vec3(0, 1, 2);
                var B = new Vec3(2, 3, 4);
                var line = new Line.fromSegment(A, B);

                var expectedOrigin = new Vec3(0, 1, 2);
                var expectedDirection = new Vec3(2, 2, 2);
                var expectedLine = new Line(expectedOrigin, expectedDirection);

                expect(line).toEqual(expectedLine);
            });

            describe("Incorrect line from segment", function () {

                it("Should throw an exception on missing point A", function () {
                    expect(function () {
                        var B = new Vec3(1, 2, 3);
                        new Line.fromSegment(null, B);
                    }).toThrow();
                });

                it("Should throw an exception on missing point B", function () {
                    expect(function () {
                        var A = new Vec3(1, 2, 3);
                        new Line.fromSegment(A, null);
                    }).toThrow();
                });
            });
        });

        describe("Computes a Cartesian point a specified distance along this line", function () {

            it("Should construct a line from a segment", function () {
                var origin = new Vec3(0, 1, 2);
                var direction = new Vec3(2, 3, 4);
                var line = new Line(origin, direction);
                var result = line.pointAt(5, new Vec3());

                var expectedResult = new Vec3(10, 16, 22);
                expect(result).toEqual(expectedResult);
            });

            it("Should throw an exception on missing result vector", function () {
                expect(function () {
                    new Line.pointAt(5, null);
                }).toThrow();
            });
        });

        describe("Indicates whether the components of two lines are equal", function () {

            it("Equal lines", function () {
                var lineA = new Line(new Vec3(0, 1, 2), new Vec3(3, 4, 5));
                var lineB = new Line(new Vec3(0, 1, 2), new Vec3(3, 4, 5));
                expect(lineA.equals(lineB)).toBe(true);
            });

            it("Not equal lines", function () {
                var lineA = new Line(new Vec3(0, 1, 2), new Vec3(3, 4, 5));
                var lineB = new Line(new Vec3(0, 1, 2), new Vec3(3, 4, 6));
                expect(lineA.equals(lineB)).toBe(false);
                lineB = new Line(new Vec3(0, 1, 3), new Vec3(3, 4, 5));
                expect(lineA.equals(lineB)).toBe(false);
            });

            it("Null comparison", function () {
                var lineA = new Line(new Vec3(0, 1, 2), new Vec3(3, 4, 5));
                expect(lineA.equals(null)).toBe(false);
                expect(lineA.equals(undefined)).toBe(false);
            });
        });

        describe("Line cloning and copying", function () {
            it("Correctly copy lines", function () {
                var lineA = new Line(new Vec3(0, 1, 2), new Vec3(3, 4, 5));
                var lineB = new Line(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
                lineB.copy(lineA);
                expect(lineA.equals(lineB)).toBe(true);
            });

            it("Correctly clones lines", function () {
                var lineA = new Line(new Vec3(0, 1, 2), new Vec3(3, 4, 5));
                var lineB = lineA.clone();
                expect(lineA.equals(lineB)).toBe(true);
            });
        });
    });
});