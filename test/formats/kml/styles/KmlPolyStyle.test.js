/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(
    [
        'src/util/XmlDocument',
        'src/formats/kml/styles/KmlPolyStyle'
    ], function (XmlDocument,
                 KmlPolyStyle) {
        "use strict";
        describe ("KmlPolyStyle", function(){

        var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
            "<PolyStyle id=\"1\">" +
            "   <color>ffffffff</color>" +
            "   <colorMode>normal</colorMode>" +
            "   <fill>1</fill>" +
            "   <outline>0</outline>" +
            "</PolyStyle>" +
            "</kml>";


                var kmlRepresentation = new XmlDocument(validKml).dom();
                var polyStyle = new KmlPolyStyle({objectNode:
                    kmlRepresentation.getElementsByTagName("PolyStyle")[0]});
            it ("should have the Fill and Outline properties", function(){
                expect(polyStyle.kmlFill).toEqual(true);
                expect(polyStyle.kmlOutline).toEqual(false);

            });

        });
    });