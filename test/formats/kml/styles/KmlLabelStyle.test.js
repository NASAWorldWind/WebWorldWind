/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/util/XmlDocument',
    'src/formats/kml/styles/KmlLabelStyle'
], function (
    XmlDocument,
    KmlLabelStyle
) {
    "use strict";
    describe ("KmlLabelStyle", function(){
    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<LabelStyle id=\"1\">" +
        "   <color>ffffffff</color>" +
        "   <colorMode>normal</colorMode>" +
        "   <scale>1</scale>" +
        "</LabelStyle>" +
        "</kml>";


            var kmlRepresentation = new XmlDocument(validKml).dom();
            var labelStyle = new KmlLabelStyle({objectNode:
                kmlRepresentation.getElementsByTagName("LabelStyle")[0]});
        it ("should have the Scale property", function(){
                expect(labelStyle.kmlScale).toEqual(1);
            });

        });
    });
