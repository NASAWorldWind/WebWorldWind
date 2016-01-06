/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlCamera',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlCamera,
    XmlDocument
) {
    "use strict";
    TestCase("KmlCameraTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Camera>" +
                "   <longitude>10</longitude>" +
                "   <latitude>9</latitude>" +
                "   <altitude>8</altitude>" +
                "   <heading>1</heading>" +
                "   <tilt>7</tilt>" +
                "   <roll>6</roll>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "</Camera>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var camera = new KmlCamera({objectNode:
                kmlRepresentation.getElementsByTagName("Camera")[0]});

            assertEquals(10, camera.kmlLongitude);
            assertEquals(9, camera.kmlLatitude);
            assertEquals(8, camera.kmlAltitude);
            assertEquals(1, camera.kmlHeading);
            assertEquals(7, camera.kmlTilt);
            assertEquals(6, camera.kmlRoll);
            assertEquals("clampToGround", camera.kmlAltitudeMode);
        })
    })
});