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
    'src/geom/BoundingBox',
    'src/globe/EarthElevationModel',
    'src/globe/ElevationModel',
    'src/globe/Globe',
    'src/geom/Plane',
    'src/geom/Sector',
    'src/geom/Vec3',
    'test/CustomMatchers.test'
], function (BoundingBox,
             EarthElevationModel,
             ElevationModel,
             Globe,
             Plane,
             Sector,
             Vec3,
             CustomMatchers) {
    "use strict";

    beforeEach(function () {
        jasmine.addMatchers(CustomMatchers);
    });

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
                var vecPoints = [];
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
                var points = [];
                points.push(new Vec3(7, 8, 15));
                points.push(new Vec3(-4, 3, 7));
                points.push(new Vec3(-4, -5, 9));
                points.push(new Vec3(6, -12, 18));
                points.push(new Vec3(-7, -8, -15));
                points.push(new Vec3(4, -3, -7));
                points.push(new Vec3(4, 5, -9));
                points.push(new Vec3(-6, 12, -18));
                var boundingBox = new BoundingBox();
                boundingBox.setToVec3Points(points);
                var corners = boundingBox.getCorners();
                var results = [-13.006629, -5.673621, -20.605725, -1.367193, -7.460613, -23.841735, 3.368652, 15.397291, -19.430232,
                    -8.270784, 17.184283, -16.194222, -3.368652, -15.397291, 19.430232, 8.270784, -17.184283, 16.194222,
                    13.006629, 5.673621, 20.605725, 1.367193, 7.460613, 23.841735];
                var resultCount = 0;
                for (var i = 0; i < corners.length; i++) {
                    var vec = corners[i];
                    for (var j = 0; j < 3; j++) {
                        expect(vec[j]).toBeCloseTo(results[resultCount], 3);
                        resultCount++;
                    }
                }
            });
        });

        describe("Set to sector method", function () {

            it("Sets this bounding box to contain an entire globe", function () {
                var sector = new Sector(-90, 90, -180, 180);
                var globe = new Globe(new EarthElevationModel());
                var minElevation = -11000; // Approximately the depth of the Marianas Trench, in meters
                var maxElevation = 8850; // Approximately the height of the Mt. Everest, in meters
                var boundingBox = new BoundingBox().setToSector(sector, globe, minElevation, maxElevation);

                var equatorialExtreme = globe.equatorialRadius + maxElevation;
                var polarExtreme = globe.polarRadius + maxElevation;
                expect(boundingBox.center).toEqualVec3(new Vec3(0, 0, 0), 1.0e-9);
                expect(boundingBox.bottomCenter).toEqualVec3(new Vec3(-equatorialExtreme, 0, 0), 1.0e-9);
                expect(boundingBox.topCenter).toEqualVec3(new Vec3(equatorialExtreme, 0, 0), 1.0e-9);
                expect(boundingBox.r).toEqualVec3(new Vec3(equatorialExtreme * 2, 0, 0), 1.0e-9);
                expect(boundingBox.s).toEqualVec3(new Vec3(0, 0, equatorialExtreme * 2), 1.0e-6);
                expect(boundingBox.t).toEqualVec3(new Vec3(0, polarExtreme * 2, 0), 1.0e-1);
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