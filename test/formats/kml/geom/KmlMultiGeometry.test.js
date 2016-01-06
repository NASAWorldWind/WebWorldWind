/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/formats/kml/geom/KmlMultiGeometry',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlMultiGeometry,
    XmlDocument
) {
    "use strict";
    TestCase("KmlMultiGeometryTest", {
        "testMultiGeometry": CatchTest(function() {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<MultiGeometry id=\"7\">" +
                "   <LineString id=\"8\">" +
                "       <coordinates>10,10,0 20,10,0</coordinates>" +
                "   </LineString>" +
                "   <LineString id=\"9\">" +
                "       <coordinates>10,20,0 20,20,0</coordinates>" +
                "   </LineString>" +
                "</MultiGeometry>" +
                "</kml>";

            var kmlRepresentation = new XmlDocument(validKml).dom();
            var multiGeometry = new KmlMultiGeometry({objectNode: kmlRepresentation.getElementsByTagName("MultiGeometry")[0]});

            assertEquals(multiGeometry.kmlShapes.length, 2);
        })
    });
});