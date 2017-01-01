/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Angle'
], function (Angle) {
    "use strict";

    describe("AngleTest", function () {

        it("Normalizes a specified value to be within the range of [-180, 180] degrees", function () {
            //expected values
            var normalized = Angle.normalizedDegrees(190);
            expect(normalized).toEqual(-170);

            normalized = Angle.normalizedDegrees(360);
            expect(normalized).toEqual(0);

            //undefined or NaN testing
            normalized = Angle.normalizedDegrees(undefined);
            expect(normalized).toEqual(NaN);

            normalized = Angle.normalizedDegrees(NaN);
            expect(normalized).toEqual(NaN);
        });

        it("Normalizes a specified value to be within the range of [-90, 90] degrees", function () {
            var normalized = Angle.normalizedDegreesLatitude(190);
            expect(normalized).toEqual(10);

            normalized = Angle.normalizedDegreesLatitude(-91);
            expect(normalized).toEqual(-89);

            normalized = Angle.normalizedDegreesLatitude(360);
            expect(normalized).toEqual(0);
        });

        it("Normalizes a specified value to be within the range of [-180, 180] degrees", function () {
            var normalized = Angle.normalizedDegreesLongitude(190);
            expect(normalized).toEqual(-170);

            normalized = Angle.normalizedDegreesLongitude(460);
            expect(normalized).toEqual(100);
        });

        it("Normalizes a specified value to be within the range of [-Pi, Pi] radians", function () {
            var normalized = Angle.normalizedRadians(45);
            expect(normalized).toEqual(45-14*Math.PI);

            normalized = Angle.normalizedRadians(60);
            expect(normalized).toEqual(60-20*Math.PI);
        });

        it("Normalizes a specified value to be within the range of [-Pi/2, Pi/2] radians.", function () {
            var normalized = Angle.normalizedRadiansLatitude(60);
            expect(normalized).toBeCloseTo(60-19*Math.PI, 10);

            normalized = Angle.normalizedRadiansLatitude(88);
            expect(normalized).toBeCloseTo(88-28*Math.PI, 10);
        });

        it("Normalizes a specified value to be within the range of [-Pi/2, Pi/2] radians", function () {
            var normalized = Angle.normalizedRadiansLongitude(60);
            expect(normalized).toBeCloseTo(60-20*Math.PI, 10);

            normalized = Angle.normalizedRadiansLongitude(180);
            expect(normalized).toBeCloseTo(180-58*Math.PI, 10);
        });

        it("Indicates whether a specified value is within the normal range of latitude, [-90, 90]", function () {
            var validLatitude = Angle.isValidLatitude(60);
            expect(validLatitude).toEqual(true);

            var invalidLatitude = Angle.isValidLatitude(150);
            expect(invalidLatitude).toEqual(false);
        });

        it("Indicates whether a specified value is within the normal range of longitude, [-180, 180]", function () {
            var validLongitude = Angle.isValidLongitude(150);
            expect(validLongitude).toEqual(true);

            var invalidLongitude = Angle.isValidLongitude(-250);
            expect(invalidLongitude).toEqual(false);
        });

        it("Returns a decimal degrees string representation of a specified value in degrees", function () {
            var angle = Angle.toDecimalDegreesString(150);
            expect(angle).toEqual("150\u00B0");

            angle = Angle.toDecimalDegreesString(-150);
            expect(angle).toEqual("-150\u00B0");
        });

        it("Returns a degrees-minutes-seconds string representation of a specified value in degrees", function () {
            var angle = Angle.toDMSString(150);
            expect(angle).toEqual("150\u00B0 0\u2019 0\u201D");

            angle = Angle.toDMSString(270.65);
            expect(angle).toEqual("270\u00B0 39\u2019 0\u201D");

            angle = Angle.toDMSString(50.50556);
            expect(angle).toEqual("50\u00B0 30\u2019 20\u201D");
        });

    });
});