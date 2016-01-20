/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlOrientation',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlOrientation,
    XmlDocument
) {
    "use strict";
    TestCase("KmlOrientationTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Orientation>" +
                "   <heading>45.0</heading>" +
                "   <tilt>10.0</tilt>" +
                "   <roll>0.0</roll>" +
                "</Orientation>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var orientation = new KmlOrientation({objectNode:
                kmlRepresentation.getElementsByTagName("Orientation")[0]});

            assertEquals(45.0, orientation.kmlHeading);
            assertEquals(10.0, orientation.kmlTilt);
            assertEquals(0.0, orientation.kmlRoll);
        })
    })
});