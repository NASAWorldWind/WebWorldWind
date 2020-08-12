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
        'src/util/SunPosition'
    ],
    function (SunPosition) {
        'use strict';

        describe('SunPosition Test', function () {

            describe('Compute the Sun\'s geographic location', function () {

                it('Computes the Sun\'s geographic location', function () {
                    var dates = [
                        new Date('2017-01-01T12:00:00.000Z'),
                        new Date('2017-06-19T18:00:00.000Z'),
                        new Date('2017-06-22T06:00:00.000Z'),
                        new Date('2017-08-01T14:00:00.000Z'),
                        new Date('2017-12-19T16:00:00.000Z'),
                        new Date('2017-12-22T22:00:00.000Z'),
                    ];
                    var expectedLocations = [
                        {latitude: -22.958797136581314, longitude: 0.9185710746913855},
                        {latitude: 23.42944558814554, longitude: -89.63447863631922},
                        {latitude: 23.432472410610977, longitude: 90.501526864205},
                        {latitude: 17.86912793173116, longitude: -28.41907808241126},
                        {latitude: -23.420379101540863, longitude: -60.68413749323872},
                        {latitude: -23.430434209235372, longitude: -150.2805549482439}
                    ];
                    var computedLocations = dates.map(function (date) {
                        return SunPosition.getAsGeographicLocation(date);
                    });
                    expectedLocations.forEach(function (expectedResult, i) {
                        expect(expectedResult.latitude).toBeCloseTo(computedLocations[i].latitude);
                        expect(expectedResult.longitude).toBeCloseTo(computedLocations[i].longitude);
                    });
                });

            });

            describe('Computes the Sun\'s celestial location', function () {

                it('Computes the Sun\'s celestial location', function () {
                    var dates = [
                        new Date('2017-01-01T12:00:00.000Z'),
                        new Date('2017-06-19T18:00:00.000Z'),
                        new Date('2017-06-22T06:00:00.000Z'),
                        new Date('2017-08-01T14:00:00.000Z'),
                        new Date('2017-12-19T16:00:00.000Z'),
                        new Date('2017-12-22T22:00:00.000Z'),
                    ];
                    var expectedLocations = [
                        {declination: -22.958797136581314, rightAscension: 282.2493341054377},
                        {declination: 23.42944558814554, rightAscension: 88.51710113901169},
                        {declination: 23.432472410610977, rightAscension: 91.11722505541856},
                        {declination: 17.86912793173116, rightAscension: 131.95106393893616},
                        {declination: -23.420379101540863, rightAscension: 267.75877297672787},
                        {declination: -23.430434209235372, rightAscension: 271.36570946223924},
                    ];
                    var computedLocations = dates.map(function (date) {
                        return SunPosition.getAsCelestialLocation(date);
                    });
                    expectedLocations.forEach(function (expectedResult, i) {
                        expect(expectedResult.declination).toBeCloseTo(computedLocations[i].declination);
                        expect(expectedResult.rightAscension).toBeCloseTo(computedLocations[i].rightAscension);
                    });
                });

            });

            describe('Convert celestial to geographic coordinates', function () {

                it('Convert celestial to geographic coordinates', function () {
                    var celestialLocations = [
                        {declination: -22.958797136581314, rightAscension: 282.2493341054377},
                        {declination: 23.42944558814554, rightAscension: 88.51710113901169},
                        {declination: 23.432472410610977, rightAscension: 91.11722505541856},
                        {declination: 17.86912793173116, rightAscension: 131.95106393893616},
                        {declination: -23.420379101540863, rightAscension: 267.75877297672787},
                        {declination: -23.430434209235372, rightAscension: 271.36570946223924},
                    ];
                    var expectedGeographicLocations = [
                        {latitude: -22.958797136581314, longitude: 91.16498291601772},
                        {latitude: 23.42944558814554, longitude: -102.56725005040829},
                        {latitude: 23.432472410610977, longitude: -99.96712613400142},
                        {latitude: 17.86912793173116, longitude: -59.13328725048382},
                        {latitude: -23.420379101540863, longitude: 76.67442178730789},
                        {latitude: -23.430434209235372, longitude: 80.28135827281926}
                    ];
                    var date = new Date('2017-01-01T06:00:00.000Z');
                    var geographicLocations = celestialLocations.map(function (celestialLocation) {
                        return SunPosition.celestialToGeographic(celestialLocation, date);
                    });
                    expectedGeographicLocations.forEach(function (expectedResult, i) {
                        expect(expectedResult.latitude).toBeCloseTo(geographicLocations[i].latitude);
                        expect(expectedResult.longitude).toBeCloseTo(geographicLocations[i].longitude);
                    });
                });

            });

            describe('Compute julian date', function () {

                it('Compute julian date', function () {
                    var dates = [
                        new Date('2017-01-01T12:00:00.000Z'),
                        new Date('2017-06-19T18:00:00.000Z'),
                        new Date('2017-06-22T06:00:00.000Z'),
                        new Date('2017-08-01T14:00:00.000Z'),
                        new Date('2017-12-19T16:00:00.000Z'),
                        new Date('2017-12-22T22:00:00.000Z'),
                    ];
                    var expectedJulianDates = [2457755, 2457924.25, 2457926.75, 2457967.0833333335, 2458107.1666666665,
                        2458110.4166666665];
                    var computedJulianDates = dates.map(function (date) {
                        return SunPosition.computeJulianDate(date);
                    });
                    expectedJulianDates.forEach(function (expectedResult, i) {
                        expect(expectedResult).toBeCloseTo(computedJulianDates[i]);
                    });

                });

            });

        });

    });
