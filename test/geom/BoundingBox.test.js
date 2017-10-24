/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/BoundingBox',
    'src/geom/Vec3',
    'src/geom/Plane',
    'src/globe/Globe',
    'src/globe/EarthElevationModel',
    'src/geom/Sector'
], function (BoundingBox, Vec3, Plane, Globe, EarthElevationModel, Sector) {
    "use strict";

    describe("BoundingBox Tests", function () {

        it("Should have the basic bounding box properties.", function () {
            var boundingBox = new BoundingBox();
            expect(boundingBox.center).toEqual(new Vec3(0, 0, 0));
            expect(boundingBox.bottomCenter).toEqual(new Vec3(-0.5, 0, 0));
            expect(boundingBox.topCenter).toEqual(new Vec3(0.5, 0, 0));
            expect(boundingBox.r).toEqual(new Vec3(1, 0, 0));
            expect(boundingBox.s).toEqual(new Vec3(0, 1, 0));
            expect(boundingBox.t).toEqual(new Vec3(0, 0, 1));
            expect(boundingBox.radius).toEqual(Math.sqrt(3));
            expect(boundingBox.tmp1).toEqual(new Vec3(0, 0, 0));
            expect(boundingBox.tmp2).toEqual(new Vec3(0, 0, 0));
            expect(boundingBox.tmp3).toEqual(new Vec3(0, 0, 0));
            expect(boundingBox.scratchElevations).toEqual(new Float64Array(9));
            expect(boundingBox.scratchPoints).toEqual(new Float64Array(3 * boundingBox.scratchElevations.length));
        });

        describe("Set to points method", function () {

            it("Sets this bounding box such that it minimally encloses a specified collection of points", function () {
                var boundingBox = new BoundingBox();
                var samplePoints = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
                expect(boundingBox.setToPoints(samplePoints).radius).toEqual(1.0606601717798212);
            });

            it("Should throw an exception because only two points provided", function () {
                var boundingBox = new BoundingBox();
                expect(function () {
                    boundingBox.setToPoints(new Float32Array(2))
                }).toThrow();
            });

            it("Should throw an exception because of the wrong input", function () {    //no points provided
                var boundingBox = new BoundingBox();
                expect(function () {
                    boundingBox.setToPoints(null)
                }).toThrow();
            });

            // Vec3 variations
            it("Sets this bounding box such that it minimally encloses a specified collection of points", function () {
                var boundingBox = new BoundingBox();
                var vecPoints=[];
                vecPoints.push(new Vec3(1, 0, 0));
                vecPoints.push(new Vec3(0, 1, 0));
                vecPoints.push(new Vec3(0, 0, 1));
                expect(boundingBox.setToVec3Points(vecPoints).radius).toEqual(1.0606601717798212);
            });

            it("Should throw an exception because of the wrong input", function () {    //no points provided
                var boundingBox = new BoundingBox();
                expect(function () {
                    boundingBox.setToVec3Points(null)
                }).toThrow();
            });
        });

        describe("Get corners method", function () {

            it("Creates a box, verifies correct corners retrieved", function () {
            	var points=[];
                points.push(new Vec3(7,8,15));
                points.push(new Vec3(-4,3,7));
                points.push(new Vec3(-4,-5,9));
                points.push(new Vec3(6,-12,18));
                points.push(new Vec3(-7,-8,-15));
                points.push(new Vec3(4,-3,-7));
                points.push(new Vec3(4,5,-9));
                points.push(new Vec3(-6,12,-18));
                var boundingBox = new BoundingBox();
                boundingBox.setToVec3Points(points);
                var corners=boundingBox.getCorners();
				expect(corners[0][0]).toBeCloseTo(-13.006629879633422,3);
				expect(corners[0][1]).toBeCloseTo(-5.673621104400012,3);
				expect(corners[0][2]).toBeCloseTo(-20.605725543651864,3);
				expect(corners[1][0]).toBeCloseTo(-1.3671932875281194,3);
				expect(corners[1][1]).toBeCloseTo(-7.460613776144945,3);
				expect(corners[1][2]).toBeCloseTo(-23.841735403281938,3);
				expect(corners[2][0]).toBeCloseTo(3.368652415295916,3);
				expect(corners[2][1]).toBeCloseTo(15.397291092220424,3);
				expect(corners[2][2]).toBeCloseTo(-19.43023238071855,3);
				expect(corners[3][0]).toBeCloseTo(-8.270784176809387,3);
				expect(corners[3][1]).toBeCloseTo(17.184283763965357,3);
				expect(corners[3][2]).toBeCloseTo(-16.194222521088477,3);
				expect(corners[4][0]).toBeCloseTo(-3.368652415295916,3);
				expect(corners[4][1]).toBeCloseTo(-15.397291092220424,3);
				expect(corners[4][2]).toBeCloseTo(19.43023238071855,3);
				expect(corners[5][0]).toBeCloseTo(8.270784176809387,3);
				expect(corners[5][1]).toBeCloseTo(-17.184283763965357,3);
				expect(corners[5][2]).toBeCloseTo(16.194222521088477,3);
				expect(corners[6][0]).toBeCloseTo(13.006629879633422,3);
				expect(corners[6][1]).toBeCloseTo(5.673621104400012,3);
				expect(corners[6][2]).toBeCloseTo(20.605725543651864,3);
				expect(corners[7][0]).toBeCloseTo(1.3671932875281194,3);
				expect(corners[7][1]).toBeCloseTo(7.460613776144945,3);
				expect(corners[7][2]).toBeCloseTo(23.841735403281938,3);
            });
        });

        describe("Set to sector method", function () {

            it("Sets this bounding box to contain a specified sector with min and max elevation", function () {
                var boundingBox = new BoundingBox();
                var globe = new Globe(new EarthElevationModel());
                var sector = new Sector(-90, 90, -180, 180);
                expect(boundingBox.setToSector(sector, globe, 10, 1000).radius).toBeCloseTo(9006353.499282671,3);
            });

            it("Should throw an exception because no globe is provided", function () {
                var boundingBox = new BoundingBox();
                expect(function () {
                    boundingBox.setToSector(sector, null, 10, 1000)
                }).toThrow();
            });

            it("Should throw an exception because no sector is provided", function () {
                expect(function () {
                    boundingBox.setToSector(null, globe, 10, 1000)
                }).toThrow();
            });
        });

        describe("Translates this bounding box by a specified translation vector", function () {

            it("Should return the translated bounding box", function () {
                var boundingBox = new BoundingBox();
                boundingBox.translate(new Vec3(1, 2, 3));
                expect(boundingBox.center).toEqual(new Vec3(1, 2, 3));
                expect(boundingBox.bottomCenter).toEqual(new Vec3(0.5, 2, 3));
                expect(boundingBox.topCenter).toEqual(new Vec3(1.5, 2, 3));
            });

            it("Should throw an error on null vector", function () {
                var boundingBox = new BoundingBox();
                expect(function () {
                    boundingBox.translate(null)
                }).toThrow();
            });
        });

        describe("Computes the approximate distance between this bounding box and a specified point", function () {

            it("Should return the correct distance", function () {
                var boundingBox = new BoundingBox();
                var point = new Vec3(3, 2, 5);
                expect(boundingBox.distanceTo(point)).toBeCloseTo(4.432, 3);
            });

            it("Should throw an error on null point", function () {
                var boundingBox = new BoundingBox();
                expect(function () {
                    boundingBox.distanceTo(null)
                }).toThrow();
            });
        });

        describe("Computes the effective radius of this bounding box relative to a specified plane", function () {

            it("Should return the correct radius", function () {
                var boundingBox = new BoundingBox();
                var plane = {normal: new Vec3(1, 2, 3)};
                expect(boundingBox.effectiveRadius(plane)).toEqual(3);
            });

            it("Should throw an error on null plane", function () {
                var boundingBox = new BoundingBox();
                expect(function () {
                    boundingBox.effectiveRadius(null)
                }).toThrow();
            });
        });

        describe("Indicates whether this bounding box intersects a specified frustum", function () {
            var boundingBox = new BoundingBox();
            var plane = new Plane(-1, 0, -1, -1),
                p1 = new Vec3(1, 2, 3),
                p2 = new Vec3(3, 4, 5);

            it("Indicates where the BoundingBox intersects a point", function () {
                expect(boundingBox.intersectsAt(plane, 1000, p1, p2)).toEqual(0);
            });

            it("Indicates the point intersection with the BoundingBox", function () {
                expect(boundingBox.intersectionPoint(plane)).toEqual(-1);
            });

            it("Should return a false intersection", function () {
                var frustum = {near: plane};
                expect(boundingBox.intersectsFrustum(frustum)).toEqual(false);
            });

            it("Should return a positive intersection", function () {
                var p = new Plane(0.8, -0.5, 0.3, 10000000);
                var frustum = {near: p, far: p, top: p, left: p, right: p, bottom: p};
                expect(boundingBox.intersectsFrustum(frustum)).toEqual(true);
            });

            it("Should throw an error on null frustum", function () {
                expect(function () {
                    boundingBox.intersectsFrustum(null)
                }).toThrow();
            });
        });

    });
});