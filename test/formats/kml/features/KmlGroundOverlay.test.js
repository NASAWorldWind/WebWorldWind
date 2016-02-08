/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/features/KmlGroundOverlay',
    'src/formats/kml/KmlLatLonBox',
    'src/formats/kml/KmlLatLonQuad',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlGroundOverlay,
    KmlLatLonBox,
    KmlLatLonQuad,
    XmlDocument
) {
    "use strict";
    TestCase("KmlGroundOverlayTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">>" +
                "<GroundOverlay>" +
                "   <altitude>0</altitude>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "   <LatLonBox></LatLonBox>" +
                "   <gx:LatLonQuad></gx:LatLonQuad>" +
                "</GroundOverlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var groundOverlay = new KmlGroundOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("GroundOverlay")[0]});

            assertEquals(0, groundOverlay.kmlAltitude);
            assertEquals('clampToGround', groundOverlay.kmlAltitudeMode);

            assertTrue(groundOverlay.kmlLatLonBox instanceof KmlLatLonBox);
            assertTrue(groundOverlay.kmlLatLonQuad instanceof KmlLatLonQuad);
        })
    })
});