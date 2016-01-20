/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/features/KmlFolder',
    'src/formats/kml/features/KmlPlacemark',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlFolder,
    KmlPlacemark,
    XmlDocument
) {
    "use strict";
    TestCase("KmlFolderTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Document id=\"1\">" +
                "   <Placemark id=\"2\"></Placemark>" +
                "</Document>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var folder = new KmlFolder({objectNode:
                kmlRepresentation.getElementsByTagName("Document")[0]});

            assertEquals(1, folder.kmlShapes.length);
            assertTrue(folder.kmlShapes[0] instanceof KmlPlacemark);
        })
    })
});