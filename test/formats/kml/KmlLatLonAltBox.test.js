/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLatLonAltBox',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLatLonAltBox,
    XmlDocument
) {
    "use strict";
    TestCase("KmlLatLonAltBoxTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<LatLonAltBox>" +
                "   <north>48.25475939255556</north>" +
                "   <south>48.25207367852141</south>" +
                "   <east>-90.86591508839973</east>" +
                "   <west>-90.8714285289695</west>Kml" +
                "   <minAltitude>10</minAltitude>" +
                "   <maxAltitude>20</maxAltitude>" +
                "</LatLonAltBox>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lod = new KmlLatLonAltBox({objectNode:
                kmlRepresentation.getElementsByTagName("LatLonAltBox")[0]});

            assertEquals(48.25475939255556, lod.kmlNorth);
            assertEquals(48.25207367852141, lod.kmlSouth);
            assertEquals(-90.86591508839973, lod.kmlEast);
            assertEquals(-90.8714285289695, lod.kmlWest);
            assertEquals(10, lod.kmlMinAltitude);
            assertEquals(20, lod.kmlMaxAltitude);
        })
    })
});