/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/util/XmlDocument',
    'src/formats/kml/styles/KmlLineStyle'
], function (
    CatchTest,
    XmlDocument,
    KmlLineStyle
) {
    "use strict";
    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
        "<LineStyle id=\"1\">" +
        "   <color>ffffffff</color>" +
        "   <colorMode>normal</colorMode>" +
        "   " +
        "   <width>1</width>" +
        "   <gx:outerColor>ffffffff</gx:outerColor>" +
        "   <gx:outerWidth>0.5</gx:outerWidth>" +
        "   <gx:physicalWidth>0.4</gx:physicalWidth>" +
        "   <gx:labelVisibility>0</gx:labelVisibility>" +
        "</LineStyle>" +
        "</kml>";

    TestCase('KmlLineStyle', {
        testValidKml: function(){
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lineStyle = new KmlLineStyle({objectNode:
                kmlRepresentation.getElementsByTagName("LineStyle")[0]});

            assertEquals(1, lineStyle.kmlWidth);
            assertEquals('ffffffff', lineStyle.kmlOuterColor);
            assertEquals(0.5, lineStyle.kmlOuterWidth);
            assertEquals(0.4, lineStyle.kmlPhysicalWidth);
            assertEquals(false, lineStyle.kmlLabelVisibility);
        }
    });
});