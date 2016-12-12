/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Line',
    'src/geom/Vec3'
], function (Line,
             Vec3) {
    "use strict";

    describe("Line", function () {
        describe('#pointAt', function () {
            it('points to correct direction', function () {
                var underTest = new Line(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
                var distance = -2.0;
                var expected = new Vec3(-7.0, -8.0, -9.0);
                var result = new Vec3();

                underTest.pointAt(distance, result);

                expect(expected.equals(result)).toBe(true);
            });
        });
    });
});