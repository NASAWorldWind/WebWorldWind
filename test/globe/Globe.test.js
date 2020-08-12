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
define(['src/WorldWind'], function (WorldWind) {
    "use strict";

    describe("Globe tests", function () {
        // WGS 84 reference values taken from
        // http://earth-info.nga.mil/GandG/publications/NGA_STND_0036_1_0_0_WGS84/NGA.STND.0036_1.0.0_WGS84.pdf
        var WGS84_REFERENCE_SEMI_MAJOR_RADIUS = 6378137.0;
        var WGS84_REFERENCE_SEMI_MINOR_RADIUS = 6356752.3142;
        var WGS84_REFERENCE_EC2 = 6.694379990141e-3;

        // From Radius of the Earth - Radii Used in Geodesy
        // J. Clynch, Naval Post Graduate School, 2002
        function wgs84ReferenceRadiusAt(latitude) {
            var sinLatSquared = Math.pow(Math.sin(latitude * Math.PI / 180), 2);
            var cosLatSquared = Math.pow(Math.cos(latitude * Math.PI / 180), 2);
            var a = WGS84_REFERENCE_SEMI_MAJOR_RADIUS;
            var eSquared = WGS84_REFERENCE_EC2;
            var radius = a * Math.sqrt(Math.pow(1 - eSquared, 2.0) * sinLatSquared + cosLatSquared);
            radius /= Math.sqrt(1 - eSquared * sinLatSquared);
            return radius;
        }

        it("has an equatorial radius matching the WGS84 reference value", function () {
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), new WorldWind.ProjectionWgs84());

            // Expect an exact match to the reference value.
            expect(globe.equatorialRadius).toBe(WGS84_REFERENCE_SEMI_MAJOR_RADIUS);
        });

        it("has a polar radius matching the WGS84 reference value", function () {
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), new WorldWind.ProjectionWgs84());

            // WGS84 reference value: 6356752.3142
            // Actual computed value: 6356752.314245179
            // Match the four decimals specified by the reference value. Additional precision is acceptable.
            expect(globe.polarRadius).toBeCloseTo(WGS84_REFERENCE_SEMI_MINOR_RADIUS, 4);
        });

        it("has an eccentricity squared matching the WGS84 reference value", function () {
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), new WorldWind.ProjectionWgs84());

            // WGS84 reference value: 6.694379990141e-3
            // Actual computed value: 6.6943799901413165e-3
            // Match the fifteen decimals specified by the reference value. Additional precision is acceptable.
            expect(globe.eccentricitySquared).toBeCloseTo(WGS84_REFERENCE_EC2, 15);
        });

        it("computes the WGS84 ellipsoid's radius at integer latitudes", function () {
            var globe = new WorldWind.Globe(new WorldWind.ElevationModel(), new WorldWind.ProjectionWgs84());

            for (var lat = -90; lat <= 90; lat += 1.0) {
                var radiusExpected = wgs84ReferenceRadiusAt(lat);
                var radiusActual = globe.radiusAt(lat, 0);

                // Match the first eight decimals.
                expect(radiusActual).toBeCloseTo(radiusExpected, 8);
            }
        });
    });
});