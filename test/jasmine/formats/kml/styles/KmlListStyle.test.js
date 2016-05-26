/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/util/XmlDocument',
    'src/formats/kml/styles/KmlListStyle',
    'src/formats/kml/util/ItemIcon'
], function (
    XmlDocument,
    KmlListStyle,
    ItemIcon
) {
    "use strict";
    describe ("KmlListStyleTest", function(){

    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
        "<ListStyle id=\"1\">" +
        "   <listItemType>check</listItemType>" +
        "   <bgColor>ffffffff</bgColor>" +
        "   <ItemIcon></ItemIcon>" +
        "</ListStyle>" +
        "</kml>";


            var kmlRepresentation = new XmlDocument(validKml).dom();
            var listStyle = new KmlListStyle({objectNode:
                kmlRepresentation.getElementsByTagName("ListStyle")[0]});
            it ("should have the ListItemType, BgColor and ItemIcon properties",function(){
                expect(listStyle.kmlListItemType).toEqual('check');
                expect(listStyle.kmlBgColor).toEqual('ffffffff');
                expect(listStyle.kmlItemIcon instanceof ItemIcon).toBeTruthy();

            });

    });
});