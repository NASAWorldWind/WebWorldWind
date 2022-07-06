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
    'src/geom/Position',
    'src/geom/Angle'
], function (Position, Angle) {
    "use strict";

    describe("Position Tests", function () {

        it("Should construct a Position correctly", function () {
            var position = new Position(37.52, 15.08, 150);

            expect(position.latitude).toEqual(37.52);
            expect(position.longitude).toEqual(15.08);
            expect(position.altitude).toEqual(150);
        });

        it("Should have three zero components", function () {
            var position = Position.ZERO;
            expect(position.latitude).toEqual(0);
            expect(position.longitude).toEqual(0);
            expect(position.altitude).toEqual(0);
        });

        it("Creates a position from angles specified in radians", function () {
            var radiansLatitude = 37.52 / Angle.RADIANS_TO_DEGREES;
            var radiansLongitude = 15.08 / Angle.RADIANS_TO_DEGREES;

            var position = Position.fromRadians(radiansLatitude, radiansLongitude, 150);
            expect(position.latitude).toEqual(37.52);
            expect(position.longitude).toEqual(15.08);
            expect(position.altitude).toEqual(150);
        });

        describe("Copies this position to the latitude and longitude of a specified position", function () {

            it("Copies the position successfully", function () {
                var position = new Position(0, 0, 0);
                var positionTarget = new Position(37.52, 15.08, 150);

                position.copy(positionTarget);
                expect(position.latitude).toEqual(37.52);
                expect(position.longitude).toEqual(15.08);
                expect(position.altitude).toEqual(150);
            });

            it("Should throw an exception on missing position input", function () {
                expect(function () {
                    var position = new Position(0, 0, 0);
                    position.copy(null);
                }).toThrow();
            });
        });

        describe('Checks if two positions are equal', function () {

            it('Equal positions', function () {
                var positionA = new Position(37.52, 15.08, 150);
                var positionB = new Position(37.52, 15.08, 150);
                expect(positionA.equals(positionB)).toBe(true);
            });

            it('Different positions', function () {
                var positionA = new Position(37.52, 15.08, 150);
                var positionB = new Position(37, 18, 150);
                expect(positionA.equals(positionB)).toBe(false);
            });
        });

        describe('Computes a position along a great circle path', function () {

            var positionA = new Position(37.52, 15.00, 120);
            var positionB = new Position(45.48, 9.09, 150);

            it('Compute with Great Circle', function () {
                var resultPosition = Position.interpolateGreatCircle(
                    0.5,
                    positionA,
                    positionB,
                    new Position());
                expect(resultPosition.latitude).toBeCloseTo(41.537);
                expect(resultPosition.longitude).toBeCloseTo(12.227);
                expect(resultPosition.altitude).toBeCloseTo(135);
            });

            it('Equal positions', function () {
                var resultPosition = Position.interpolateGreatCircle(
                    0.5,
                    positionA,
                    positionA,
                    new Position());
                expect(resultPosition).toEqual(positionA);
            });

            describe('Exceptions', function () {

                it('Position A not provided', function () {
                    expect(function () {
                        Position.interpolateGreatCircle(
                            0.5,
                            null,
                            positionB,
                            new Position());
                    }).toThrow();
                });

                it('Position B not provided', function () {
                    expect(function () {
                        Position.interpolateGreatCircle(
                            0.5,
                            positionA,
                            null,
                            new Position());
                    }).toThrow();
                });

                it('Result storage not provided', function () {
                    expect(function () {
                        Position.interpolateGreatCircle(
                            0.5,
                            positionA,
                            positionB,
                            null);
                    }).toThrow();
                });
            });
        });

        describe('Computes a position along a rhumb path', function () {

            var positionA = new Position(37.52, 15.00,150);
            var positionB = new Position(45.48, 9.09,120);

            it('Compute with rhumb path', function () {
                var resultPosition = Position.interpolateRhumb(
                    0.5,
                    positionA,
                    positionB,
                    new Position());
                expect(resultPosition.latitude).toBeCloseTo(41.5);
                expect(resultPosition.longitude).toBeCloseTo(12.135);
                expect(resultPosition.altitude).toBeCloseTo(135);
            });

            it('Equal positions', function () {
                var resultPosition = Position.interpolateRhumb(
                    0.5,
                    positionA,
                    positionA,
                    new Position());
                expect(resultPosition).toEqual(positionA);
            });

            describe('Exceptions', function () {

                it('Position A not provided', function () {
                    expect(function () {
                        Position.interpolateRhumb(
                            0.5,
                            null,
                            positionB,
                            new Position());
                    }).toThrow();
                });

                it('Position B not provided', function () {
                    expect(function () {
                        Position.interpolateRhumb(
                            0.5,
                            positionA,
                            null,
                            new Position());
                    }).toThrow();
                });

                it('Result storage not provided', function () {
                    expect(function () {
                        Position.interpolateRhumb(
                            0.5,
                            positionA,
                            positionB,
                            null);
                    }).toThrow();
                });
            });
        });

        describe('Computes a position along a linear path', function () {

            var positionA = new Position(37.52, 15.00, 120);
            var positionB = new Position(45.48, 9.09, 150);

            it('Compute with linear path', function () {
                var resultPosition = Position.interpolateLinear(
                    0.5,
                    positionA,
                    positionB,
                    new Position());
                expect(resultPosition.latitude).toBeCloseTo(41.5);
                expect(resultPosition.longitude).toBeCloseTo(12.044);
                expect(resultPosition.altitude).toBeCloseTo(135);
            });

            it('Equal positions', function () {
                var resultPosition = Position.interpolateLinear(
                    0.5,
                    positionA,
                    positionA,
                    new Position());
                expect(resultPosition).toEqual(positionA);
            });

            describe('Exceptions', function () {

                it('Position A not provided', function () {
                    expect(function () {
                        Position.interpolateLinear(
                            0.5,
                            null,
                            positionB,
                            new Position());
                    }).toThrow();
                });

                it('Position B not provided', function () {
                    expect(function () {
                        Position.interpolateLinear(
                            0.5,
                            positionA,
                            null,
                            new Position());
                    }).toThrow();
                });

                it('Result storage not provided', function () {
                    expect(function () {
                        Position.interpolateLinear(
                            0.5,
                            positionA,
                            positionB,
                            null);
                    }).toThrow();
                });
            });
        });

        it("Returns a string representation of this position", function () {
            var position = new Position(37.52, 15.00, 120);
            expect(position.toString()).toEqual("(37.52\u00B0, 15\u00B0, 120)");
        });

    });

});
