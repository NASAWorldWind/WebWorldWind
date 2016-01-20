/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Vec3.test.js 2498 2014-12-01 22:21:09Z danm $
 */
require({
    baseUrl: '/test/'
}, [
    'src/geom/Vec3'
], function (Vec3) {
    var Vec3Test = TestCase("Vec3Test");
    Vec3Test.prototype.testCtor = function () {
        var vec3 = new Vec3(9, 8, 7);

        assertEquals(9, vec3[0]);
        assertEquals(8, vec3[1]);
        assertEquals(7, vec3[2]);
    };
});
