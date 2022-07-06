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
    'src/geom/Sector',
    'src/geom/Location',
    'src/globe/EarthElevationModel',
    'src/globe/ElevationModel',
    'src/geom/BoundingBox',
    'src/geom/Vec3',
    'src/render/DrawContext',
    'src/globe/Globe'
], function (Sector, Location, EarthElevationModel, ElevationModel, BoundingBox, Vec3, DrawContext, Globe) {
    "use strict";

    describe("Sector Tests", function () {

        it("Should construct a Sector", function () {
            var sector = new Sector(37, 39, 13, 18);

            expect(sector.minLatitude).toEqual(37);
            expect(sector.maxLatitude).toEqual(39);
            expect(sector.minLongitude).toEqual(13);
            expect(sector.maxLongitude).toEqual(18);
        });

        it("Should create a sector initialized with all 0", function () {
            var sectorZero = Sector.ZERO;

            expect(sectorZero.minLatitude).toEqual(0);
            expect(sectorZero.maxLatitude).toEqual(0);
            expect(sectorZero.minLongitude).toEqual(0);
            expect(sectorZero.maxLongitude).toEqual(0);
        });

        it("Should create a sector that encompasses the full range of latitude and longitude", function () {
            var sectorFull = Sector.FULL_SPHERE;

            expect(sectorFull.minLatitude).toEqual(-90);
            expect(sectorFull.maxLatitude).toEqual(90);
            expect(sectorFull.minLongitude).toEqual(-180);
            expect(sectorFull.maxLongitude).toEqual(180);
        });

        describe("Copies this sector to the latitude and longitude of a specified sector", function () {

            it("Copies the sector successfully", function () {
                var sector = new Sector(0, 0, 0, 0);
                var sectorTarget = new Sector(37, 39, 13, 18);

                sector.copy(sectorTarget);
                expect(sector.minLatitude).toEqual(37);
                expect(sector.maxLatitude).toEqual(39);
                expect(sector.minLongitude).toEqual(13);
                expect(sector.maxLongitude).toEqual(18);
            });

            it("Should throw an exception on missing sector input", function () {
                expect(function () {
                    var sector = new Sector(0, 0, 0, 0);
                    sector.copy(null);
                }).toThrow();
            });
        });

        describe("Indicates whether this sector has width or height", function () {

            it("Sector is not empty", function () {
                var sector = new Sector(37, 39, 13, 18);

                expect(sector.isEmpty()).toBe(false);
            });

            it("Sector is empty", function () {
                var sector = new Sector(37, 37, 13, 13);

                expect(sector.isEmpty()).toBe(true);
            });


        });

        it("Returns the angle between this sector's minimum and maximum latitudes, in degrees", function () {
            var sector = new Sector(37, 39, 13, 18);

            expect(sector.deltaLatitude()).toEqual(2);
        });

        it("Returns the angle between this sector's minimum and maximum longitude, in degrees", function () {
            var sector = new Sector(37, 39, 13, 18);

            expect(sector.deltaLongitude()).toEqual(5);
        });

        it("Returns the angle midway between this sector's minimum and maximum latitudes", function () {
            var sector = new Sector(37, 39, 13, 18);

            expect(sector.centroidLatitude()).toEqual(38);
        });

        it("Returns the angle midway between this sector's minimum and maximum longitude", function () {
            var sector = new Sector(37, 39, 13, 18);

            expect(sector.centroidLongitude()).toEqual(15.5);
        });

        describe("Computes the location of the angular center of this sector", function () {

            it("Computes the location correctly", function () {
                var sector = new Sector(37, 39, 13, 18);
                var result = new Location(0, 0);

                sector.centroid(result);

                expect(result.latitude).toEqual(38);
                expect(result.longitude).toEqual(15.5);
            });

            it("Should throw an exception on missing result", function () {
                expect(function () {
                    var sector = new Sector(37, 39, 13, 18);
                    sector.centroid(null);
                }).toThrow();
            });
        });

        it("Returns this sector's minimum latitude in radians", function () {
            var sector = new Sector(37, 39, 13, 18);

            var minLatitudeRadians = sector.minLatitudeRadians();

            expect(minLatitudeRadians).toBeCloseTo(0.645);
        });

        it("Returns this sector's maximum latitude in radians", function () {
            var sector = new Sector(37, 39, 13, 18);

            var maxLatitudeRadians = sector.maxLatitudeRadians();

            expect(maxLatitudeRadians).toBeCloseTo(0.680);
        });

        it("Returns this sector's minimum longitude in radians", function () {
            var sector = new Sector(37, 39, 13, 18);

            var minLongitudeRadians = sector.minLongitudeRadians();

            expect(minLongitudeRadians).toBeCloseTo(0.226);
        });

        it("Returns this sector's minimum longitude in radians", function () {
            var sector = new Sector(37, 39, 13, 18);

            var maxLongitudeRadians = sector.maxLongitudeRadians();

            expect(maxLongitudeRadians).toBeCloseTo(0.314);
        });

        describe("Modifies this sector to encompass an array of specified locations", function () {

            it("Set the bounding correctly", function () {
                var sector = new Sector(37, 39, 13, 18);
                var locations = [
                    new Location(37.52, 15.08),
                    new Location(38.63, 15.32),
                    new Location(38.72, 16.03),
                    new Location(38.88, 12.34)
                ];

                sector.setToBoundingSector(locations);

                expect(sector.minLatitude).toEqual(37.52);
                expect(sector.maxLatitude).toEqual(38.88);
                expect(sector.minLongitude).toEqual(12.34);
                expect(sector.maxLongitude).toEqual(16.03);
            });

            it("Should throw an exception on missing locations array", function () {
                expect(function () {
                    var sector = new Sector(37, 39, 13, 18);
                    sector.setToBoundingSector(null);
                }).toThrow();
            });
        });

        describe("Computes bounding sectors from a list of locations that span the dateline", function () {

            it("Computes the sectors correctly", function () {
                var locations = [
                    new Location(37.52, 15.08),
                    new Location(38.63, 15.32),
                    new Location(38.72, 16.03),
                    new Location(38.88, 12.34)
                ];

                var resultSector = Sector.splitBoundingSectors(locations);

                expect(resultSector.length).toBe(2);

                expect(resultSector[0].minLatitude).toEqual(37.52);
                expect(resultSector[0].maxLatitude).toEqual(38.88);
                expect(resultSector[0].minLongitude).toEqual(12.34);
                expect(resultSector[0].maxLongitude).toEqual(180);

                expect(resultSector[1].minLatitude).toEqual(37.52);
                expect(resultSector[1].maxLatitude).toEqual(38.88);
                expect(resultSector[1].minLongitude).toEqual(-180);
                expect(resultSector[1].maxLongitude).toEqual(-180);
            });

            it("Should throw an exception on missing locations array", function () {
                expect(function () {
                    Sector.splitBoundingSectors(null);
                }).toThrow();
            });
        });

        describe("Indicates whether this sector intersects a specified sector", function () {

            it("The first sector intersects the second one", function () {
                var sectorA = new Sector(37, 39, 13, 18);
                var sectorB = new Sector(39, 40, 18, 19);

                var intersection = sectorA.intersects(sectorB);

                expect(intersection).toBe(true);
            });

            it("The first sector does not intersect the second one", function () {
                var sectorA = new Sector(37, 39, 13, 18);
                var sectorB = new Sector(42, 44, 15, 19);

                var intersection = sectorA.intersects(sectorB);

                expect(intersection).toBe(false);
            });
        });

        describe("Indicates whether this sector intersects strictly a specified sector", function () {

            it("The first sector intersects the second one", function () {
                var sectorA = new Sector(37, 39, 13, 18);
                var sectorB = new Sector(38, 40, 17, 19);

                var intersection = sectorA.overlaps(sectorB);

                expect(intersection).toBe(true);
            });

            it("The first sector does not intersects the second one", function () {
                var sectorA = new Sector(37, 39, 13, 18);
                var sectorB = new Sector(39, 40, 18, 19);

                var intersection = sectorA.overlaps(sectorB);

                expect(intersection).toBe(false);
            });
        });

        describe("Indicates whether this sector fully contains a specified sector", function () {

            it("The first sector contains the second one", function () {
                var sectorA = new Sector(36, 39, 13, 18);
                var sectorB = new Sector(38, 38, 15, 17);

                var contains = sectorA.contains(sectorB);

                expect(contains).toBe(true);
            });

            it("The first sector does not contains the second one", function () {
                var sectorA = new Sector(37, 39, 13, 18);
                var sectorB = new Sector(39, 40, 18, 19);

                var contains = sectorA.contains(sectorB);

                expect(contains).toBe(false);
            });
        });

        describe("Indicates whether this sector contains a specified geographic location", function () {

            it("The sector contains the location", function () {
                var sector = new Sector(36, 39, 13, 18);

                var contains = sector.containsLocation(37, 15);

                expect(contains).toBe(true);
            });

            it("The sector does not contains the location", function () {
                var sector = new Sector(36, 39, 13, 18);

                var contains = sector.containsLocation(37, 22);

                expect(contains).toBe(false);
            });
        });

        describe("Sets this sector to the intersection of itself and a specified sector", function () {

            it("Returns the intersection", function () {
                var sectorA = new Sector(36, 39, 13, 18);
                var sectorB = new Sector(38, 40, 15, 17);

                sectorA.intersection(sectorB);

                expect(sectorA.minLatitude).toEqual(38);
                expect(sectorA.maxLatitude).toEqual(39);
                expect(sectorA.minLongitude).toEqual(15);
                expect(sectorA.maxLongitude).toEqual(17);
            });

            it("Should throw an exception on missing sector input", function () {
                expect(function () {
                    var sector = new Sector(0, 0, 0, 0);
                    sector.intersection(null);
                }).toThrow();
            });
        });

        describe("Get corners method", function () {

            it("Returns corner points in the correct order", function () {
                var sector = new Sector(44, 45, -95, -94);
                var corners = sector.getCorners();
                expect(corners[0].latitude).toEqual(44);
                expect(corners[0].longitude).toEqual(-95);
                expect(corners[1].latitude).toEqual(44);
                expect(corners[1].longitude).toEqual(-94);
                expect(corners[2].latitude).toEqual(45);
                expect(corners[2].longitude).toEqual(-94);
                expect(corners[3].latitude).toEqual(45);
                expect(corners[3].longitude).toEqual(-95);
            });
        });

        describe("Compute bounding points method", function () {

            it("Should throw an exception because no globe is provided", function () {
                var sector = new Sector(44, 45, -95, -94);
                expect(function () {
                    sector.computeBoundingPoints(null /* globe */, 1 /* verticalExaggeration */)
                }).toThrow();
            });

            it("Computes the correct bounding points for a given sector", function () {
                // create a globe that returns mock elevations for a given sector so we don't have to rely on
                // asynchronous tile calls to finish.
                Globe.prototype.minAndMaxElevationsForSector = function (sector) {
                    return [125.0, 350.0];
                };
                var mockGlobe = new Globe(new EarthElevationModel());
                var sector = new Sector(44.0, 45.0, -95.0, -94.0);
                var boundingPoints = sector.computeBoundingPoints(mockGlobe, 1 /* verticalExaggeration */);
                var results = [-4578078.7560, 4408178.4447, -400529.9919, -4578239.9915, 4408334.7429, -400544.0982,
                    -4584371.7046, 4408178.4447, -320570.4981, -4584533.1618, 4408334.7429, -320581.7883,
                    -4506674.4276, 4487436.7972, -315137.3752, -4506833.1390, 4487595.8962, -315148.4734,
                    -4500488.1337, 4487436.7972, -393741.6920, -4500646.6273, 4487595.8962, -393755.5584,
                    -4542910.2988, 4448133.5080, -357534.7945, -4581561.0285, 4408334.7429, -360576.6729];

                var resultCount = 0;
                for (var i = 0; i < boundingPoints.length; i++) {
                    var vec = boundingPoints[i];
                    for (var j = 0; j < 3; j++) {
                        expect(vec[j]).toBeCloseTo(results[resultCount], 3);
                        resultCount++;
                    }
                }
            });

            it("Computes the correct bounding points for a sector crossing the anti-Meridian", function () {
                // create a globe that returns mock elevations for a given sector so we don't have to rely on
                // asynchronous tile calls to finish.
                Globe.prototype.minAndMaxElevationsForSector = function (sector) {
                    return [125.0, 350.0];
                };
                var mockGlobe = new Globe(new EarthElevationModel());
                var sector = new Sector(44.0, 45.0, -179, 179.0);
                var boundingPoints = sector.computeBoundingPoints(mockGlobe, 1 /* verticalExaggeration */);
                var results = [-80203.6904, 4408178.4447, -4594866.3461, -80206.5151, 4408334.7429, -4595028.1729,
                    80203.6904, 4408178.4447, -4594866.3461, 80206.5151, 4408334.7429, -4595028.1729,
                    78844.3747, 4487436.7972, -4516991.2028, 78847.1514, 4487595.8962, -4517150.2776,
                    -78844.3747, 4487436.7972, -4516991.2028, -78847.1514, 4487595.8962, -4517150.2776,
                    0.0000, 4448133.5080, 4556957.8791, 0.0000, 4408334.7429, 4595728.1245,
                    -4556784.3641, 4448133.5080, 39766.4547, 4556784.3641, 4448133.5080, 39766.4547,
                    -79529.8810, 4448133.5080, -4556263.8324, 79529.8810, 4448133.5080, -4556263.8324];

                var resultCount = 0;
                for (var i = 0; i < boundingPoints.length; i++) {
                    var vec = boundingPoints[i];
                    for (var j = 0; j < 3; j++) {
                        expect(vec[j]).toBeCloseTo(results[resultCount], 3);
                        resultCount++;
                    }
                }
            });

            it("Computes the correct bounding points for a sector spanning the globe horizontally", function () {
                // create a globe that returns mock elevations for a given sector so we don't have to rely on
                // asynchronous tile calls to finish.
                Globe.prototype.minAndMaxElevationsForSector = function (sector) {
                    return [125.0, 350.0];
                };
                var mockGlobe = new Globe(new EarthElevationModel());
                var sector = new Sector(44.0, 45.0, -180, 180.0);
                var boundingPoints = sector.computeBoundingPoints(mockGlobe, 1 /* verticalExaggeration */);
                var results = [-0.0000, 4408178.4447, -4595566.2731, -0.0000, 4408334.7429, -4595728.1245,
                    0.0000, 4408178.4447, -4595566.2731, 0.0000, 4408334.7429, -4595728.1245,
                    0.0000, 4487436.7972, -4517679.2672, 0.0000, 4487595.8962, -4517838.3662,
                    0.0000, 4487436.7972, -4517679.2672, -0.0000, 4487595.8962, -4517838.3662,
                    0.0000, 4448133.5080, 4556957.8791, 0.0000, 4408334.7429, 4595728.1245,
                    0.0000, 4408334.7429, 4595728.1245, 4595728.1245, 4408334.7429, 0.0000,
                    -4595728.1245, 4408334.7429, 0.0000, 0.0000, 4408334.7429, -4595728.1245,
                    0.0000, 4487595.8962, 4517838.3662, 4517838.3662, 4487595.8962,
                    0.0000, -4517838.3662, 4487595.8962, 0.0000, 0.0000, 4487595.8962, -4517838.3662];

                var resultCount = 0;
                for (var i = 0; i < boundingPoints.length; i++) {
                    var vec = boundingPoints[i];
                    for (var j = 0; j < 3; j++) {
                        expect(vec[j]).toBeCloseTo(results[resultCount], 3);
                        resultCount++;
                    }
                }
            });

            it("Computes the correct bounding points for a sector in the southern hemisphere", function () {
                // create a globe that returns mock elevations for a given sector so we don't have to rely on
                // asynchronous tile calls to finish.
                Globe.prototype.minAndMaxElevationsForSector = function (sector) {
                    return [125.0, 350.0];
                };
                var mockGlobe = new Globe(new EarthElevationModel());
                var sector = new Sector(-45.0, -44.0, -95.0, -94.0);
                var boundingPoints = sector.computeBoundingPoints(mockGlobe, 1 /* verticalExaggeration */);
                var results = [-4500488.1337, -4487436.7972, -393741.6920, -4500646.6273, -4487595.8962, -393755.5584,
                    -4506674.4276, -4487436.7972, -315137.3752, -4506833.1390, -4487595.8962, -315148.4734,
                    -4584371.7046, -4408178.4447, -320570.4981, -4584533.1618, -4408334.7429, -320581.7883,
                    -4578078.7560, -4408178.4447, -400529.9919, -4578239.9915, -4408334.7429, -400544.0982,
                    -4542910.2988, -4448133.5080, -357534.7945, -4581561.0285, -4408334.7429, -360576.6729];

                var resultCount = 0;
                for (var i = 0; i < boundingPoints.length; i++) {
                    var vec = boundingPoints[i];
                    for (var j = 0; j < 3; j++) {
                        expect(vec[j]).toBeCloseTo(results[resultCount], 3);
                        resultCount++;
                    }
                }
            });

            it("Computes the correct bounding points for a sector crossing the equator", function () {
                // create a globe that returns mock elevations for a given sector so we don't have to rely on
                // asynchronous tile calls to finish.
                Globe.prototype.minAndMaxElevationsForSector = function (sector) {
                    return [125.0, 350.0];
                };
                var mockGlobe = new Globe(new EarthElevationModel());
                var sector = new Sector(-10.0, 10.0, -95.0, -94.0);
                var boundingPoints = sector.computeBoundingPoints(mockGlobe, 1 /* verticalExaggeration */);
                var results = [-6258091.0395, -1100270.2538, -547512.0213, -6258311.7780, -1100309.3246, -547531.3334,
                    -6266693.3042, -1100270.2538, -438209.8842, -6266914.3462, -1100309.3246, -438225.3410,
                    -6266693.3042, 1100270.2538, -438209.8842, -6266914.3462, 1100309.3246, -438225.3410,
                    -6258091.0395, 1100270.2538, -547512.0213, -6258311.7780, 1100309.3246, -547531.3334,
                    -6358824.2533, 0.0000, -500450.3221, -6262851.5323, -1100309.3246, -492897.1052,
                    -6262851.5323, 1100309.3246, -492897.1052, -6354214.9312, 0.0000, -555921.7721,
                    -6362949.3262, 0.0000, -444940.7609];

                var resultCount = 0;
                for (var i = 0; i < boundingPoints.length; i++) {
                    var vec = boundingPoints[i];
                    for (var j = 0; j < 3; j++) {
                        expect(vec[j]).toBeCloseTo(results[resultCount], 3);
                        resultCount++;
                    }
                }
            });
        });

        describe("Sets this sector to the union of itself and a specified sector", function () {

            it("Returns the intersection", function () {
                var sectorA = new Sector(36, 39, 13, 18);
                var sectorB = new Sector(38, 40, 15, 17);

                sectorA.union(sectorB);

                expect(sectorA.minLatitude).toEqual(36);
                expect(sectorA.maxLatitude).toEqual(40);
                expect(sectorA.minLongitude).toEqual(13);
                expect(sectorA.maxLongitude).toEqual(18);
            });

            it("Should throw an exception on missing sector input", function () {
                expect(function () {
                    var sector = new Sector(0, 0, 0, 0);
                    sector.union(null);
                }).toThrow();
            });
        });

        describe("Computes points and distances", function () {

            it("Computes a center point", function () {
                const sector = new Sector(-90, -45, -180, -135);
                expect(function () {
                    sector.computeCenterPoint(null, 1);
                }).toThrow();
                var mockGlobe = new Globe(new EarthElevationModel());
                const center = sector.computeCenterPoint(mockGlobe, 1);
                const result = new Vec3(-936736.6335818054, -5869977.306109176, -2261482.2851649104);
                expect(center).toEqual(result);
            });

            it("Computes corner points", function () {
                const sector = new Sector(-90, -45, -180, -135);
                expect(function () {
                    sector.computeCornerPoints(null, 1);
                }).toThrow();
                const corners = [new Vec3(-4.798926572645884e-26, -6356752.314245179, -3.9186209248144716e-10),
                new Vec3(-2.770883428835813e-10, -6356752.314245179, -2.7708834288358126e-10),
                new Vec3(-3194419.1450605746, -4487348.408865919, -3194419.145060574),
                new Vec3(-5.532453209639622e-10, -4487348.408865919, -4517590.878848932)];
                var mockGlobe = new Globe(new EarthElevationModel());
                const result = sector.computeCornerPoints(mockGlobe, 1);
                for (let i = 0, len = result.length; i < len; i++) {
                    for (let j=0; j<3; j++) {
                        expect(corners[i][j]).toBeCloseTo(result[i][j],6);
                    }
                }
            });

            it("Computes distance from a point.", function () {
                var MockGlContext = function () { };
                var dc = new DrawContext(new MockGlContext());
                dc.globe = new Globe(new EarthElevationModel());
                const sector = new Sector(-90, -45, -180, -135);
                const point = new Vec3(-13332838.783247922, 8170373.735383635, -4852756.455372253);
                expect(function () {
                    sector.distanceTo(null, point);
                }).toThrow();
                expect(function () {
                    sector.distanceTo(dc, null);
                }).toThrow();
                const distance = sector.distanceTo(dc, point);
                expect(distance).toBeCloseTo(16302011.080715783, 7);
            });
        });
    });
});