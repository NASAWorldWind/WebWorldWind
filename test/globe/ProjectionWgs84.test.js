/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
        'src/globe/ElevationModel',
        'src/globe/Globe',
        'src/geom/Position',
        'src/projections/ProjectionWgs84',
        'src/geom/Vec3',
        'test/CustomMatchers.test'
    ],
    function (ElevationModel,
              Globe,
              Position,
              ProjectionWgs84,
              Vec3,
              CustomMatchers) {
        "use strict";

        describe("ProjectionWgs84 tests", function () {
            // WGS 84 reference values taken from
            // http://earth-info.nga.mil/GandG/publications/NGA_STND_0036_1_0_0_WGS84/NGA.STND.0036_1.0.0_WGS84.pdf
            var WGS84_IERS_REFERENCE_MERIDIAN = vec3FromEcef(6378137.0, 0, 0);
            var WGS84_IERS_REFERENCE_MERIDIAN_NORMAL = vec3FromEcef(1, 0, 0);
            var WGS84_IERS_REFERENCE_MERIDIAN_TANGENT = vec3FromEcef(0, 0, 1);
            var WGS84_IERS_REFERENCE_POLE = vec3FromEcef(0, 0, 6356752.3142);
            var WGS84_IERS_REFERENCE_POLE_NORMAL = vec3FromEcef(0, 0, 1);
            var WGS84_IERS_REFERENCE_POLE_TANGENT = vec3FromEcef(-1, 0, 0);

            /*
             * Map of geographic and cartesian coordinates at known locations taken from
             * http://earth-info.nga.mil/GandG/publications/tr8350.2/Addendum%20NIMA%20TR8350.2.pdf
             *
             * Geodetic Coordinates 2001 epoch:
             * Air Force Station    Station  Lat             Lon             Ellipsoid Height
             * -------------------------------------------------------------------------------
             * Colorado Springs      85128   38.80305456     255.47540844    1911.755
             * Ascension             85129   -7.95132970     345.58786950    106.558
             * Diego Garcia          85130   -7.26984347     72.37092177     -64.063
             * Kwajalein             85131   8.72250074      167.73052625    39.927
             * Hawaii                85132   21.56149086     201.76066922    426.077
             * Cape Canaveral        85143   28.48373800     279.42769549    -24.005
             *
             * Cartesian Coordinates 2001 epoch (ECEF coordinates positive Z points up)
             * Air Force Station    Station  X(km)           Y(km)           Z(km)
             * -------------------------------------------------------------------------------
             * Colorado Springs      85128   -1248.597295    -4819.433239    3976.500175
             * Ascension             85129   6118.524122     -1572.350853    -876.463990
             * Diego Garcia          85130   1916.197142     6029.999007     -801.737366
             * Kwajalein             85131   -6160.884370    1339.851965     960.843071
             * Hawaii                85132   -5511.980484    -2200.247093    2329.480952
             * Cape Canaveral        85143   918.988120      -5534.552966    3023.721377
             */
            var ngaReferenceStations = {
                "Colorado Springs": {
                    geographic: new Position(38.80305456, 255.47540844, 1911.755),
                    cartesian: vec3FromEcef(-1248.597295e3, -4819.433239e3, 3976.500175e3)
                },
                "Ascension": {
                    geographic: new Position(-7.95132970, 345.58786950, 106.558),
                    cartesian: vec3FromEcef(6118.524122e3, -1572.350853e3, -876.463990e3)
                },
                "Diego Garcia": {
                    geographic: new Position(-7.26984347, 72.37092177, -64.063),
                    cartesian: vec3FromEcef(1916.197142e3, 6029.999007e3, -801.737366e3)
                },
                "Kwajalein": {
                    geographic: new Position(8.72250074, 167.73052625, 39.927),
                    cartesian: vec3FromEcef(-6160.884370e3, 1339.851965e3, 960.843071e3)
                },
                "Hawaii": {
                    geographic: new Position(21.56149086, 201.76066922, 426.077),
                    cartesian: vec3FromEcef(-5511.980484e3, -2200.247093e3, 2329.480952e3)
                },
                "Cape Canaveral": {
                    geographic: new Position(28.48373800, 279.42769549, -24.005),
                    cartesian: vec3FromEcef(918.988120e3, -5534.552966e3, 3023.721377e3)
                }
            };

            /**
             * Creates a Vec3 in the WorldWind coordinate system from WGS84 ECEF coordinates.
             */
            function vec3FromEcef(x, y, z) {
                return new Vec3(y, z, x);
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
                    Math.sin(latRad)
                );
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
                    Math.cos(latRad));
            }

            beforeEach(function () {
                jasmine.addMatchers(CustomMatchers);
            });

            it("transforms geographic coordinates to Cartesian at the IERS Reference Meridian (IRM)", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                var result = wgs84.geographicToCartesian(globe, 0, 0, 0, null, new Vec3());

                expect(result).toEqualVec3(WGS84_IERS_REFERENCE_MERIDIAN, 1.0e-9);
            });

            it("transforms geographic coordinates to Cartesian at the IERS Reference Pole (IRP)", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                var result = wgs84.geographicToCartesian(globe, 90, 0, 0, null, new Vec3());

                expect(result).toEqualVec3(WGS84_IERS_REFERENCE_POLE, 1.0e-9);
            });

            it("transforms geographic coordinates to Cartesian with reference coordinates", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                for (var name in ngaReferenceStations) {
                    if (ngaReferenceStations.hasOwnProperty(name)) {
                        var pos = ngaReferenceStations[name].geographic;
                        var point = ngaReferenceStations[name].cartesian;

                        var result = wgs84.geographicToCartesian(globe, pos.latitude, pos.longitude, pos.altitude, null, new Vec3());

                        expect(result).toEqualVec3(point, 1.0e-9);
                    }
                }
            });

            it("transforms Cartesian coordinates to geographic with reference coordinates", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                for (var name in ngaReferenceStations) {
                    if (ngaReferenceStations.hasOwnProperty(name)) {
                        var pos = ngaReferenceStations[name].geographic;
                        var point = ngaReferenceStations[name].cartesian;

                        var result = wgs84.cartesianToGeographic(globe, point[0], point[1], point[2], null, new Position());

                        expect(result).toEqualPosition(pos, 1.0e-9);
                    }
                }
            });

            it("transforms geographic coordinates to Cartesian, then back to geographic", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                for (var name in ngaReferenceStations) {
                    if (ngaReferenceStations.hasOwnProperty(name)) {
                        var pos = ngaReferenceStations[name].geographic;

                        var resultPoint = wgs84.geographicToCartesian(globe, pos.latitude, pos.longitude, pos.altitude, null, new Vec3());
                        var resultPos = wgs84.cartesianToGeographic(globe, resultPoint[0], resultPoint[1], resultPoint[2], null, new Position());

                        expect(resultPos).toEqualPosition(pos, 1.0e-9);
                    }
                }
            });

            it("transforms Cartesian coordinates to geographic, then back to Cartesian", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                for (var name in ngaReferenceStations) {
                    if (ngaReferenceStations.hasOwnProperty(name)) {
                        var point = ngaReferenceStations[name].cartesian;

                        var resultPos = wgs84.cartesianToGeographic(globe, point[0], point[1], point[2], null, new Position());
                        var resultPoint = wgs84.geographicToCartesian(globe, resultPos.latitude, resultPos.longitude, resultPos.altitude, null, new Vec3());

                        expect(resultPoint).toEqualVec3(point, 1.0e-9);
                    }
                }
            });

            it("computes the Cartesian normal at the IERS Reference Meridian (IRM)", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);
                var point = WGS84_IERS_REFERENCE_MERIDIAN;

                var result = wgs84.surfaceNormalAtPoint(globe, point[0], point[1], point[2], new Vec3());

                expect(result).toEqualVec3(WGS84_IERS_REFERENCE_MERIDIAN_NORMAL, 1.0e-9);
            });

            it("computes the Cartesian normal at the IERS Reference Pole (IRP)", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);
                var point = WGS84_IERS_REFERENCE_POLE;

                var result = wgs84.surfaceNormalAtPoint(globe, point[0], point[1], point[2], new Vec3());

                expect(result).toEqualVec3(WGS84_IERS_REFERENCE_POLE_NORMAL, 1.0e-9);
            });

            it("computes the Cartesian normal at reference Cartesian coordinates", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                for (var name in ngaReferenceStations) {
                    if (ngaReferenceStations.hasOwnProperty(name)) {
                        var pos = ngaReferenceStations[name].geographic;
                        var point = ngaReferenceStations[name].cartesian;
                        var normal = wgs84EllipsoidNormal(pos.latitude, pos.longitude);

                        var result = wgs84.surfaceNormalAtPoint(globe, point[0], point[1], point[2], new Vec3());

                        expect(result).toEqualVec3(normal, 1.0e-9);
                    }
                }
            });

            it("computes the Cartesian tangent at the IERS Reference Meridian (IRM)", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                var result = wgs84.northTangentAtLocation(globe, 0, 0, new Vec3());

                expect(result).toEqualVec3(WGS84_IERS_REFERENCE_MERIDIAN_TANGENT, 1.0e-9);
            });

            it("computes the Cartesian tangent at the IERS Reference Pole (IRP)", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                var result = wgs84.northTangentAtLocation(globe, 90, 0, new Vec3());

                expect(result).toEqualVec3(WGS84_IERS_REFERENCE_POLE_TANGENT, 1.0e-9);
            });

            it("computes the Cartesian tangent at reference geographic coordinates", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                for (var name in ngaReferenceStations) {
                    if (ngaReferenceStations.hasOwnProperty(name)) {
                        var pos = ngaReferenceStations[name].geographic;
                        var tangent = wgs84GeodeticNorth(pos.latitude, pos.longitude);

                        var result = wgs84.northTangentAtLocation(globe, pos.latitude, pos.longitude, new Vec3());

                        expect(result).toEqualVec3(tangent, 1.0e-9);
                    }
                }
            });

            it("computes the Cartesian tangent at reference Cartesian coordinates", function () {
                var wgs84 = new ProjectionWgs84();
                var globe = new Globe(new ElevationModel(), wgs84);

                for (var name in ngaReferenceStations) {
                    if (ngaReferenceStations.hasOwnProperty(name)) {
                        var pos = ngaReferenceStations[name].geographic;
                        var point = ngaReferenceStations[name].cartesian;
                        var tangent = wgs84GeodeticNorth(pos.latitude, pos.longitude);

                        var result = wgs84.northTangentAtPoint(globe, point[0], point[1], point[2], null, new Vec3());

                        expect(result).toEqualVec3(tangent, 1.0e-9);
                    }
                }
            });
        });
    });