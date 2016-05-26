/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/styles/KmlStyleMap',
    'src/formats/kml/util/Pair',
    'src/util/XmlDocument'
], function (
    KmlStyleMap,
    Pair,
    XmlDocument
) {
    "use strict";
    describe("KmlStyleMapTest",function(){

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<StyleMap>" +
                "   <Pair></Pair>" +
                "</StyleMap>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var styleMap = new KmlStyleMap({objectNode:
                kmlRepresentation.getElementsByTagName("StyleMap")[0]});
        it("should have the prototype properties of Pair", function(){
            expect(styleMap.kmlPairs[0] instanceof Pair).toBeTruthy();
        });

        });
    });