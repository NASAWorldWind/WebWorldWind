/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLocation',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLocation,
    XmlDocument
) {
    "use strict";
    TestCase("KmlLocationTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Location>" +
                "   <longitude>45.0</longitude>" +
                "   <latitude>10.0</latitude>" +
                "   <altitude>0.0</altitude>" +
                "</Location>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var location = new KmlLocation({objectNode:
                kmlRepresentation.getElementsByTagName("Location")[0]});

            assertEquals(45.0, location.kmlLongitude);
            assertEquals(10.0, location.kmlLatitude);
            assertEquals(0.0, location.kmlAltitude);
        })
    })
});