/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([ 'src/util/XmlDocument',
    'src/formats/kml/styles/KmlIconStyle'
], function (
    XmlDocument,
    KmlIconStyle
) {
    "use strict";
    describe ("KmlIconStyle", function (){

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

            var kmlRepresentation = new XmlDocument(validKml).dom();
            var iconStyle = new KmlIconStyle({objectNode:
                kmlRepresentation.getElementsByTagName("IconStyle")[0]});
            it("should have the Color, ColorMode, Scale, Heading and Href properties", function(){

                expect(iconStyle.kmlColor).toEqual('ffffffff');
                expect(iconStyle.kmlColorMode).toEqual('normal');
                expect(iconStyle.kmlScale).toEqual(1);
                expect(iconStyle.kmlHeading).toEqual(0);
                expect(iconStyle.kmlIcon.kmlHref).toEqual('test');

        });
    });
});