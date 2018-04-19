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

            beforeAll(function () {
                /**
                 * Creates a Vec3 in the WorldWind coordinate system from WGS84 ECEF coordinates
                 */
                this.vec3FromEcef = function (x, y, z) {
                    return new Vec3(y, z, x);
                };

                /*
                 * Map of geographic and cartesian coordinates taken from
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
                this.referencePoints = {
                    "Colorado Springs": {
                        geographic: new Position(38.80305456, 255.47540844, 1911.755),
                        cartesian: this.vec3FromEcef(-1248.597295e3, -4819.433239e3, 3976.500175e3)
                    },
                    "Ascension": {
                        geographic: new Position(-7.95132970, 345.58786950, 106.558),
                        cartesian: this.vec3FromEcef(6118.524122e3, -1572.350853e3, -876.463990e3)
                    },
                    "Diego Garcia": {
                        geographic: new Position(-7.26984347, 72.37092177, -64.063),
                        cartesian: this.vec3FromEcef(1916.197142e3, 6029.999007e3, -801.737366e3)
                    },
                    "Kwajalein": {
                        geographic: new Position(8.72250074, 167.73052625, 39.927),
                        cartesian: this.vec3FromEcef(-6160.884370e3, 1339.851965e3, 960.843071e3)
                    },
                    "Hawaii": {
                        geographic: new Position(21.56149086, 201.76066922, 426.077),
                        cartesian: this.vec3FromEcef(-5511.980484e3, -2200.247093e3, 2329.480952e3)
                    },
                    "Cape Canaveral": {
                        geographic: new Position(28.48373800, 279.42769549, -24.005),
                        cartesian: this.vec3FromEcef(918.988120e3, -5534.552966e3, 3023.721377e3)
                    }
                };
            });

            beforeEach(function () {
                this.wgs84 = new ProjectionWgs84();
                this.globe = new Globe(new ElevationModel(), this.wgs84);
                jasmine.addMatchers(CustomMatchers);
            });

            it("computes Cartesian coordinates against values defined in the NIMA WGS specification", function () {

                for (var reference in this.referencePoints) {
                    if (this.referencePoints.hasOwnProperty(reference)) {
                        var pos = this.referencePoints[reference].geographic;
                        var point = this.referencePoints[reference].cartesian;

                        var result = this.wgs84.geographicToCartesian(this.globe, pos.latitude, pos.longitude, pos.altitude, null, new Vec3());

                        expect(result).toEqualVec3(point, 1.0e-9);
                    }
                }
            });

            it("performs a round-trip conversion from geographic to Cartesian and back", function () {
                var ref = new Position(34.2, -119.2, 1000); // KOXR airport

                var point = this.wgs84.geographicToCartesian(this.globe, ref.latitude, ref.longitude, ref.altitude, null, new Vec3());
                var result = this.wgs84.cartesianToGeographic(this.globe, point[0], point[1], point[2], null, new Position());

                expect(ref).toEqualPosition(result, 1.0e-9);
            });

            // it("computes a Cartesian normal matching a reference value", function () {
            //     var ref = new Position(34.2, -119.2, 1000); // KOXR airport
            //
            //     var result = // TODO
            // });
        });
    });