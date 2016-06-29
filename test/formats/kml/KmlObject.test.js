/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/formats/kml/KmlObject'
], function(
    CatchTest,
    KmlObject
){
    TestCase("KmlObjectTestCase", {
        "testUndefinedNode": CatchTest(function() {
            try {
                new KmlObject();
                fail("Exception should have been thrown");
            } catch(e) {
                assertEquals("ArgumentError", e.name);
            }
        }),

        testNullNode: CatchTest(function() {
            try {
                new KmlObject(null,{});
                fail("Exception should have been thrown");
            } catch(e) {
                assertEquals("ArgumentError", e.name);
            }
        })
    });
});