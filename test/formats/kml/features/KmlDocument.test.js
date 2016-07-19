/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define( [
    'src/formats/kml/features/KmlDocument',
    'src/formats/kml/features/KmlPlacemark',
    'src/util/XmlDocument'
], function (
    KmlDocument,
    KmlPlacemark,
    XmlDocument
) {
    "use strict";
    describe("KmlDocumentTest", function() {

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Document id=\"1\">" +
                "   <Placemark id=\"2\"></Placemark>" +
                "</Document>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var document = new KmlDocument({objectNode:
                kmlRepresentation.getElementsByTagName("Document")[0]});
            it("should include shapes",function(){
                expect(document.kmlShapes.length).toEqual(1);
                expect(document.kmlShapes[0] instanceof KmlPlacemark).toBeTruthy();
            });

        });
    });
