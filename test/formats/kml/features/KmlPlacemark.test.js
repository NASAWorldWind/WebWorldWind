/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/util/XmlDocument',
    'src/formats/kml/features/KmlPlacemark',
    'src/formats/kml/geom/KmlPoint'
], function (
    CatchTest,
    XmlDocument,
    KmlPlacemark,
    KmlPoint
) {
    "use strict";
    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<Placemark id=\"1\">" +
        "   <Point>" +
        "   </Point>" +
        "</Placemark>" +
        "</kml>";

    TestCase('KmlPlacemark', {
        testValidKml: CatchTest(function(){
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var placemark = new KmlPlacemark({objectNode:
                kmlRepresentation.getElementsByTagName("Placemark")[0]});

            assertTrue(placemark.kmlGeometry instanceof KmlPoint);
        })
    });
});