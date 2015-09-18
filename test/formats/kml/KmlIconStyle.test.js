/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/util/XmlDocument',
    'src/formats/kml/KmlIconStyle'
], function (
    CatchTest,
    XmlDocument,
    KmlIconStyle
) {
    "use strict";
    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<IconStyle id=\"1\">" +
        "   <color>ffffffff</color>" +
        "   <colorMode>normal</colorMode>" +
        "   " +
        "   <scale>1</scale>" +
        "   <heading>0</heading>" +
        "   <Icon>" +
        "       <href>test</href>" +
        "   </Icon>" +
        "</IconStyle>" +
        "</kml>";

    TestCase('KmlIconStyle', {
        testValidKml: CatchTest(function() {
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var iconStyle = new KmlIconStyle(
                kmlRepresentation.getElementsByTagName("IconStyle")[0]);

            assertEquals('ffffffff', iconStyle.color);
            assertEquals('normal', iconStyle.colorMode);
            assertEquals(1, iconStyle.scale);
            assertEquals(0, iconStyle.heading);
            assertEquals('test', iconStyle.Icon.href);
        })
    });
});