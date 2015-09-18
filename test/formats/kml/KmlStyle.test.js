/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest'
], function(
    CatchTest
) {
    TestCase("KmlStyleTestCase", {
        testParseValidStyle: CatchTest(function () {
            fail("Not Implemented Yet");
        })
    });
});