/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/util/XmlDocument',
    'src/formats/kml/features/KmlPlacemark',
    'src/formats/kml/geom/KmlPoint'
], function (
    XmlDocument,
    KmlPlacemark,
    KmlPoint
) {
    "use strict";
    describe("KmlPlacemark", function(){

    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<Placemark id=\"1\">" +
        "   <Point>" +
        "   </Point>" +
        "</Placemark>" +
        "</kml>";

            var kmlRepresentation = new XmlDocument(validKml).dom();
            var placemark = new KmlPlacemark({objectNode:
                kmlRepresentation.getElementsByTagName("Placemark")[0]});
        it ("should have the prototype properties of KmlPoint", function(){
            expect(placemark.kmlGeometry instanceof KmlPoint).toBeTruthy();
        });

        });
    });
