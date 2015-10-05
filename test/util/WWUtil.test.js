/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/util/WWUtil'
], function (
    CatchTest,
    WWUtil
) {
    "use strict";
    TestCase("WWUtil-arrayEquals", {
        testEqualArrays: CatchTest(function(){
            var array1 = [1,2,3];
            var array2 = [1,2,3];

            assertTrue(WWUtil.arrayEquals(array1, array2));
        }),

        testDifferentArraysDifferentLength: CatchTest(function(){
            var array1 = [1,2,3];
            var array2 = [1,2,3,4];

            assertFalse(WWUtil.arrayEquals(array1, array2));
        }),

        testDifferentArraysSameLength: CatchTest(function(){
            var array1 = [1,2,3];
            var array2 = [1,5,3];

            assertFalse(WWUtil.arrayEquals(array1, array2));
        }),

        testObjectsWithEquals: CatchTest(function(){
            var array1 = [{equals: function(){return true}}];
            var array2 = [1];

            assertTrue(WWUtil.arrayEquals(array1, array2));
        })
    });

    TestCase("WWUtil-transformToBoolean", {
        testTransformToBoolean0: CatchTest(function(){
            assertFalse(WWUtil.transformToBoolean(0));
            assertFalse(WWUtil.transformToBoolean("0"));
        }),

        testTransformToBooleanFalse: CatchTest(function(){
            assertFalse(WWUtil.transformToBoolean("false"));
            assertFalse(WWUtil.transformToBoolean(false));
        }),

        testTransformToBooleanTrue: CatchTest(function(){
            assertTrue(WWUtil.transformToBoolean(true));
            assertTrue(WWUtil.transformToBoolean("true"));
            assertTrue(WWUtil.transformToBoolean("1"));
            assertTrue(WWUtil.transformToBoolean(1));
        })
    });
});