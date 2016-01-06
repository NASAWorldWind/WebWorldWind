/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/util/XmlDocument',
    'src/formats/kml/styles/KmlListStyle',
    'src/formats/kml/util/ItemIcon'
], function (
    CatchTest,
    XmlDocument,
    KmlListStyle,
    ItemIcon
) {
    "use strict";
    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
        "<ListStyle id=\"1\">" +
        "   <listItemType>check</listItemType>" +
        "   <bgColor>ffffffff</bgColor>" +
        "   <ItemIcon></ItemIcon>" +
        "</ListStyle>" +
        "</kml>";

    TestCase('KmlListStyleTest', {
        testValidKml: function(){
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var listStyle = new KmlListStyle({objectNode:
                kmlRepresentation.getElementsByTagName("ListStyle")[0]});

            assertEquals('check', listStyle.kmlListItemType);
            assertEquals('ffffffff', listStyle.kmlBgColor);

            assertTrue(listStyle.kmlItemIcon instanceof ItemIcon);
        }
    });
});