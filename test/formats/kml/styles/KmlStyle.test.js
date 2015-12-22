/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/styles/KmlStyle',
    'src/formats/kml/styles/KmlIconStyle',
    'src/formats/kml/styles/KmlLabelStyle',
    'src/formats/kml/styles/KmlLineStyle',
    'src/formats/kml/styles/KmlPolyStyle',
    'src/formats/kml/styles/KmlBalloonStyle',
    'src/formats/kml/styles/KmlListStyle',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlStyle,
    KmlIconStyle,
    KmlLabelStyle,
    KmlLineStyle,
    KmlPolyStyle,
    KmlBalloonStyle,
    KmlListStyle,
    XmlDocument
) {
    "use strict";
    TestCase("KmlStyleTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Style>" +
                "   <IconStyle></IconStyle>" +
                "   <LabelStyle></LabelStyle>" +
                "   <LineStyle></LineStyle>" +
                "   <PolyStyle></PolyStyle>" +
                "   <BalloonStyle></BalloonStyle>" +
                "   <ListStyle></ListStyle>" +
                "</Style>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var style = new KmlStyle(
                kmlRepresentation.getElementsByTagName("Style")[0]);

            assertTrue(style.IconStyle instanceof KmlIconStyle);
            assertTrue(style.LabelStyle instanceof KmlLabelStyle);
            assertTrue(style.LineStyle instanceof KmlLineStyle);
            assertTrue(style.PolyStyle instanceof KmlPolyStyle);
            assertTrue(style.BalloonStyle instanceof KmlBalloonStyle);
            assertTrue(style.ListStyle instanceof KmlListStyle);
        })
    })
});