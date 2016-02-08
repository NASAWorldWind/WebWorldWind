/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/util/Color'
], function (
    CatchTest,
    Color
) {
    "use strict";
    TestCase("Color-colorFromHex", {
        testValidWhiteHex: CatchTest(function() {
            var result = Color.colorFromHex("ffffffff");
            assertTrue(result.equals(new Color(1,1,1,1)));
        }),

        testValidBlackHex: CatchTest(function() {
            var result = Color.colorFromHex("000000ff");
            assertTrue(result.equals(new Color(0,0,0,1)));
        })
    })
});