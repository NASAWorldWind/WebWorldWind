/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Vec3.test.js 2498 2014-12-01 22:21:09Z danm $
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/util/XmlDocument',
    'src/formats/kml/geom/KmlPoint'
], function (CatchTest,
             XmlDocument,
             KmlPoint) {
    TestCase("KmlPointTest", {
        testValidKml: CatchTest(function () {
            var kmlFile = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <extrude>true</extrude>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "   <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>" +
                "</Point>" +
                "</kml>";

            var kmlRepresentation = new XmlDocument(kmlFile).dom();
            var point = new KmlPoint({objectNode: kmlRepresentation.getElementsByTagName("Point")[0]});

            assertEquals(-122.0822035425683, point.kmlPosition.longitude);
            assertEquals(37.42228990140251, point.kmlPosition.latitude);
            assertEquals(0, point.kmlPosition.altitude);

            assertEquals(true, point.kmlExtrude);
            assertEquals("clampToGround", point.kmlAltitudeMode);

            assertEquals("1", point.id);
        })
    });
});
