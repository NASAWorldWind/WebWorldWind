/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Sector',
    'src/geom/Location'
], function (Sector, Location) {
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
                var sector = Sector.ZERO;
                var sectorTarget = new Sector(37, 39, 13, 18);

                sector.copy(sectorTarget);
                expect(sector.minLatitude).toEqual(37);
                expect(sector.maxLatitude).toEqual(39);
                expect(sector.minLongitude).toEqual(13);
                expect(sector.maxLongitude).toEqual(18);
            });

            it("Should throw an exception on missing sector input", function () {
                expect(function () {
                    var sector = Sector.ZERO;
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
                    var sector = Sector.ZERO;
                    sector.intersection(null);
                }).toThrow();
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
                    var sector = Sector.ZERO;
                    sector.union(null);
                }).toThrow();
            });
        });

    });
});