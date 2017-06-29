/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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
                var position = Position.ZERO;
                var positionTarget = new Position(37.52, 15.08, 150);

                position.copy(positionTarget);
                expect(position.latitude).toEqual(37.52);
                expect(position.longitude).toEqual(15.08);
                expect(position.altitude).toEqual(150);
            });

            it("Should throw an exception on missing position input", function () {
                expect(function () {
                    var position = Position.ZERO;
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
                    Position.ZERO);
                expect(resultPosition.latitude).toBeCloseTo(41.537);
                expect(resultPosition.longitude).toBeCloseTo(12.227);
                expect(resultPosition.altitude).toBeCloseTo(135);
            });

            it('Equal positions', function () {
                var resultPosition = Position.interpolateGreatCircle(
                    0.5,
                    positionA,
                    positionA,
                    Position.ZERO);
                expect(resultPosition).toEqual(positionA);
            });

            describe('Exceptions', function () {

                it('Position A not provided', function () {
                    expect(function () {
                        Position.interpolateGreatCircle(
                            0.5,
                            null,
                            positionB,
                            Position.ZERO);
                    }).toThrow();
                });

                it('Position B not provided', function () {
                    expect(function () {
                        Position.interpolateGreatCircle(
                            0.5,
                            positionA,
                            null,
                            Position.ZERO);
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
                    Position.ZERO);
                expect(resultPosition.latitude).toBeCloseTo(41.5);
                expect(resultPosition.longitude).toBeCloseTo(12.135);
                expect(resultPosition.altitude).toBeCloseTo(135);
            });

            it('Equal positions', function () {
                var resultPosition = Position.interpolateRhumb(
                    0.5,
                    positionA,
                    positionA,
                    Position.ZERO);
                expect(resultPosition).toEqual(positionA);
            });

            describe('Exceptions', function () {

                it('Position A not provided', function () {
                    expect(function () {
                        Position.interpolateRhumb(
                            0.5,
                            null,
                            positionB,
                            Position.ZERO);
                    }).toThrow();
                });

                it('Position B not provided', function () {
                    expect(function () {
                        Position.interpolateRhumb(
                            0.5,
                            positionA,
                            null,
                            Position.ZERO);
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
                    Position.ZERO);
                expect(resultPosition.latitude).toBeCloseTo(41.5);
                expect(resultPosition.longitude).toBeCloseTo(12.044);
                expect(resultPosition.altitude).toBeCloseTo(135);
            });

            it('Equal positions', function () {
                var resultPosition = Position.interpolateLinear(
                    0.5,
                    positionA,
                    positionA,
                    Position.ZERO);
                expect(resultPosition).toEqual(positionA);
            });

            describe('Exceptions', function () {

                it('Position A not provided', function () {
                    expect(function () {
                        Position.interpolateLinear(
                            0.5,
                            null,
                            positionB,
                            Position.ZERO);
                    }).toThrow();
                });

                it('Position B not provided', function () {
                    expect(function () {
                        Position.interpolateLinear(
                            0.5,
                            positionA,
                            null,
                            Position.ZERO);
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
