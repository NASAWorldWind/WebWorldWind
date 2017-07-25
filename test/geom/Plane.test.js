/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Plane',
    'src/geom/Line',
    'src/geom/Vec3'
], function (Plane, Line, Vec3) {
    "use strict";

    describe("Plane Tests", function () {

        it("Should construct a Plane correctly", function () {
            var plane = new Plane(1, 2, 3, 4);

            expect(plane.normal).toEqual(new Vec3(1, 2, 3));
            expect(plane.distance).toEqual(4);
        });

        describe("Computes a plane that passes through the specified three points", function () {

            it("Computes the plane correctly", function () {
                var pa = new Vec3(1, 5, 7);
                var pb = new Vec3(4, 9, 11);
                var pc = new Vec3(8, 16, 24);

                var result = Plane.fromPoints(pa, pb, pc);

                expect(result.normal[0]).toBeCloseTo(0.713);
                expect(result.normal[1]).toBeCloseTo(-0.684);
                expect(result.normal[2]).toBeCloseTo(0.148);
                expect(result.distance).toBeCloseTo(1.665);
            });

            it("Undefined plane on colinear vector", function () {
                var pa = new Vec3(2, 4, 6);
                var pb = new Vec3(4, 8, 12);
                var pc = new Vec3(8, 16, 24);

                var result = Plane.fromPoints(pa, pb, pc);

                expect(result.normal[0]).toEqual(NaN);
                expect(result.normal[1]).toEqual(NaN);
                expect(result.normal[2]).toEqual(NaN);
                expect(result.distance).toEqual(NaN);
            });

            describe("Exceptions on missing Points", function () {

                it("Missing Point a", function () {
                    expect(function () {
                        var pa = null;
                        var pb = new Vec3(4, 5, 6);
                        var pc = new Vec3(7, 8, 9);

                        Plane.fromPoints(pa, pb, pc);
                    }).toThrow();
                });

                it("Missing Point b", function () {
                    expect(function () {
                        var pa = new Vec3(1, 2, 3);
                        var pb = null;
                        var pc = new Vec3(7, 8, 9);

                        Plane.fromPoints(pa, pb, pc);
                    }).toThrow();
                });

                it("Missing Point c", function () {
                    expect(function () {
                        var pa = new Vec3(1, 2, 3);
                        var pb = new Vec3(4, 5, 6);
                        var pc = null;

                        Plane.fromPoints(pa, pb, pc);
                    }).toThrow();
                });
            });

        });

        describe("Computes the dot product of this plane's normal vector with a specified vector", function () {

            it("Computes the product correctly", function () {
                var plane = new Plane(1, 2, 3, 4);
                var vector = new Vec3(5, 6, 7);

                var result = plane.dot(vector);

                expect(result).toEqual(42);
            });

            it("Exception on missing vector", function () {
                expect(function () {
                    var plane = new Plane(1, 2, 3, 4);
                    var vector = null;
                    plane.dot(vector);
                }).toThrow();
            });
        });

        describe("Computes the distance between this plane and a point", function () {

            it("Computes the distance correctly", function () {
                var plane = new Plane(1, 2, 3, 4);
                var point = new Vec3(5, 6, 7);

                var result = plane.distanceToPoint(point);

                expect(result).toEqual(42);
            });

            it("Exception on missing point", function () {
                expect(function () {
                    var plane = new Plane(1, 2, 3, 4);
                    var point = null;
                    plane.distanceToPoint(point);
                }).toThrow();
            });
        });

        describe("Transforms this plane by a specified matrix", function () {

            it("Transforms the plane correctly", function () {
                var plane = new Plane(1, 2, 3, 4);
                var mockMatrix = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

                plane.transformByMatrix(mockMatrix);

                expect(plane.normal).toEqual(new Vec3(30, 70, 110));
                expect(plane.distance).toEqual(150);
            });

            it("Exception on missing matrix", function () {
                expect(function () {
                    var plane = new Plane(1, 2, 3, 4);
                    var matrix = null;
                    plane.transformByMatrix(matrix);
                }).toThrow();
            });
        });

        describe("Normalizes the components of this plane", function () {

            it("Return normalized components", function () {
                var plane = new Plane(1, 2, 3, 4);

                plane.normalize();

                expect(plane.normal[0]).toBeCloseTo(0.267);
                expect(plane.normal[1]).toBeCloseTo(0.534);
                expect(plane.normal[2]).toBeCloseTo(0.801);
                expect(plane.distance).toBeCloseTo(1.069);
            });

            it("Return this without normalization on null magnitude", function () {
                var plane = new Plane(0, 0, 0, 4);

                plane.normalize();

                expect(plane.normal).toEqual(new Vec3(0, 0, 0));
                expect(plane.distance).toEqual(4);
            });

        });

        describe("Determines whether a specified line segment intersects this plane", function () {

            it("The line segment intersects the plane", function () {
                var plane = new Plane(-1, 1, 2, 1);
                var pa = new Vec3(2, 3, -1);
                var pb = new Vec3(2, 3, 1);

                var result = plane.intersectsSegment(pa, pb);

                expect(result).toBe(true);
            });

            it("The line segment does not intersects the plane", function () {
                var plane = new Plane(1, 2, 3, 4);
                var pa = new Vec3(1, 2, 3);
                var pb = new Vec3(4, 5, 6);

                var result = plane.intersectsSegment(pa, pb);

                expect(result).toBe(false);
            });
        });

        describe("Determines whether two points are on the same side of this plane", function () {

            it("Points on the negative side", function () {
                var plane = new Plane(0, 1, 2, 3);
                var pa = new Vec3(4, 5, -6);
                var pb = new Vec3(7, 8, -9);

                var result = plane.onSameSide(pa, pb);

                expect(result).toBe(-1);
            });

            it("Points on the positive side", function () {
                var plane = new Plane(0, 1, 2, 3);
                var pa = new Vec3(4, 5, 6);
                var pb = new Vec3(7, 8, 9);

                var result = plane.onSameSide(pa, pb);

                expect(result).toBe(1);
            });

            it("Points on the opposite side", function () {
                var plane = new Plane(-1, 1, 2, 1);
                var pa = new Vec3(2, 3, -1);
                var pb = new Vec3(2, 3, 1);

                var result = plane.onSameSide(pa, pb);

                expect(result).toBe(0);
            });

            describe("Exceptions on missing points", function () {

                it("Missing point a", function () {
                    expect(function () {
                        var plane = new Plane(0, 1, 2, 3);
                        var pa = null;
                        var pb = new Vec3(7, 8, 9);
                        plane.onSameSide(pa, pb);
                    }).toThrow();
                });

                it("Missing point b", function () {
                    expect(function () {
                        var plane = new Plane(0, 1, 2, 3);
                        var pa = new Vec3(4, 5, 6);
                        var pb = null;
                        plane.onSameSide(pa, pb);
                    }).toThrow();
                });
            });
        });

        describe("Clips a line segment to this plane", function () {

            it("Clips correctly and set the projection of the segment onto the plane", function () {
                var plane = new Plane(-1, 1, 2, 1);
                var pa = new Vec3(1, 3, -1);
                var pb = new Vec3(5, 3, -1);

                var result = plane.clip(pa, pb);

                expect(result).toEqual([new Vec3(1, 3, -1), new Vec3(2, 3, -1)]);
            });

            it("Line is coincident with the plane", function () {
                var plane = new Plane(-1, 1, 2, 1);
                var pa = new Vec3(2, 3, -1);
                var pb = new Vec3(2, 3, 1);

                var result = plane.clip(pa, pb);

                expect(result).toEqual([pa, pb]);
            });

            it("Points are equal", function () {
                var plane = new Plane(0, 1, 2, 3);
                var pa = new Vec3(4, 5, 6);
                var pb = new Vec3(4, 5, 6);

                var result = plane.clip(pa, pb);

                expect(result).toBe(null);
            });

            it("line is not coincident with the plane", function () {
                var plane = new Plane(0, 1, 2, 3);
                var pa = new Vec3(4, 5, 6);
                var pb = new Vec3(7, 8, 9);

                var result = plane.clip(pa, pb);

                expect(result).toBe(null);
            });

            it("Points on the opposite side", function () {
                var plane = new Plane(-1, 1, 2, 1);
                var pa = new Vec3(2, 3, -1);
                var pb = new Vec3(2, 3, 1);

                var result = plane.onSameSide(pa, pb);

                expect(result).toBe(0);
            });

            describe("Exceptions on missing points", function () {

                it("Missing point a", function () {
                    expect(function () {
                        var plane = new Plane(0, 1, 2, 3);
                        var pa = null;
                        var pb = new Vec3(7, 8, 9);
                        plane.clip(pa, pb);
                    }).toThrow();
                });

                it("Missing point b", function () {
                    expect(function () {
                        var plane = new Plane(0, 1, 2, 3);
                        var pa = new Vec3(4, 5, 6);
                        var pb = null;
                        plane.clip(pa, pb);
                    }).toThrow();
                });
            });
        });
    });

});
