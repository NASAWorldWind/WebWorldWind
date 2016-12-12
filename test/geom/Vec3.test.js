/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Vec3'
], function (Vec3) {
    "use strict";

    describe("Vec3Test", function () {

        it("should have the correct three components", function () {
            var vec3 = new Vec3(9, 8, 7);
            expect(vec3[0]).toEqual(9);
            expect(vec3[1]).toEqual(8);
            expect(vec3[2]).toEqual(7);
        });


        it("should have three zero components", function () {
            var vec3Zero = Vec3.ZERO;
            expect(vec3Zero[0]).toEqual(0);
            expect(vec3Zero[1]).toEqual(0);
            expect(vec3Zero[2]).toEqual(0);
        });


        it("should return the average of a vector", function () {
            var vec3_a = new Vec3(1, 2, 3);
            var vec3_b = new Vec3(3, 2, 1);
            var vec3_average = Vec3.average([vec3_a, vec3_b], Vec3.ZERO);
            expect(vec3_average).toEqual(new Vec3(2, 2, 2));
        });


        it("should return the average a specified array of points packed into a single array", function () {
            var pointArray = [1, 2, 3, 3, 2, 1];
            expect(Vec3.averageOfBuffer(pointArray, Vec3.ZERO)).toEqual(new Vec3(2, 2, 2));
        });


        it("test the colinearity of three arrays", function () {
            var a=new Vec3(2,4,6);
            var b=new Vec3(4,8,12);
            var c=new Vec3(8,16,24);
            expect(Vec3.areColinear(a,b,c)).toEqual(true);
        });

        it("compute triangle normals", function () {
            var a=new Vec3(0,0,0);
            var b=new Vec3(1,0,0);
            var c=new Vec3(1,1,0);
            expect(Vec3.computeTriangleNormal(a,b,c)).toEqual(new Vec3(0, 0, 1));
        });

        it("finds three non-colinear points in an array of coordinates", function () {
            var a=new Vec3(0,0,0);
            var b=new Vec3(1,0,0);
            var c=new Vec3(1,1,0);
            expect(Vec3.computeTriangleNormal(a,b,c)).toEqual(new Vec3(0, 0, 1));
        });





    });
});