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
                var result = line.pointAt(5, Vec3.ZERO);

                var expectedResult = new Vec3(10, 16, 22);
                expect(result).toEqual(expectedResult);
            });

            it("Should throw an exception on missing result vector", function () {
                expect(function () {
                    new Line.pointAt(5, null);
                }).toThrow();
            });
        });
    });
});