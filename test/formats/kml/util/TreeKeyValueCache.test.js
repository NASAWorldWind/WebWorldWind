/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/TreeKeyValueCache'
], function (CatchTest,
             TreeKeyValueCache) {
    "use strict";

    var cache = null;
    TestCase('TreeKeyValueCache-retrieval', {
        setUp: function () {
            cache = new TreeKeyValueCache();
            cache.add("MultiGeometry#1", "LineString#1", "ToStore");
            cache.add("MultiGeometry#1", "LineString#2", "ToStore2");
            cache.add("MultiGeometry#2", "LineString#1", "ToStore3");
        },

        testRetrievingTheSpecificPieceOfData: CatchTest(function () {
            var retrievedValue = cache.value("MultiGeometry#1", "LineString#1");
            assertEquals("ToStore", retrievedValue);
        }),

        testRetrievingDataForWholeLevel: CatchTest(function () {
            var level = cache.level("MultiGeometry#1");
            assertEquals("ToStore", level["LineString#1"]);
            assertEquals("ToStore2", level["LineString#2"]);
        }),

        testRetrieveTheUnspecifiedAmountOfData: CatchTest(function () {
            var retrievedValue = cache.value("MultiGeometry#1", "LineString");
            assertEquals("ToStore", retrievedValue);
        })
    });

    TestCase('TreeKeyValueCache-removal', {
        setUp: function () {
            cache = new TreeKeyValueCache();
            cache.add("MultiGeometry#1", "LineString#1", "ToStore");
            cache.add("MultiGeometry#1", "LineString#2", "ToStore2");
            cache.add("MultiGeometry#2", "LineString#1", "ToStore3");

            cache.remove("MultiGeometry#1", "LineString#2");
        },

        testRetrievingTheSpecificPieceOfData: CatchTest(function () {
            assertEquals(null, cache.value("MultiGeometry#1", "LineString#2"));
        })
    });
});