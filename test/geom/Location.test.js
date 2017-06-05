/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Location',
    'src/geom/Angle',
    'src/globe/Globe',
    'src/globe/EarthElevationModel'
], function (Location, Angle, Globe, EarthElevationModel) {
    "use strict";

    describe("Location Tests", function () {

        it("Should construct a location", function () {
            var location = new Location(37.52, 15.08);
            expect(location.latitude).toEqual(37.52);
            expect(location.longitude).toEqual(15.08);
        });

        it("Should create a location initialized at (0,0)", function () {
            var locationZero = Location.ZERO;
            expect(locationZero.latitude).toEqual(0);
            expect(locationZero.longitude).toEqual(0);
        });

        it("Should create a location from radians coordinates", function () {
            var radiansLatitude = 37.52 / Angle.RADIANS_TO_DEGREES;
            var radiansLongitude = 15.08 / Angle.RADIANS_TO_DEGREES;

            var location = Location.fromRadians(radiansLatitude, radiansLongitude);
            expect(location.latitude).toBeCloseTo(37.52);
            expect(location.longitude).toBeCloseTo(15.08);
        });

        describe("Copies this location to the latitude and longitude of a specified location", function () {

            it("Copies the location successfully", function () {
                var location = Location.ZERO;
                var locationTarget = new Location(37.52, 15.08);

                location.copy(locationTarget);
                expect(location.latitude).toEqual(37.52);
                expect(location.longitude).toEqual(15.08);
            });

            it("Should throw an exception on missing location input", function () {
                expect(function () {
                    var location = Location.ZERO;
                    location.copy(null);
                }).toThrow();
            });
        });

        it('Sets latitude and longitude of a location', function () {
            var location = Location.ZERO;
            location.set(37.52, 15.08);
            expect(location.latitude).toEqual(37.52);
            expect(location.longitude).toEqual(15.08);
        });

        describe('Checks if two locations are equal', function () {

            it('Equal locations', function () {
                var locationA = new Location(37.52, 15.08);
                var locationB = new Location(37.52, 15.08);
                expect(locationA.equals(locationB)).toBe(true);
            });

            it('Different locations', function () {
                var locationA = new Location(37.52, 15.08);
                var locationB = new Location(37, 18);
                expect(locationA.equals(locationB)).toBe(false);
            });
        });

        describe('Computes a location along a path', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute with Great Circle', function () {
                var resultLocation = Location.interpolateAlongPath(
                    WorldWind.GREAT_CIRCLE,
                    0.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(41.537, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.227, 2);
            });

            it('Compute with Rhumb Line', function () {
                var resultLocation = Location.interpolateAlongPath(
                    WorldWind.RHUMB_LINE,
                    0.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(41.5, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.135, 2);
            });

            it('Compute with Linear', function () {
                var resultLocation = Location.interpolateAlongPath(
                    WorldWind.LINEAR,
                    0.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(41.5, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.044, 2);
            });

            it('Compute with Linear with fraction greater than 1', function () {
                var resultLocation = Location.interpolateAlongPath(
                    WorldWind.LINEAR,
                    4.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(45.48, 2);
                expect(resultLocation.longitude).toBeCloseTo(9.089, 2);
            });

            it('Compute with Linear with not recognized path', function () {
                var resultLocation = Location.interpolateAlongPath(
                    null,
                    0.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(41.5, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.044, 2);
            });

            it('Store result in the provided variable', function () {
                var resultLocation = Location.ZERO;
                Location.interpolateAlongPath(
                    WorldWind.LINEAR,
                    0.5,
                    locationA,
                    locationB,
                    resultLocation);
                expect(resultLocation.latitude).toBeCloseTo(41.5, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.044, 2);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.interpolateAlongPath(
                            WorldWind.LINEAR,
                            0.5,
                            null,
                            locationB,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.interpolateAlongPath(
                            WorldWind.LINEAR,
                            0.5,
                            locationA,
                            null,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Result storage not provided', function () {
                    expect(function () {
                        Location.interpolateAlongPath(
                            WorldWind.LINEAR,
                            0.5,
                            locationA,
                            locationB,
                            null);
                    }).toThrow();
                });
            });
        });

        describe('Computes a location along a great circle path', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute with Great Circle', function () {
                var resultLocation = Location.interpolateGreatCircle(
                    0.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(41.537, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.227, 2);
            });

            it('Equal locations', function () {
                var resultLocation = Location.interpolateGreatCircle(
                    0.5,
                    locationA,
                    locationA,
                    Location.ZERO);
                expect(resultLocation).toEqual(locationA);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.interpolateGreatCircle(
                            0.5,
                            null,
                            locationB,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.interpolateGreatCircle(
                            0.5,
                            locationA,
                            null,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Result storage not provided', function () {
                    expect(function () {
                        Location.interpolateGreatCircle(
                            0.5,
                            locationA,
                            locationB,
                            null);
                    }).toThrow();
                });
            });
        });

        describe('Computes a location along a rhumb path', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute with rhumb path', function () {
                var resultLocation = Location.interpolateRhumb(
                    0.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(41.5, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.135, 2);
            });

            it('Equal locations', function () {
                var resultLocation = Location.interpolateRhumb(
                    0.5,
                    locationA,
                    locationA,
                    Location.ZERO);
                expect(resultLocation).toEqual(locationA);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.interpolateRhumb(
                            0.5,
                            null,
                            locationB,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.interpolateRhumb(
                            0.5,
                            locationA,
                            null,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Result storage not provided', function () {
                    expect(function () {
                        Location.interpolateRhumb(
                            0.5,
                            locationA,
                            locationB,
                            null);
                    }).toThrow();
                });
            });
        });

        describe('Computes a location along a linear path', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute with linear path', function () {
                var resultLocation = Location.interpolateLinear(
                    0.5,
                    locationA,
                    locationB,
                    Location.ZERO);
                expect(resultLocation.latitude).toBeCloseTo(41.5, 2);
                expect(resultLocation.longitude).toBeCloseTo(12.044, 2);
            });

            it('Equal locations', function () {
                var resultLocation = Location.interpolateLinear(
                    0.5,
                    locationA,
                    locationA,
                    Location.ZERO);
                expect(resultLocation).toEqual(locationA);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.interpolateLinear(
                            0.5,
                            null,
                            locationB,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.interpolateLinear(
                            0.5,
                            locationA,
                            null,
                            Location.ZERO);
                    }).toThrow();
                });

                it('Result storage not provided', function () {
                    expect(function () {
                        Location.interpolateLinear(
                            0.5,
                            locationA,
                            locationB,
                            null);
                    }).toThrow();
                });
            });
        });

        describe('Computes the great circle angle pointing from the first to the second location', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute the angle', function () {
                var resultAngle = Location.greatCircleAzimuth(
                    locationA,
                    locationB);
                expect(resultAngle).toBeCloseTo(-27.154, 2);
            });

            it('Compute the angle with equal locations', function () {
                var resultAngle = Location.greatCircleAzimuth(
                    locationA,
                    locationA);
                expect(resultAngle).toEqual(0);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.greatCircleAzimuth(
                            locationA,
                            null);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.greatCircleAzimuth(
                            null,
                            locationB);
                    }).toThrow();
                });

            });
        });

        describe('Computes the rhumb angle pointing from the first to the second location', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute the angle', function () {
                var resultAngle = Location.rhumbAzimuth(
                    locationA,
                    locationB);
                expect(resultAngle).toBeCloseTo(-29.026, 2);
            });

            it('Compute the angle with equal locations', function () {
                var resultAngle = Location.rhumbAzimuth(
                    locationA,
                    locationA);
                expect(resultAngle).toEqual(0);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.rhumbAzimuth(
                            locationA,
                            null);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.rhumbAzimuth(
                            null,
                            locationB);
                    }).toThrow();
                });

            });
        });

        describe('Computes the linear angle pointing from the first to the second location', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute the angle', function () {
                var resultAngle = Location.linearAzimuth(
                    locationA,
                    locationB);
                expect(resultAngle).toBeCloseTo(-36.592, 2);
            });

            it('Compute the angle with equal locations', function () {
                var resultAngle = Location.linearAzimuth(
                    locationA,
                    locationA);
                expect(resultAngle).toEqual(0);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.linearAzimuth(
                            locationA,
                            null);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.linearAzimuth(
                            null,
                            locationB);
                    }).toThrow();
                });

            });
        });

        describe('Computes the rhumb angular distance between two locations', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute the distance', function () {
                var resultDistance = Location.rhumbDistance(
                    locationA,
                    locationB);
                expect(resultDistance).toBeCloseTo(0.158, 2);
            });

            it('Compute the distance with equal locations', function () {
                var resultDistance = Location.rhumbDistance(
                    locationA,
                    locationA);
                expect(resultDistance).toEqual(0);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.rhumbDistance(
                            locationA,
                            null);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.rhumbDistance(
                            null,
                            locationB);
                    }).toThrow();
                });

            });
        });

        describe('Computes the linear angular distance between two locations', function () {

            var locationA = new Location(37.52, 15.00);
            var locationB = new Location(45.48, 9.09);

            it('Compute the distance', function () {
                var resultDistance = Location.linearDistance(
                    locationA,
                    locationB);
                expect(resultDistance).toBeCloseTo(0.173, 2);
            });

            it('Compute the distance with equal locations', function () {
                var resultDistance = Location.linearDistance(
                    locationA,
                    locationA);
                expect(resultDistance).toEqual(0);
            });

            describe('Exceptions', function () {

                it('Location A not provided', function () {
                    expect(function () {
                        Location.linearDistance(
                            locationA,
                            null);
                    }).toThrow();
                });

                it('Location B not provided', function () {
                    expect(function () {
                        Location.linearDistance(
                            null,
                            locationB);
                    }).toThrow();
                });

            });
        });

        describe('Determines whether a list of locations crosses the dateline', function () {

            it('Locations cross the dateline', function () {
                var locations = [new Location(29.94, 160.57), new Location(29.96, -151.66)];
                var cross = Location.locationsCrossDateLine(locations);
                expect(cross).toBe(true);
            });

            it('Locations do not cross the dateline', function () {
                var locations = [new Location(37.52, 15.00), new Location(40, 18.00)];
                var cross = Location.locationsCrossDateLine(locations);
                expect(cross).toBe(false);
            });

            it('Locations not provided', function () {
                expect(function () {
                    Location.locationsCrossDateLine(null);
                }).toThrow();
            });
        });

        describe('Great-Circle-Arc-Extreme-Latitude Locations', function () {

            it('Returns extreme locations', function () {
                var locations = [
                    new Location(37.00, 15.00),
                    new Location(47.00, 15.00),
                    new Location(47.00, 17.00),
                    new Location(55.00, 12.00),
                    new Location(55.00, 18.00),
                ];
                var result = Location.greatCircleArcExtremeLocations(locations);
                expect(result[0]).toEqual(new Location(37.00, 15.00));
                expect(result[1]).toEqual(new Location(55.00, 12.00));
            });

            it('Locations not provided', function () {
                expect(function () {
                    Location.greatCircleArcExtremeLocations(null);
                }).toThrow();
            });
        });

        describe('Great-Circle-Arc-Extreme-Latitude between two Locations', function () {

            it('Returns extreme locations', function () {
                var locationA = new Location(187.00, 65.00);
                var locationB = new Location(145.00, 88.00);

                var result = Location.greatCircleArcExtremeForTwoLocations(locationA, locationB);
                expect(result[0].latitude).toBeCloseTo(-3.503, 2);
                expect(result[0].longitude).toBeCloseTo(-113.306, 2);
                expect(result[1]).toEqual(new Location(187.00, 65.00));
            });

            it('Locations not provided', function () {
                expect(function () {
                    Location.greatCircleArcExtremeForTwoLocations(null);
                }).toThrow();
            });
        });

        describe('Great-Circle-Extreme-Locations Using Azimuth', function () {

            it('Returns extreme locations', function () {
                var location = new Location(37.52, 15.08);

                var expectedLocations = [
                    new Location(-9.527, 70.736),
                    new Location(9.527, -109.263)
                ];

                var result = Location.greatCircleExtremeLocationsUsingAzimuth(location, 120);
                expect(result[0].latitude).toBeCloseTo(expectedLocations[0].latitude);
                expect(result[0].longitude).toBeCloseTo(expectedLocations[0].longitude);
                expect(result[1].latitude).toBeCloseTo(expectedLocations[1].latitude);
                expect(result[1].longitude).toBeCloseTo(expectedLocations[1].longitude);
            });

            it('Locations not provided', function () {
                expect(function () {
                    Location.greatCircleExtremeLocationsUsingAzimuth(null, 120);
                }).toThrow();
            });
        });

        describe('Determines where a line between two positions crosses a given meridian', function () {

            it('Meridian intersected', function () {
                var locationA = new Location(-120, 15.08);
                var locationB = new Location(87.00, 25.12);
                var globe = new Globe(new EarthElevationModel());

                var intersection = Location.intersectionWithMeridian(locationA, locationB, 180, globe);
                expect(intersection).toBeCloseTo(-54.824);

            });

            it('Meridian not intersected', function () {
                var locationA = new Location(37.52, 15.08);
                var locationB = new Location(87.00, 25.12);
                var globe = new Globe(new EarthElevationModel());

                var intersection = Location.intersectionWithMeridian(locationA, locationB, 180, globe);
                expect(intersection).toEqual(null);

            });
        });

        it("Checks location Poles", function () {
            expect(Location.poles).toEqual({
                'NONE': 0,
                'NORTH': 1,
                'SOUTH': 2
            });
        });

    });
});