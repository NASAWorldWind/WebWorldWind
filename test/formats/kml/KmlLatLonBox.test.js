/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLatLonBox',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLatLonBox,
    XmlDocument
) {
    "use strict";
    TestCase("KmlLatLonBox", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<LatLonBox>" +
                "   <north>48.25475939255556</north>" +
                "   <south>48.25207367852141</south>" +
                "   <east>-90.86591508839973</east>" +
                "   <west>-90.8714285289695</west>" +
                "   <rotation>39.37878630116985</rotation>" +
                "</LatLonBox>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lod = new KmlLatLonBox({objectNode:
                kmlRepresentation.getElementsByTagName("LatLonBox")[0]});

            assertEquals(48.25475939255556, lod.kmlNorth);
            assertEquals(48.25207367852141, lod.kmlSouth);
            assertEquals(-90.86591508839973, lod.kmlEast);
            assertEquals(-90.8714285289695, lod.kmlWest);
            assertEquals(39.37878630116985, lod.kmlRotation);
        })
    })
});