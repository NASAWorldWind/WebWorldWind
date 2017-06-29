/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Vec2'
], function (Vec2) {
    "use strict";

    describe("Vec2Test", function () {

        it("Should have the correct two components", function () {
            var vec2 = new Vec2(9, 8);
            expect(vec2[0]).toEqual(9);
            expect(vec2[1]).toEqual(8);
        });

        describe("#Set components", function () {

            it('sets vector equal to different vector', function () {
                var vec2 = new Vec2();
                vec2.set(2, 3);
                expect(vec2).toEqual(new Vec2(2, 3));
            });

            it('sets vector and verify by components', function () {
                var vec2 = new Vec2();
                vec2.set(5, 6);
                expect(vec2[0]).toEqual(5);
                expect(vec2[1]).toEqual(6);
            });
        });

        it("Copies the component of a Vec2", function () {
            var destination = new Vec2();
            var source = new Vec2(2, 3);
            destination.copy(source);
            expect(destination).toEqual(source);
        });

        describe("#Vectors equality", function () {

            it("Two equal vectors", function () {
                var vec2_a = new Vec2(2, 3);
                var vec2_b = new Vec2(2, 3);
                expect(vec2_a.equals(vec2_b)).toEqual(true);
            });

            it("Two unequal vectors", function () {
                var vec2_a = new Vec2(2, 3);
                var vec2_b = new Vec2(4, 5);
                expect(vec2_a.equals(vec2_b)).toEqual(false);
            });
        });

        it("Should return the average of a vector", function () {
            var vec2_a = new Vec2(1, 2);
            var vec2_b = new Vec2(3, 2);
            var vec2_average = Vec2.average([vec2_a, vec2_b], new Vec2());
            expect(vec2_average).toEqual(new Vec2(2, 2));
        });

        it("Add a vector to the current one", function () {
            var vec2_a = new Vec2(2, 3);
            var vec2_b = new Vec2(1, 2);
            expect(vec2_a.add(vec2_b)).toEqual(new Vec2(3, 5));
        });

        it("Subtract a vector from the current one", function () {
            var vec2_a = new Vec2(2, 3);
            var vec2_b = new Vec2(1, 2);
            expect(vec2_a.subtract(vec2_b)).toEqual(new Vec2(1, 1));
        });

        it("Multiplies current vector by a scalar", function () {
            var vec2 = new Vec2(2, 3);
            var expected_Vec2 = vec2.multiply(3);
            expect(expected_Vec2).toEqual(new Vec2(6, 9));
        });


        describe("#Vector division", function () {

            it("Division by scalar with integer output", function () {
                var vec2 = new Vec2(6, 8);
                var expected_vec2 = vec2.divide(2);
                expect(expected_vec2).toEqual(new Vec2(3, 4));
            });

            it("Division by scalar with non integer output", function () {
                var vec2 = new Vec2(6, 8);
                var expected_vec2 = vec2.divide(4);
                expect(expected_vec2).toEqual(new Vec2(1.5, 2));
            });
        });

        describe("#Vector interpolation", function () {

            it("Interpolates with an integer weight", function () {
                var vec2_a = new WorldWind.Vec2(2, 3);
                var vec2_b = new WorldWind.Vec2(4, 6);
                var expected_vec2 = new WorldWind.Vec2(12, 18);
                expect(vec2_a.mix(vec2_b, 5)).toEqual(expected_vec2);
            });

            it("Interpolates with a non integer weight", function () {
                var vec2_a = new WorldWind.Vec2(2, 3);
                var vec2_b = new WorldWind.Vec2(4, 6);
                var expected_vec2 = new WorldWind.Vec2(3, 4.5);
                expect(vec2_a.mix(vec2_b, 0.5)).toEqual(expected_vec2);
            });

        });

        it("Negates the components of the current vector", function () {
            var vec2_a = new WorldWind.Vec2(2, 3);
            var expected_vec2 = new WorldWind.Vec2(-2, -3);
            expect(vec2_a.negate()).toEqual(expected_vec2);
        });

        it("Computes the scalar dot product of the current vector and a specified one", function () {
            var vec2_a = new WorldWind.Vec2(2, 3);
            var vec2_b = new WorldWind.Vec2(4, 5);
            var expected = 23;
            expect(vec2_a.dot(vec2_b)).toEqual(expected);
        });

        it("Computes the squared magnitude of this vector", function () {
            var vec2_a = new WorldWind.Vec2(2, 3);
            expect(vec2_a.magnitudeSquared()).toEqual(13);
        });

        describe("#Magnitude of a vector", function () {

            it("Computes the magnitude with full positive components", function () {
                var vec2 = new WorldWind.Vec2(6, 8);
                expect(vec2.magnitude()).toEqual(10);
            });

            it("Computes the magnitude with a negative component", function () {
                var vec2 = new WorldWind.Vec2(4, -3);
                expect(vec2.magnitude()).toEqual(5);
            });
        });

        it("Normalize this vector to a unit vector", function () {
            var vec2 = new WorldWind.Vec2(3, 4);
            var normalized_vec2 = vec2.normalize();
            expect(normalized_vec2[0]).toBeCloseTo(0.6, 10);
            expect(normalized_vec2[1]).toBeCloseTo(0.8, 10);
        });

        it("Computes the squared distance from a vector to a specified vector", function () {
            var vec2_a = new WorldWind.Vec2(2, 3);
            var vec2_b = new WorldWind.Vec2(4, 5);
            expect(vec2_a.distanceToSquared(vec2_b)).toEqual(8);
            expect(vec2_a.distanceToSquared(vec2_a)).toEqual(0);
        });

        it("Computes the distance from a vector to a specified vector", function () {
            var vec2_a = new WorldWind.Vec2(1, 2);
            var vec2_b = new WorldWind.Vec2(2, 4);
            expect(vec2_a.distanceTo(vec2_b)).toEqual(Math.sqrt(5));
        });

        it("Creates a Vec3 using this vector's X and Y components and a Z component of 0", function () {
            var vec2 = new WorldWind.Vec2(2, 3);
            var vec3 = vec2.toVec3();
            expect(vec3).toEqual(new WorldWind.Vec3(2, 3, 0));
        });

        it("Swap the components of the current vector with another one", function () {
            var vec2_a = new WorldWind.Vec2(1, 2);
            var vec2_b = new WorldWind.Vec2(2, 4);
            vec2_a.swap(vec2_b);
            expect(vec2_a).toEqual(new WorldWind.Vec2(2, 4));
            expect(vec2_b).toEqual(new WorldWind.Vec2(1, 2));
        });

        it("Returns a string representation of this vector", function () {
            var vec2 = new WorldWind.Vec2(1, 2);
            expect(vec2.toString()).toEqual("(1, 2)");
        });

    });
});