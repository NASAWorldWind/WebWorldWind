/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/util/Pair',
    'src/formats/kml/styles/KmlStyle',
    'src/util/XmlDocument'
], function (
    Pair,
    KmlStyle,
    XmlDocument
) {
    "use strict";
    describe ("KmlPairTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Pair>" +
                "   <key>normal</key>" +
                "   <styleUrl>validUrl</styleUrl>" +
                "   <Style></Style>" +
                "</Pair>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var scale = new Pair({objectNode:
                kmlRepresentation.getElementsByTagName("Pair")[0]});
        it('should have the Key, StyleUrl properties and the prototype property of KmlStyle', function(){
            expect(scale.kmlKey).toBe('normal');
            expect(scale.kmlStyleUrl).toBe('validUrl');
            expect(scale.kmlStyleSelector instanceof KmlStyle).toBeTruthy();
        });


        });
    });
