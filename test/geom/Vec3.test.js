/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Vec3'
], function (Vec3) {
    "use strict";

    describe("Vec3Test", function() {
        var vec3 = new Vec3(9, 8, 7);
        it("should have the correct three components", function() {
            expect(vec3[0]).toEqual(9);
            expect(vec3[1]).toEqual(8);
            expect(vec3[2]).toEqual(7);
      });
    });
});