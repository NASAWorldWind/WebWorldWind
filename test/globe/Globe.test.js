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
        'src/projections/ProjectionWgs84'
    ],
    function (
        ElevationModel,
        Globe,
        ProjectionWgs84) {
        "use strict";

        describe("Globe tests", function () {

            beforeAll(function () {
                // WGS 84 reference values taken from
                // http://earth-info.nga.mil/GandG/publications/NGA_STND_0036_1_0_0_WGS84/NGA.STND.0036_1.0.0_WGS84.pdf
                this.WGS84_REFERENCE_SEMI_MAJOR_AXIS = 6378137.0;
                this.WGS84_REFERENCE_SEMI_MINOR_AXIS = 6356752.3142;
                this.WGS84_REFERENCE_EC2 = 6.694379990141e-3;

                // From Radius of the Earth - Radii Used in Geodesy
                // J. Clynch, Naval Post Graduate School, 2002
                this.wgs84ReferenceRadiusAt = function (latitude) {
                    var sinLatSquared = Math.pow(Math.sin(latitude * Math.PI / 180), 2);
                    var cosLatSquared = Math.pow(Math.cos(latitude * Math.PI / 180), 2);
                    var a = this.WGS84_REFERENCE_SEMI_MAJOR_AXIS;
                    var eSquared = this.WGS84_REFERENCE_EC2;
                    var radius = a * Math.sqrt(Math.pow(1 - eSquared, 2.0) * sinLatSquared + cosLatSquared);
                    radius /= Math.sqrt(1 - eSquared * sinLatSquared);
                    return radius;
                };
            });

            beforeEach(function () {
                this.globe = new Globe(new ElevationModel(), new ProjectionWgs84());
            });

            it("has an equatorial radius matching the WGS84 reference value", function () {
                expect(this.globe.equatorialRadius).toBe(this.WGS84_REFERENCE_SEMI_MAJOR_AXIS);
            });

            it("has a polar radius matching the WGS84 reference value", function () {
                // WGS84 official value:  6356752.3142
                // Actual computed value: 6356752.314245179
                expect(this.globe.polarRadius).toBeCloseTo(this.WGS84_REFERENCE_SEMI_MINOR_AXIS, 4 /*match all decimal values specified; additional decimal values are ok*/);
            });

            it("has an eccentricity squared matching the WGS84 reference value", function () {
                expect(this.globe.eccentricitySquared).toBeCloseTo(this.WGS84_REFERENCE_EC2, 15 /*match all decimal values specified; additional decimal values are ok*/);
            });

            it("computes the WGS84 radius a different latitudes", function () {
                for (var lat = -90; lat <= 90; lat += 1.0) {
                    var radiusExpected = this.wgs84ReferenceRadiusAt(lat);
                    var radiusActual = this.globe.radiusAt(lat, 0);
                    expect(radiusActual).toBeCloseTo(radiusExpected, 8 /*match eight decimal places*/);
                }
            });
        });
    });