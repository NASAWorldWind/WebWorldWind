/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/Pair',
    'src/formats/kml/styles/KmlStyle',
    'src/util/XmlDocument'
], function (
    CatchTest,
    Pair,
    KmlStyle,
    XmlDocument
) {
    "use strict";
    TestCase("KmlPairTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Pair>" +
                "   <key>normal</key>" +
                "   <styleUrl>validUrl</styleUrl>" +
                "   <Style></Style>" +
                "</Pair>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var scale = new Pair({objectNode:
                kmlRepresentation.getElementsByTagName("Pair")[0]});

            assertEquals('normal', scale.kmlKey);
            assertEquals('validUrl', scale.kmlStyleUrl);

            assertTrue(scale.kmlStyleSelector instanceof KmlStyle);
        })
    })
});