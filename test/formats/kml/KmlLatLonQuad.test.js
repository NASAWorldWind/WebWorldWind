/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLatLonQuad',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLatLonQuad,
    XmlDocument
) {
    "use strict";
    TestCase("KmlLatLonQuadTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
                "<gx:LatLonQuad>" +
                "   <coordinates>81.601884,44.160723 83.529902,43.665148 82.947737,44.248831 81.509322,44.321015</coordinates>" +
                "</gx:LatLonQuad>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var latLonQuad = new KmlLatLonQuad({objectNode:
                kmlRepresentation.getElementsByTagName("LatLonQuad")[0]});

            assertEquals("81.601884,44.160723 83.529902,43.665148 82.947737,44.248831 81.509322,44.321015",
                latLonQuad.kmlCoordinates);
        })
    })
});