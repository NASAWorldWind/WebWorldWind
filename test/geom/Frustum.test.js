/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Frustum',
    'src/geom/Matrix',
    'src/geom/Plane',
    'src/geom/Vec3'
], function (Frustum, Matrix, Plane, Vec3) {
    "use strict";

    describe("Frustum Tests", function () {

        describe("Frustum constructor", function () {

            it("Should construct the frustum correctly", function () {
                var left = new Plane(1, 2, 3, 4);
                var right = new Plane(5, 6, 7, 8);
                var bottom = new Plane(9, 10, 11, 12);
                var top = new Plane(12, 14, 15, 16);
                var near = new Plane(17, 18, 19, 20);
                var far = new Plane(21, 22, 23, 24);
                var frustum = new Frustum(left, right, bottom, top, near, far);

                expect(frustum._left).toEqual(left);
                expect(frustum._right).toEqual(right);
                expect(frustum._bottom).toEqual(bottom);
                expect(frustum._top).toEqual(top);
                expect(frustum._near).toEqual(near);
                expect(frustum._far).toEqual(far);
                expect(frustum._planes).toEqual([left, right, top, bottom, near, far]);
            });

            describe("Incorrect frustum", function () {

                it("Should throw an exception on missing parameters", function () {
                    expect(function () {
                        new Frustum();
                    }).toThrow();
                });

                it("Should throw an exception on less than 6 arguments", function () {
                    expect(function () {
                        var plane = new Plane(1, 2, 3, 4);
                        new Frustum(plane, plane, plane, plane, plane);
                    }).toThrow();
                });
            });
        });

        it("Should return all the properties defined as prototypes", function () {
            var left = new Plane(1, 2, 3, 4);
            var right = new Plane(5, 6, 7, 8);
            var bottom = new Plane(9, 10, 11, 12);
            var top = new Plane(12, 14, 15, 16);
            var near = new Plane(17, 18, 19, 20);
            var far = new Plane(21, 22, 23, 24);
            var frustum = new Frustum(left, right, bottom, top, near, far);

            expect(frustum.left).toEqual(left);
            expect(frustum.right).toEqual(right);
            expect(frustum.bottom).toEqual(bottom);
            expect(frustum.top).toEqual(top);
            expect(frustum.near).toEqual(near);
            expect(frustum.far).toEqual(far);
        });

        it("Creates a new frustum with each of its planes 1 meter from the center", function () {
            var unitFrustum = Frustum.unitFrustum();

            var left = new Plane(1, 0, 0, 1);
            var right = new Plane(-1, 0, 0, 1);
            var bottom = new Plane(0, 1, 1, 1);
            var top = new Plane(0, -1, 0, 1);
            var near = new Plane(0, 0, -1, 1);
            var far = new Plane(0, 0, 1, 1);

            expect(unitFrustum._left).toEqual(left);
            expect(unitFrustum._right).toEqual(right);
            expect(unitFrustum._bottom).toEqual(bottom);
            expect(unitFrustum._top).toEqual(top);
            expect(unitFrustum._near).toEqual(near);
            expect(unitFrustum._far).toEqual(far);
            expect(unitFrustum._planes).toEqual([left, right, top, bottom, near, far]);
        });

        describe("Extracts a frustum from a projection matrix", function () {


            it("Extracts the correct frustum properties", function () {
                var matrix = new Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
                var frustum = Frustum.fromProjectionMatrix(matrix);

                var leftExpected = new Plane(0.5025707110324167, 0.5743665268941905, 0.6461623427559643,
                    0.7179581586177382);
                var rightExpected = new Plane(0.5773502691896257, 0.5773502691896257, 0.5773502691896257,
                    0.5773502691896257);
                var bottomExpected = new Plane(0.5178918038835925, 0.575435337648436, 0.6329788714132796,
                    0.6905224051781232);
                var topExpected = new Plane(0.5773502691896258, 0.5773502691896258, 0.5773502691896258,
                    0.5773502691896258);
                var nearExpected = new Plane(0.5280168968110512, 0.5760184328847832, 0.6240199689585151,
                    0.672021505032247);
                var farExpected = new Plane(0.5773502691896258, 0.5773502691896258, 0.5773502691896258,
                    0.5773502691896258);

                expect(frustum._left).toEqual(leftExpected);
                expect(frustum._right).toEqual(rightExpected);
                expect(frustum._bottom).toEqual(bottomExpected);
                expect(frustum._top).toEqual(topExpected);
                expect(frustum._near).toEqual(nearExpected);
                expect(frustum._far).toEqual(farExpected);
                expect(frustum._planes).toEqual([leftExpected, rightExpected, topExpected, bottomExpected, nearExpected,
                    farExpected]);
            });

            it("Missing matrix", function () {
                expect(function () {
                    Frustum.fromProjectionMatrix();
                }).toThrow();
            });
        });

        describe("Tests the frustum methods with a predefined input Frustum", function () {
            var frustum;

            beforeEach(function () {
                var left = new Plane(1, 2, 3, 4);
                var right = new Plane(5, 6, 7, 8);
                var bottom = new Plane(9, 10, 11, 12);
                var top = new Plane(12, 14, 15, 16);
                var near = new Plane(17, 18, 19, 20);
                var far = new Plane(21, 22, 23, 24);
                frustum = new Frustum(left, right, bottom, top, near, far);
            });

            describe("Transforms this frustum by a specified matrix", function () {

                it("Frustum components transformed", function () {
                    var matrix = new Matrix(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
                    frustum.transformByMatrix(matrix);

                    var leftExpected = new Plane(30, 70, 110, 150);
                    var rightExpected = new Plane(70, 174, 278, 382);
                    var bottomExpected = new Plane(110, 278, 446, 614);
                    var topExpected = new Plane(149, 377, 605, 833);
                    var nearExpected = new Plane(190, 486, 782, 1078);
                    var farExpected = new Plane(230, 590, 950, 1310);

                    expect(frustum._left).toEqual(leftExpected);
                    expect(frustum._right).toEqual(rightExpected);
                    expect(frustum._bottom).toEqual(bottomExpected);
                    expect(frustum._top).toEqual(topExpected);
                    expect(frustum._near).toEqual(nearExpected);
                    expect(frustum._far).toEqual(farExpected);
                    expect(frustum._planes).toEqual([leftExpected, rightExpected, topExpected, bottomExpected,
                        nearExpected, farExpected]);
                });

                it("Missing matrix", function () {
                    expect(function () {
                        frustum.transformByMatrix();
                    }).toThrow();
                });
            });

            it("Normalizes the plane vectors of the planes composing this frustum", function () {
                var normalized = frustum.normalize();

                var leftExpected = new Plane(0.2672612419124244, 0.5345224838248488, 0.8017837257372732,
                    1.0690449676496976);
                var rightExpected = new Plane(0.4767312946227962, 0.5720775535473553, 0.6674238124719146,
                    0.7627700713964739);
                var bottomExpected = new Plane(0.5178918038835925, 0.575435337648436, 0.6329788714132796,
                    0.6905224051781232);
                var topExpected = new Plane(0.5048437942940055, 0.5889844266763398, 0.6310547428675068,
                    0.673125059058674);
                var nearExpected = new Plane(0.5447151356952012, 0.5767572025008013, 0.6087992693064014,
                    0.6408413361120014);
                var farExpected = new Plane(0.5507279164562449, 0.5769530553351137, 0.6031781942139824,
                    0.6294033330928512);

                expect(normalized._left).toEqual(leftExpected);
                expect(normalized._right).toEqual(rightExpected);
                expect(normalized._bottom).toEqual(bottomExpected);
                expect(normalized._top).toEqual(topExpected);
                expect(normalized._near).toEqual(nearExpected);
                expect(normalized._far).toEqual(farExpected);
            });

            describe("Checks if a frustum contains a point", function () {

                it("The frustum contains the point", function () {
                    var point = new Vec3(1, 2, 3);
                    expect(frustum.containsPoint(point)).toEqual(true);
                });

                it("The frustum does not contain the point", function () {
                    var point = new Vec3(-1, -2, -3);
                    expect(frustum.containsPoint(point)).toEqual(false);
                });

                it("Should throw an exception on missing point", function () {
                    expect(function () {
                        frustum.containsPoint();
                    }).toThrow();
                });
            });

            describe("Checks if a frustum intersects a segment", function () {

                it("The frustum intersects the segment", function () {
                    var pointA = new Vec3(1, 2, 3);
                    var pointB = new Vec3(4, 5, 6);
                    expect(frustum.intersectsSegment(pointA, pointB)).toEqual(true);
                });

                it("The frustum does not intersect the segment on two different points", function () {
                    var pointA = new Vec3(-1, -2, -3);
                    var pointB = new Vec3(-4, -5, -6);
                    expect(frustum.intersectsSegment(pointA, pointB)).toEqual(false);
                });

                it("The frustum does not intersect the segment because points are equal", function () {
                    var pointA = new Vec3(-1, -2, -3);
                    expect(frustum.intersectsSegment(pointA, pointA)).toEqual(false);
                });

                it("Should throw an exception on missing point", function () {
                    expect(function () {
                        var pointA = new Vec3(-1, -2, -3);
                        frustum.intersectsSegment(pointA);
                    }).toThrow();
                });
            });
        });

    });
});