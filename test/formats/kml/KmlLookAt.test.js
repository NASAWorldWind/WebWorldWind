/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLookAt',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLookAt,
    XmlDocument
) {
    "use strict";
    TestCase("KmlLookAtTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<LookAt>" +
                "   <longitude>10</longitude>" +
                "   <latitude>9</latitude>" +
                "   <altitude>8</altitude>" +
                "   <heading>1</heading>" +
                "   <tilt>7</tilt>" +
                "   <range>6</range>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "</LookAt>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lookAt = new KmlLookAt({objectNode:
                kmlRepresentation.getElementsByTagName("LookAt")[0]});

            assertEquals(10, lookAt.kmlLongitude);
            assertEquals(9, lookAt.kmlLatitude);
            assertEquals(8, lookAt.kmlAltitude);
            assertEquals(1, lookAt.kmlHeading);
            assertEquals(7, lookAt.kmlTilt);
            assertEquals(6, lookAt.kmlRange);
            assertEquals("clampToGround", lookAt.kmlAltitudeMode);
        })
    })
});