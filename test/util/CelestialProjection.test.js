/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

define([
        'src/util/CelestialProjection'
    ],
    function (CelestialProjection) {
        'use strict';

        describe('CelestialProjectionTest', function () {

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
                        return CelestialProjection.computeSunGeographicLocation(date);
                    });
                    expectedLocations.forEach(function (expectedResult, i) {
                        expect(expectedResult.latitude).toBeCloseTo(computedLocations[i].latitude);
                        expect(expectedResult.longitude).toBeCloseTo(computedLocations[i].longitude);
                    });
                });

            });

            describe('Computes the Sun\'s celestial location', function () {

                it('Computes the Sun\'s celestial location', function () {
                    var julianDates = [2457755, 2457924.25, 2457926.75, 2457967.0833333335, 2458107.1666666665,
                        2458110.4166666665];
                    var expectedLocations = [
                        {declination: -22.958797136581314, rightAscension: 282.2493341054377},
                        {declination: 23.42944558814554, rightAscension: 88.51710113901169},
                        {declination: 23.432472410610977, rightAscension: 91.11722505541856},
                        {declination: 17.86912793173116, rightAscension: 131.95106393893616},
                        {declination: -23.420379101540863, rightAscension: 267.75877297672787},
                        {declination: -23.430434209235372, rightAscension: 271.36570946223924},
                    ];
                    var computedLocations = julianDates.map(function (julianDate) {
                        return CelestialProjection.computeSunCelestialLocation(julianDate);
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
                        {latitude: -22.958797136581314, longitude: 40.661307168340386},
                        {latitude: 23.42944558814554, longitude: -153.07092579808563},
                        {latitude: 23.432472410610977, longitude: -150.47080188167877},
                        {latitude: 17.86912793173116, longitude: -109.63696299816115},
                        {latitude: -23.420379101540863, longitude: 26.170746039630558},
                        {latitude: -23.430434209235372, longitude: 29.777682525141927}
                    ];
                    var geographicLocations = celestialLocations.map(function (celestialLocation) {
                        return CelestialProjection.celestialToGeographic(celestialLocation, 0);
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
                        return CelestialProjection.computeJulianDate(date);
                    });
                    expectedJulianDates.forEach(function (expectedResult, i) {
                        expect(expectedResult).toBeCloseTo(computedJulianDates[i]);
                    });

                });

            });

            describe('Normalize an angle to be between [0, 360)', function () {

                it('Normalize an angle to be between [0, 360)', function () {
                    var angles = [0, -10, 360, 1000];
                    var expectedAngles = [0, 350, 0, 280];
                    var computedAngles = angles.map(function (angle) {
                        return CelestialProjection.normalizeAngle(angle);
                    });
                    expectedAngles.forEach(function(expectedResult, i){
                        expect(expectedResult).toBeCloseTo(computedAngles[i]);
                    });

                });

            });

        });

    });
