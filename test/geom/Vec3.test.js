/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Vec3'
], function (Vec3) {
    "use strict";

    describe("Vec3Test", function () {

        it("Should have the correct three components", function () {
            var vec3 = new Vec3(9, 8, 7);
            expect(vec3[0]).toEqual(9);
            expect(vec3[1]).toEqual(8);
            expect(vec3[2]).toEqual(7);
        });


        it("Should have three zero components", function () {
            var vec3Zero = Vec3.ZERO;
            expect(vec3Zero[0]).toEqual(0);
            expect(vec3Zero[1]).toEqual(0);
            expect(vec3Zero[2]).toEqual(0);
        });


        it("Should return the average of a vector", function () {
            var vec3_a = new Vec3(1, 2, 3);
            var vec3_b = new Vec3(3, 2, 1);
            var vec3_average = Vec3.average([vec3_a, vec3_b], Vec3.ZERO);
            expect(vec3_average).toEqual(new Vec3(2, 2, 2));
        });


        it("Should return the average a specified array of points packed into a single array", function () {
            var pointArray = [1, 2, 3, 3, 2, 1];
            expect(Vec3.averageOfBuffer(pointArray, Vec3.ZERO)).toEqual(new Vec3(2, 2, 2));
        });

        describe("Test the colinearity of three arrays", function () {

            it("Vectors are colinear", function () {
                var vec3_a = new Vec3(2, 4, 6);
                var vec3_b = new Vec3(4, 8, 12);
                var vec3_c = new Vec3(8, 16, 24);
                expect(Vec3.areColinear(vec3_a, vec3_b, vec3_c)).toEqual(true);
            });

            it("Vectors are not colinear", function () {
                var vec3_a = new Vec3(1, 5, 7);
                var vec3_b = new Vec3(4, 9, 11);
                var vec3_c = new Vec3(8, 16, 24);
                expect(Vec3.areColinear(vec3_a, vec3_b, vec3_c)).toEqual(false);
            });
        });

        it("Computes triangle normals", function () {
            var vec3_a = new Vec3(0, 0, 0);
            var vec3_b = new Vec3(1, 0, 0);
            var vec3_c = new Vec3(1, 1, 0);
            expect(Vec3.computeTriangleNormal(vec3_a, vec3_b, vec3_c)).toEqual(new Vec3(0, 0, 1));
        });

        describe("Finds three non-colinear points in an array of coordinates", function () {

            it("Finds the three points", function () {
                var coords = [2, 4, 6, 4, 8, 12, 8, 16, 24, 1, 5, 7, 2, 1, 1, 2, 11, 0];
                var expected = [
                    new Vec3(2, 4, 6),
                    new Vec3(4, 8, 12),
                    new Vec3(1, 5, 7)
                ];
                expect(Vec3.findThreeIndependentVertices(coords, 0)).toEqual(expected);
            });

            it("Does not find three points", function () {
                var coords = [2, 4, 6, 4, 8, 12, 8, 16, 24];
                expect(Vec3.findThreeIndependentVertices(coords, 0)).toEqual(null);
            });

            it("Return null on empty coordinates", function () {
                expect(Vec3.findThreeIndependentVertices([], 0)).toEqual(null);
            });
        });

        it("Finds three independent vertices", function () {
            var nonColinearPoints = Vec3.findThreeIndependentVertices([0, 0, 0, 1, 0, 0, 1, 1, 0], 3);
            var expectednonColinearPoints = [
                new Vec3(0, 0, 0),
                new Vec3(1, 0, 0),
                new Vec3(1, 1, 0)
            ];

            for (var i = 0; i < nonColinearPoints.length; i++) {
                expect(nonColinearPoints[i]).toEqual(expectednonColinearPoints[i]);
            }

        });

        describe('#computeBufferNormal', function () {

            it("Buffer normal with stride of 1", function () {
                var bufferNormal = Vec3.computeBufferNormal([0, 0, 0, 1, 0, 0, 1, 1, 0], 1);
                expect(bufferNormal).toEqual(new Vec3(-1, 0, 0));
            });

            it("Buffer normal with stride of 3", function () {
                var bufferNormal = Vec3.computeBufferNormal([0, 0, 0, 1, 0, 0, 1, 1, 0], 3);
                expect(bufferNormal).toEqual(new Vec3(0, 0, 1));
            });
        });


        describe('#Set components', function () {

            it('sets vector equal to different vector', function () {
                var vec3 = Vec3.ZERO;
                vec3.set(2, 3, 4);
                expect(vec3).toEqual(new Vec3(2, 3, 4));
            });

            it('sets vector and verify by components', function () {
                var vec3 = Vec3.ZERO;
                vec3.set(5, 6, 7);
                expect(vec3[0]).toEqual(5);
                expect(vec3[1]).toEqual(6);
                expect(vec3[2]).toEqual(7);
            })
        });

        it("Copies the component of a Vec3", function () {
            var destination = Vec3.ZERO;
            var source = new Vec3(2, 3, 4);
            destination.copy(source);
            expect(destination).toEqual(source);
        });

        describe('#Vectors quality', function () {

            it("Two equal vectors", function () {
                var vec3_a = new Vec3(2, 3, 4);
                var vec3_b = new Vec3(2, 3, 4);
                expect(vec3_a.equals(vec3_b)).toEqual(true);

            });

            it("Two unequal vectors", function () {
                var vec3_a = new Vec3(2, 3, 4);
                var vec3_b = new Vec3(4, 5, 6);
                expect(vec3_a.equals(vec3_b)).toEqual(false);
            });
        });

        it("Add a vector to the current one", function () {
            var vec3_a = new Vec3(2, 3, 4);
            var vec3_b = new Vec3(1, 2, 3);
            expect(vec3_a.add(vec3_b)).toEqual(new Vec3(3, 5, 7));
        });

        it("Subtract a vector from the current one", function () {
            var vec3_a = new Vec3(2, 3, 4);
            var vec3_b = new Vec3(1, 2, 3);
            expect(vec3_a.subtract(vec3_b)).toEqual(new Vec3(1, 1, 1));
        });

        it("Multiplies current vector by a scalar", function () {
            var vec3 = new Vec3(2, 3, 4);
            var expected_vec3 = vec3.multiply(3);
            expect(expected_vec3).toEqual(new Vec3(6, 9, 12));
        });


        describe('#Scalar division', function () {

            it("Division with integer output", function () {
                var vec3 = new Vec3(6, 8, 4);
                var expected_vec3 = vec3.divide(2);
                expect(expected_vec3).toEqual(new Vec3(3, 4, 2));
            });

            it("Divides with non integer output", function () {
                var vec3 = new Vec3(6, 8, 4);
                var expected_vec3 = vec3.divide(4);
                expect(expected_vec3).toEqual(new Vec3(1.5, 2, 1));
            });
        });

        it("Multiplies current vector by 4x4 Matrix", function () {
            var vec3 = new Vec3(2, 3, 4);
            var matrix = [2, 2, 2, 2, 4, 4, 4, 4, 8, 8, 8, 8, 10, 10, 10, 10];
            var expected_vec3 = new Vec3(0.2, 0.4, 0.8);
            expect(vec3.multiplyByMatrix(matrix)).toEqual(expected_vec3);
        });

        describe('#Vector interpolation', function () {

            it("Interpolates with an integer weight", function () {
                var vec3_a = new WorldWind.Vec3(2, 3, 4);
                var vec3_b = new WorldWind.Vec3(4, 6, 8);
                var expected_vec3 = new WorldWind.Vec3(12, 18, 24);
                expect(vec3_a.mix(vec3_b, 5)).toEqual(expected_vec3);
            });

            it("Interpolates with a non integer weight", function () {
                var vec3_a = new WorldWind.Vec3(2, 3, 4);
                var vec3_b = new WorldWind.Vec3(4, 6, 8);
                var expected_vec3 = new WorldWind.Vec3(3, 4.5, 6);
                expect(vec3_a.mix(vec3_b, 0.5)).toEqual(expected_vec3);
            });
        });

        it("Negates the components of the current vector", function () {
            var vec3_a = new WorldWind.Vec3(2, 3, 4);
            var expected_vec3 = new WorldWind.Vec3(-2, -3, -4);
            expect(vec3_a.negate()).toEqual(expected_vec3);
        });

        it("Computes the scalar dot product of the current vector and a specified one", function () {
            var vec3_a = new WorldWind.Vec3(2, 3, 4);
            var vec3_b = new WorldWind.Vec3(4, 5, 6);
            var expected = 47;
            expect(vec3_a.dot(vec3_b)).toEqual(expected);
        });

        it("Computes the cross product of this vector and a specified vector", function () {
            var vec3_a = new WorldWind.Vec3(2, 3, 4);
            var vec3_b = new WorldWind.Vec3(4, 5, 6);
            var expected_vec3 = new Vec3(-2, 4, -2);
            expect(vec3_a.cross(vec3_b)).toEqual(expected_vec3);
        });

        it("Computes the squared magnitude of this vector", function () {
            var vec3_a = new WorldWind.Vec3(2, 3, 4);
            expect(vec3_a.magnitudeSquared()).toEqual(29);
        });

        describe("#Magnitude of a vector", function () {

            it("Computes the magnitude with full positive components", function () {
                var vec3 = new WorldWind.Vec3(2, 4, 4);
                expect(vec3.magnitude()).toEqual(6);
            });

            it("Computes the magnitude with a negative components", function () {
                var vec3 = new WorldWind.Vec3(3, -4, 0);
                expect(vec3.magnitude()).toEqual(5);
            });
        });

        it("Normalize this vector to a unit vector", function () {
            var vec3 = new WorldWind.Vec3(2, 4, 4);
            var expected_vec3 = new Vec3(1 / 3, 2 / 3, 2 / 3);
            expect(vec3.normalize()).toEqual(expected_vec3);
        });

        describe("#distanceToSquared", function () {

            it("Squared distance from a vector to another one", function () {
                var vec3_a = new WorldWind.Vec3(2, 3, 4);
                var vec3_b = new WorldWind.Vec3(4, 5, 6);
                expect(vec3_a.distanceToSquared(vec3_b)).toEqual(12);
            });

            it("Squared distance from a vector to itself", function () {
                var vec3_a = new WorldWind.Vec3(2, 3, 4);
                expect(vec3_a.distanceToSquared(vec3_a)).toEqual(0);
            });
        });

        it("Computes the distance from a vector to a specified vector", function () {
            var vec3_a = new WorldWind.Vec3(1, 2, 3);
            var vec3_b = new WorldWind.Vec3(2, 4, 6);
            expect(vec3_a.distanceTo(vec3_b)).toEqual(Math.sqrt(14));
        });

        it("Swap the components of the current vector with another one", function () {
            var vec3_a = new WorldWind.Vec3(1, 2, 3);
            var vec3_b = new WorldWind.Vec3(2, 4, 6);
            vec3_a.swap(vec3_b);
            expect(vec3_a).toEqual(new WorldWind.Vec3(2, 4, 6));
            expect(vec3_b).toEqual(new WorldWind.Vec3(1, 2, 3));
        });


        it("Returns a string representation of this vector", function () {
            var vec3 = new WorldWind.Vec3(1, 2, 3);
            expect(vec3.toString()).toEqual("(1, 2, 3)");
        });

    });
})
;