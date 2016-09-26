/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/geom/KmlMultiGeometry',
    'src/util/XmlDocument'
], function (
    KmlMultiGeometry,
    XmlDocument
) {
    "use strict";
    describe("KmlMultiGeometryTest", function(){

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<MultiGeometry id=\"7\">" +
                "   <LineString id=\"8\">" +
                "       <coordinates>10,10,0 20,10,0</coordinates>" +
                "   </LineString>" +
                "   <LineString id=\"9\">" +
                "       <coordinates>10,20,0 20,20,0</coordinates>" +
                "   </LineString>" +
                "</MultiGeometry>" +
                "</kml>";

            var kmlRepresentation = new XmlDocument(validKml).dom();
            var multiGeometry = new KmlMultiGeometry({objectNode: kmlRepresentation.getElementsByTagName("MultiGeometry")[0]});
            it("should include more than one shape", function(){

                expect(multiGeometry.kmlShapes.length).toEqual(2);
            });

        });
    });
