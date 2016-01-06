/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLod',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLod,
    XmlDocument
) {
    "use strict";
    TestCase("KmlLodTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Lod>" +
                "   <minLodPixels>256</minLodPixels>" +
                "   <maxLodPixels>-1</maxLodPixels>" +
                "   <minFadeExtent>0</minFadeExtent>" +
                "   <maxFadeExtent>0</maxFadeExtent>" +
                "</Lod>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lod = new KmlLod({objectNode:
                kmlRepresentation.getElementsByTagName("Lod")[0]});

            assertEquals(256, lod.kmlMinLodPixels);
            assertEquals(-1, lod.kmlMaxLodPixels);
            assertEquals(0, lod.kmlMinFadeExtent);
            assertEquals(0, lod.kmlMaxFadeExtent);
        })
    })
});