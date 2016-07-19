/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/features/KmlFolder',
    'src/formats/kml/features/KmlPlacemark',
    'src/util/XmlDocument'
], function (
    KmlFolder,
    KmlPlacemark,
    XmlDocument
) {
    "use strict";
    describe("KmlFolderTest", function() {

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Document id=\"1\">" +
                "   <Placemark id=\"2\"></Placemark>" +
                "</Document>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var folder = new KmlFolder({objectNode:
                kmlRepresentation.getElementsByTagName("Document")[0]});
            it("it should contain documents",function(){
                expect(folder.kmlShapes.length).toEqual(1);
                expect(folder.kmlShapes[0] instanceof KmlPlacemark).toBeTruthy();
            });
        });
    });