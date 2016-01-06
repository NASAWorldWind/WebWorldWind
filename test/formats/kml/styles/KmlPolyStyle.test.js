/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
        baseUrl: '/test/'
    },
    [
        'test/CatchTest',
        'src/util/XmlDocument',
        'src/formats/kml/styles/KmlPolyStyle'
    ], function (CatchTest,
                 XmlDocument,
                 KmlPolyStyle) {
        "use strict";
        var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
            "<PolyStyle id=\"1\">" +
            "   <color>ffffffff</color>" +
            "   <colorMode>normal</colorMode>" +
            "   <fill>1</fill>" +
            "   <outline>0</outline>" +
            "</PolyStyle>" +
            "</kml>";

        TestCase('KmlPolyStyle', {
            testValidKml: function() {
                var kmlRepresentation = new XmlDocument(validKml).dom();
                var polyStyle = new KmlPolyStyle({objectNode:
                    kmlRepresentation.getElementsByTagName("PolyStyle")[0]});

                assertEquals(true, polyStyle.kmlFill);
                assertEquals(false, polyStyle.kmlOutline);
            }
        });
    });