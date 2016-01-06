/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlAbstractView',
    'src/formats/kml/KmlTimeSpan',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlAbstractView,
    KmlTimeSpan,
    XmlDocument
) {
    "use strict";
    TestCase("KmlAbstractViewTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<AbstractView>" +
                "   <TimeSpan></TimeSpan>" +
                "</AbstractView>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var overlay = new KmlAbstractView({objectNode:
                kmlRepresentation.getElementsByTagName("AbstractView")[0]});

            assertTrue(overlay.kmlTimePrimitive instanceof KmlTimeSpan);
        })
    })
});