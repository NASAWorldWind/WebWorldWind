/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/util/ItemIcon',
    'src/util/XmlDocument'
], function (
    ItemIcon,
    XmlDocument
) {
    "use strict";
    describe("ItemIconTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<ItemIcon>" +
                "   <state>open</state>" +
                "   <href>validUrl</href>" +
                "</ItemIcon>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var scale = new ItemIcon({objectNode:
                kmlRepresentation.getElementsByTagName("ItemIcon")[0]});
        it ('should have the State and Href properties', function(){
            expect(scale.kmlState).toEqual("open");
            expect(scale.kmlHref).toEqual("validUrl");
        });


        });
    });
