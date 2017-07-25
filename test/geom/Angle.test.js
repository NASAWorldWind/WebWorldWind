/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Angle'
], function (Angle) {
    "use strict";

    describe("AngleTest", function () {

        describe("Normalizes a value in the range of [-180, 180] degrees", function () {

            it("Normalizes an angle", function () {
                var normalized = Angle.normalizedDegrees(190);
                expect(normalized).toEqual(-170);
            });

            it("Normalizes a full angle", function () {
                var normalized = Angle.normalizedDegrees(360);
                expect(normalized).toEqual(0);
            });

            it("Normalizes an undefined angle", function () {
                var normalized = Angle.normalizedDegrees(undefined);
                expect(normalized).toEqual(NaN);
            });

            it("Normalizes a NaN", function () {
                var normalized = Angle.normalizedDegrees(NaN);
                expect(normalized).toEqual(NaN);
            });
        });

        describe("Normalizes a Latitude value in the range of [-90, 90] degrees", function () {

            it("Normalizes a positive angle", function () {
                var normalized = Angle.normalizedDegreesLatitude(190);
                expect(normalized).toEqual(10);
            });

            it("Normalizes a negative angle", function () {
                var normalized = Angle.normalizedDegreesLatitude(-91);
                expect(normalized).toEqual(-89);
            });

            it("Normalizes a full angle", function () {
                var normalized = Angle.normalizedDegreesLatitude(360);
                expect(normalized).toEqual(0);
            });
        });

        describe("Normalizes a Longitude value in the range of [-180, 180] degrees", function () {

            it("Normalizes a positive angle", function () {
                var normalized = Angle.normalizedDegreesLongitude(190);
                expect(normalized).toEqual(-170);
            });

            it("Normalizes a negative angle", function () {
                var normalized = Angle.normalizedDegreesLongitude(-460);
                expect(normalized).toEqual(-100);
            });
        });

        describe("Normalizes a specified value to be within the range of [-Pi, Pi] radians", function () {

            it("Normalizes a 45 degree angle", function () {
                var normalized = Angle.normalizedRadians(45);
                expect(normalized).toBeCloseTo(1.017,2);
            });

            it("Normalizes a 60 degree angle", function () {
                var normalized = Angle.normalizedRadians(60);
                expect(normalized).toBeCloseTo(-2.831,2);
            });
        });

        describe("Normalizes a specified value to be within the range of [-Pi/2, Pi/2] radians.", function () {

            it("Normalizes a 60 degree angle", function () {
                var normalized = Angle.normalizedRadiansLatitude(60);
                expect(normalized).toBeCloseTo(0.3097, 2);
            });

            it("Normalizes an 88 degree angle", function () {
                var normalized = Angle.normalizedRadiansLatitude(88);
                expect(normalized).toBeCloseTo(0.0354, 2);
            });
        });

        describe("Normalizes a specified value to be within the range of [-Pi/2, Pi/2] radians", function () {
            it("Normalizes a 60 degree angle", function () {
                var normalized = Angle.normalizedRadiansLongitude(60);
                expect(normalized).toBeCloseTo(-2.831, 2);
            });

            it("Normalizes a 180 degree angle", function () {
                var normalized = Angle.normalizedRadiansLongitude(180);
                expect(normalized).toBeCloseTo(-2.212, 2);
            });
        });

        describe("Indicates whether a specified value is within the normal range of latitude, [-90, 90]", function () {

            it("Valid latitude", function () {
                var validLatitude = Angle.isValidLatitude(60);
                expect(validLatitude).toEqual(true);
            });

            it("Not valid latitude", function () {
                var invalidLatitude = Angle.isValidLatitude(150);
                expect(invalidLatitude).toEqual(false);
            });
        });

        describe("Indicates whether a specified value is within the normal range of longitude, [-180, 180]", function () {

            it("Valid longitude", function () {
                var validLongitude = Angle.isValidLongitude(150);
                expect(validLongitude).toEqual(true);
            });

            it("Not valid longitude", function () {
                var invalidLongitude = Angle.isValidLongitude(-250);
                expect(invalidLongitude).toEqual(false);
            });
        });

        describe("Returns a decimal degrees string representation of a specified value in degrees", function () {

            it("Positive degrees", function () {
                var angle = Angle.toDecimalDegreesString(150);
                expect(angle).toEqual("150\u00B0");
            });

            it("Negative degrees", function () {
                var angle = Angle.toDecimalDegreesString(-150);
                expect(angle).toEqual("-150\u00B0");
            });
        });

        describe("Returns a degrees-minutes-seconds string representation of a specified value in degrees", function () {

            it("Integer angle", function () {
                var angle = Angle.toDMSString(150);
                expect(angle).toEqual("150\u00B0 0\u2019 0\u201D");
            });

            it("Not integer angle with two decimals expecting minutes", function () {
                var angle = Angle.toDMSString(270.65);
                expect(angle).toEqual("270\u00B0 39\u2019 0\u201D");
            });

            it("Not integer angle with five decimals expecting seconds", function () {
                var angle = Angle.toDMSString(50.50556);
                expect(angle).toEqual("50\u00B0 30\u2019 20\u201D");
            });
        });

    });
});