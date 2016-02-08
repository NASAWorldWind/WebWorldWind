/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlIcon',
    'src/formats/kml/features/KmlOverlay',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlIcon,
    KmlOverlay,
    XmlDocument
) {
    "use strict";
    TestCase("KmlOverlayTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Overlay>" +
                "   <color>ffffffff</color>" +
                "   <drawOrder>1</drawOrder>" +
                "   <Icon></Icon>" +
                "</Overlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var overlay = new KmlOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("Overlay")[0]});

            assertEquals('ffffffff', overlay.kmlColor);
            assertEquals(1, overlay.kmlDrawOrder);

            assertTrue(overlay.kmlIcon instanceof KmlIcon);
        })
    })
});