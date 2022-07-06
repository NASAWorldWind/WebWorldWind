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
define(['src/WorldWind', 'test/CustomMatchers.test'], function (WorldWind, CustomMatchers) {
    "use strict";

    describe("ProjectionWgs84 tests", function () {
        // WGS 84 reference values taken from NGA.STND.0036_1.0.0_WGS84.
        var WGS84_IERS_REFERENCE_MERIDIAN = vec3FromEcef(6378137.0, 0, 0);
        var WGS84_IERS_REFERENCE_MERIDIAN_NORMAL = vec3FromEcef(1, 0, 0);
        var WGS84_IERS_REFERENCE_MERIDIAN_TANGENT = vec3FromEcef(0, 0, 1);
        var WGS84_IERS_REFERENCE_POLE = vec3FromEcef(0, 0, 6356752.3142);
        var WGS84_IERS_REFERENCE_POLE_NORMAL = vec3FromEcef(0, 0, 1);
        var WGS84_IERS_REFERENCE_POLE_TANGENT = vec3FromEcef(-1, 0, 0);

        // WGS 84 reference coordinates taken from NGA.STND.0036_1.0.0_WGS84.
        var wgs84ReferenceStations = {
            "Colorado Springs": {
                geographic: normalizedPosition(38.80293817, 255.47540411, 1911.778),
                cartesian: vec3FromEcef(-1248599.695, -4819441.002, 3976490.117)
            },
            "Ascension": {
                geographic: normalizedPosition(-7.95132931, 345.58786964, 106.281),
                cartesian: vec3FromEcef(6118523.866, -1572350.772, -876463.909)
            },
            "Diego Garcia": {
                geographic: normalizedPosition(-7.26984216, 72.37092367, -64.371),
                cartesian: vec3FromEcef(1916196.855, 6029998.797, -801737.183)
            },
            "Kwajalein": {
                geographic: normalizedPosition(8.72250188, 167.73052378, 39.652),
                cartesian: vec3FromEcef(-6160884.028, 1339852.169, 960843.154)
            },
            "Hawaii": {
                geographic: normalizedPosition(21.56149239, 201.76066695, 425.789),
                cartesian: vec3FromEcef(-5511980.264, -2200246.752, 2329481.004)
            },
            "Cape Canaveral": {
                geographic: normalizedPosition(28.48373823, 279.42769502, -24.083),
                cartesian: vec3FromEcef(918988.062, -5534552.894, 3023721.362)
            }
        };

        function normalizedPosition(latitude, longitude, altitude) {
            return new WorldWind.Position(
                WorldWind.Angle.normalizedDegreesLatitude(latitude),
                WorldWind.Angle.normalizedDegreesLongitude(longitude),
                altitude);
        }

        /**
         * Creates a Vec3 in the WorldWind coordinate system from WGS84 ECEF coordinates.
         */
        function vec3FromEcef(x, y, z) {
            return new WorldWind.Vec3(y, z, x);
        }

        /**
         * Computes the ellipsoidal normal vector. Taken from Coordinate Systems in Geodesy:
         * http://www2.unb.ca/gge/Pubs/LN16.pdf
         */
        function wgs84EllipsoidNormal(latitude, longitude) {
            var latRad = latitude * Math.PI / 180;
            var lonRad = longitude * Math.PI / 180;

            return vec3FromEcef(
                Math.cos(latRad) * Math.cos(lonRad),
                Math.cos(latRad) * Math.sin(lonRad),
                Math.sin(latRad)).normalize();
        }

        /**
         * Computes the north vector in the local geodetic plane. Taken from Coordinate Systems in Geodesy:
         * http://www2.unb.ca/gge/Pubs/LN16.pdf
         */
        function wgs84GeodeticNorth(latitude, longitude) {
            var latRad = latitude * Math.PI / 180;
            var lonRad = longitude * Math.PI / 180;

            return vec3FromEcef(
                -Math.sin(latRad) * Math.cos(lonRad),
                -Math.sin(latRad) * Math.sin(lonRad),
                Math.cos(latRad)).normalize();
        }

        beforeEach(function () {
            jasmine.addMatchers(CustomMatchers);
        });

        it("transforms geographic coordinates to Cartesian at the IERS Reference Meridian (IRM)", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            var result = wgs84.geographicToCartesian(globe, 0, 0, 0, null, new WorldWind.Vec3());

            // Expect an exact match to the reference value.
            expect(result).toBeVec3(WGS84_IERS_REFERENCE_MERIDIAN);
        });

        // TODO: Review, fix related issues and reinstate this test after switch from PhantomJS to headless browsers.
        // This produces a precision error on Chrome Headless 86.0.4240.180. Behavior on Firefox Headless is as expected.
        // If the accuracy of the comparison is reduced to three decimals, the test passes.
        
        // it("transforms geographic coordinates to Cartesian at the IERS Reference Pole (IRP)", function () {
        //     var wgs84 = new WorldWind.ProjectionWgs84();
        //     var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

        //     var result = wgs84.geographicToCartesian(globe, 90, 0, 0, null, new WorldWind.Vec3());

        //     // WGS84 reference value: [0, 0, 6356752.3142]
        //     // Actual computed value: [0, 0, 6356752.314245179]
        //     // Match the four decimals specified by the reference value. Additional precision is acceptable.
        //     expect(result).toBeCloseToVec3(WGS84_IERS_REFERENCE_POLE, 4);
        // });

        it("transforms geographic coordinates to Cartesian with reference coordinates", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;
                    var point = wgs84ReferenceStations[name].cartesian;

                    var result = wgs84.geographicToCartesian(globe, pos.latitude, pos.longitude, pos.altitude, null, new WorldWind.Vec3());

                    // Match the three decimals specified by the reference value. Additional precision is acceptable.
                    expect(result).toBeCloseToVec3(point, 3);
                }
            }
        });

        it("transforms Cartesian coordinates to geographic with reference coordinates", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;
                    var point = wgs84ReferenceStations[name].cartesian;

                    var result = wgs84.cartesianToGeographic(globe, point[0], point[1], point[2], null, new WorldWind.Position());

                    // Match the eight decimals of latitude and longitude specified by the reference value.
                    // Match the three decimals of altitude specified by the reference value.
                    // Additional precision is acceptable.
                    expect(result).toBeCloseToPosition(pos, 8, 8, 3);
                }
            }
        });

        it("transforms geographic coordinates to Cartesian, then back to geographic", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;

                    var resultPoint = wgs84.geographicToCartesian(globe, pos.latitude, pos.longitude, pos.altitude, null, new WorldWind.Vec3());
                    var resultPos = wgs84.cartesianToGeographic(globe, resultPoint[0], resultPoint[1], resultPoint[2], null, new WorldWind.Position());

                    // Match the eight decimals of latitude and longitude specified by the reference value.
                    // Match the three decimals of altitude specified by the reference value.
                    // Additional precision is acceptable.
                    expect(resultPos).toBeCloseToPosition(pos, 8, 8, 3);
                }
            }
        });

        it("transforms Cartesian coordinates to geographic, then back to Cartesian", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var point = wgs84ReferenceStations[name].cartesian;

                    var resultPos = wgs84.cartesianToGeographic(globe, point[0], point[1], point[2], null, new WorldWind.Position());
                    var resultPoint = wgs84.geographicToCartesian(globe, resultPos.latitude, resultPos.longitude, resultPos.altitude, null, new WorldWind.Vec3());

                    // Match the three decimals specified by the reference value. Additional precision is acceptable.
                    expect(resultPoint).toBeCloseToVec3(point, 3);
                }
            }
        });

        it("computes the Cartesian normal at the IERS Reference Meridian (IRM)", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            var result = wgs84.surfaceNormalAtLocation(globe, 0, 0, new WorldWind.Vec3());

            // Expect an exact match to the reference value.
            expect(result).toBeVec3(WGS84_IERS_REFERENCE_MERIDIAN_NORMAL);
        });

        it("computes the Cartesian normal at the IERS Reference Pole (IRP)", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            var result = wgs84.surfaceNormalAtLocation(globe, 90, 0, new WorldWind.Vec3());

            // Expect the result to be within fifteen decimal places of the reference value.
            expect(result).toBeCloseToVec3(WGS84_IERS_REFERENCE_POLE_NORMAL, 10);
        });

        it("computes the Cartesian normal at reference geographic coordinates", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;
                    var normal = wgs84EllipsoidNormal(pos.latitude, pos.longitude);

                    var result = wgs84.surfaceNormalAtLocation(globe, pos.latitude, pos.longitude, new WorldWind.Vec3());

                    // Expect the result to be within ten decimal places of a reference computation.
                    expect(result).toBeCloseToVec3(normal, 10);
                }
            }
        });

        it("computes the Cartesian normal at reference Cartesian coordinates", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;
                    var point = wgs84ReferenceStations[name].cartesian;
                    var normal = wgs84EllipsoidNormal(pos.latitude, pos.longitude);

                    var result = wgs84.surfaceNormalAtPoint(globe, point[0], point[1], point[2], new WorldWind.Vec3());

                    // Expect the result to be within five decimal places of a reference computation.
                    expect(result).toBeCloseToVec3(normal, 5);
                }
            }
        });

        it("computes the Cartesian tangent at the IERS Reference Meridian (IRM)", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            var result = wgs84.northTangentAtLocation(globe, 0, 0, new WorldWind.Vec3());

            // Expect an exact match to the reference value.
            expect(result).toBeVec3(WGS84_IERS_REFERENCE_MERIDIAN_TANGENT);
        });

        it("computes the Cartesian tangent at the IERS Reference Pole (IRP)", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            var result = wgs84.northTangentAtLocation(globe, 90, 0, new WorldWind.Vec3());

            // Expect the result to be within fifteen decimal places of the reference value.
            expect(result).toBeCloseToVec3(WGS84_IERS_REFERENCE_POLE_TANGENT, 10);
        });

        it("computes the Cartesian tangent at reference geographic coordinates", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;
                    var tangent = wgs84GeodeticNorth(pos.latitude, pos.longitude);

                    var result = wgs84.northTangentAtLocation(globe, pos.latitude, pos.longitude, new WorldWind.Vec3());

                    // Expect the result to be within ten decimal places of a reference computation.
                    expect(result).toBeCloseToVec3(tangent, 10);
                }
            }
        });

        it("computes the Cartesian tangent at reference Cartesian coordinates", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;
                    var point = wgs84ReferenceStations[name].cartesian;
                    var tangent = wgs84GeodeticNorth(pos.latitude, pos.longitude);

                    var result = wgs84.northTangentAtPoint(globe, point[0], point[1], point[2], null, new WorldWind.Vec3());

                    // Expect the result to be within ten decimal places of a reference computation.
                    expect(result).toBeCloseToVec3(tangent, 10);
                }
            }
        });

        it("computes Cartesian normals that are orthogonal to Cartesian tangents", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;

                    var normalResult = wgs84.surfaceNormalAtLocation(globe, pos.latitude, pos.longitude, new WorldWind.Vec3());
                    var tangentResult = wgs84.northTangentAtLocation(globe, pos.latitude, pos.longitude, new WorldWind.Vec3());
                    var dotResult = normalResult.dot(tangentResult);

                    // Expect the dot product to be within fifteen decimal places of zero.
                    expect(dotResult).toBeCloseTo(0, 15);
                }
            }
        });

        it("computes Cartesian normals that are co-linear with the direction of altitude", function () {
            var wgs84 = new WorldWind.ProjectionWgs84();
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), wgs84);

            for (var name in wgs84ReferenceStations) {
                if (wgs84ReferenceStations.hasOwnProperty(name)) {
                    var pos = wgs84ReferenceStations[name].geographic;

                    var normalResult = wgs84.surfaceNormalAtLocation(globe, pos.latitude, pos.longitude, new WorldWind.Vec3());
                    var point1 = wgs84.geographicToCartesian(globe, pos.latitude, pos.longitude, pos.altitude, null, new WorldWind.Vec3());
                    var point2 = wgs84.geographicToCartesian(globe, pos.latitude, pos.longitude, pos.altitude + 1, null, new WorldWind.Vec3());
                    var altitudeResult = point2.subtract(point1).normalize();

                    // Expect the result to be within eight decimal places of the vector between two altitudes.
                    expect(normalResult).toBeCloseToVec3(altitudeResult, 8);
                }
            }
        });
    });
});