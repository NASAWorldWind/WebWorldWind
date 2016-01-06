/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/styles/KmlStyleMap',
    'src/formats/kml/util/Pair',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlStyleMap,
    Pair,
    XmlDocument
) {
    "use strict";
    TestCase("KmlStyleMapTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<StyleMap>" +
                "   <Pair></Pair>" +
                "</StyleMap>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var styleMap = new KmlStyleMap({objectNode:
                kmlRepresentation.getElementsByTagName("StyleMap")[0]});

            assertTrue(styleMap.kmlPairs[0] instanceof Pair);
        })
    })
});