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


        it("Test the colinearity of three arrays", function () {
            var a = new Vec3(2, 4, 6);
            var b = new Vec3(4, 8, 12);
            var c = new Vec3(8, 16, 24);
            expect(Vec3.areColinear(a, b, c)).toEqual(true);
        });

        it("Compute triangle normals", function () {
            var a = new Vec3(0, 0, 0);
            var b = new Vec3(1, 0, 0);
            var c = new Vec3(1, 1, 0);
            expect(Vec3.computeTriangleNormal(a, b, c)).toEqual(new Vec3(0, 0, 1));
        });

        it("Finds three non-colinear points in an array of coordinates", function () {
            var a = new Vec3(0, 0, 0);
            var b = new Vec3(1, 0, 0);
            var c = new Vec3(1, 1, 0);
            expect(Vec3.computeTriangleNormal(a, b, c)).toEqual(new Vec3(0, 0, 1));
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

        it("Computer buffer normals", function () {
            var bufferNormal = Vec3.computeBufferNormal([0, 0, 0, 1, 0, 0, 1, 1, 0], 1);
            expect(bufferNormal).toEqual(new Vec3(-1, 0, 0));

            bufferNormal = Vec3.computeBufferNormal([0, 0, 0, 1, 0, 0, 1, 1, 0], 3);
            expect(bufferNormal).toEqual(new Vec3(0, 0, 1));

        });

        it("Set components of the vector", function () {
            var vec = Vec3.ZERO;
            vec.set(2, 3, 4);
            expect(vec).toEqual(new Vec3(2, 3, 4));

            vec.set(5, 6, 7);
            expect(vec[0]).toEqual(5);
            expect(vec[1]).toEqual(6);
            expect(vec[2]).toEqual(7);
        });


        it("Copies the component of a Vec3", function () {
            var destination = Vec3.ZERO;
            var source = new Vec3(2, 3, 4);
            destination.copy(source);
            expect(destination).toEqual(source);
        });

        it("Check if two vectors are equal", function () {
            var vec_a = new Vec3(2, 3, 4);
            var vec_b = new Vec3(2, 3, 4);
            expect(vec_a.equals(vec_b)).toEqual(true);

            vec_b = new Vec3(4, 5, 6);
            expect(vec_a.equals(vec_b)).toEqual(false);
        });

        it("Add a vector to the current one", function () {
            var vec_a = new Vec3(2, 3, 4);
            var vec_b = new Vec3(1, 2, 3);
            expect(vec_a.add(vec_b)).toEqual(new Vec3(3, 5, 7));
        });

        it("Subtract a vector from the current one", function () {
            var vec_a = new Vec3(2, 3, 4);
            var vec_b = new Vec3(1, 2, 3);
            expect(vec_a.subtract(vec_b)).toEqual(new Vec3(1, 1, 1));
        });

        it("Multiplies current vector by a scalar", function () {
            var vec = new Vec3(2, 3, 4);
            var expected = vec.multiply(3);
            expect(expected).toEqual(new Vec3(6, 9, 12));
        });

        it("Divides current vector by a scalar", function () {
            var vec = new Vec3(6, 8, 4);

            var expected = vec.divide(2);
            expect(expected).toEqual(new Vec3(3, 4, 2));

            expected = vec.divide(4);
            expect(expected).toEqual(new Vec3(0.75, 1, 0.5));
        });

        it("Multiplies current vector by 4x4 Matrix", function () {
            var vec = new Vec3(2, 3, 4);
            var matrix = [2, 2, 2, 2, 4, 4, 4, 4, 8, 8, 8, 8, 10, 10, 10, 10];
            var expected = new Vec3(0.2, 0.4, 0.8);
            expect(vec.multiplyByMatrix(matrix)).toEqual(expected);
        });


        it("Interpolates a specified vector with this vector", function () {
            var vec_a = new WorldWind.Vec3(2, 3, 4);
            var vec_b = new WorldWind.Vec3(4, 6, 8);
            var expected = new WorldWind.Vec3(3, 4.5, 6);
            expect(vec_a.mix(vec_b, 0.5)).toEqual(expected);

            expected = new WorldWind.Vec3(8, 12, 16);
            expect(vec_a.mix(vec_b, 5)).toEqual(expected);

        });

        it("Negates the components of the current vector", function () {
            var vec_a = new WorldWind.Vec3(2, 3, 4);
            var expected = new WorldWind.Vec3(-2, -3, -4);
            expect(vec_a.negate()).toEqual(expected);
        });

        it("Computes the scalar dot product of the current vector and a specified one", function () {
            var vec_a = new WorldWind.Vec3(2, 3, 4);
            var vec_b = new WorldWind.Vec3(4, 5, 6);
            var expected = 47;
            expect(vec_a.dot(vec_b)).toEqual(expected);
        });

        it("Computes the cross product of this vector and a specified vector", function () {
            var vec_a = new WorldWind.Vec3(2, 3, 4);
            var vec_b = new WorldWind.Vec3(4, 5, 6);
            var expected = new Vec3(-2, 4, -2);
            expect(vec_a.cross(vec_b)).toEqual(expected);
        });

        it("Computes the squared magnitude of this vector", function () {
            var vec_a = new WorldWind.Vec3(2, 3, 4);
            expect(vec_a.magnitudeSquared()).toEqual(29);
        });

        it("Computes the magnitude of this vector", function () {
            var vec_a = new WorldWind.Vec3(2, 4, 4);
            expect(vec_a.magnitude()).toEqual(6);

            vec_a = new WorldWind.Vec3(3, -4, 0);
            expect(vec_a.magnitude()).toEqual(5);
        });

        it("Normalize this vector to a unit vector", function () {
            var vec = new WorldWind.Vec3(2, 4, 4);
            var expected = new Vec3(1/3, 2/3, 2/3);
            expect(vec.normalize()).toEqual(expected);
        });

        it("Computes the squared distance from a vector to a specified vector", function () {
            var vec_a = new WorldWind.Vec3(2, 3, 4);
            var vec_b = new WorldWind.Vec3(4, 5, 6);
            expect(vec_a.distanceToSquared(vec_b)).toEqual(12);

            expect(vec_a.distanceToSquared(vec_a)).toEqual(0);
        });

        it("Computes the distance from a vector to a specified vector", function () {
            var vec_a = new WorldWind.Vec3(1, 2, 3);
            var vec_b = new WorldWind.Vec3(2, 4, 6);
            expect(vec_a.distanceTo(vec_b)).toEqual(Math.sqrt(14));
        });

        it("Swap the components of the current vector with another one", function () {
            var vec_a = new WorldWind.Vec3(1, 2, 3);
            var vec_b = new WorldWind.Vec3(2, 4, 6);
            vec_a.swap(vec_b);
            expect(vec_a).toEqual(new WorldWind.Vec3(2, 4, 6));
            expect(vec_b).toEqual(new WorldWind.Vec3(1, 2, 3));
        });


        it("Returns a string representation of this vector", function () {
            var vec_a = new WorldWind.Vec3(1, 2, 3);
            expect(vec_a.toString()).toEqual("(1, 2, 3)");

        });



    });
});