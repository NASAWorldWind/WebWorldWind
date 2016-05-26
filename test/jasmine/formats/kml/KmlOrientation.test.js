/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlOrientation',
    'src/util/XmlDocument'
], function (
    KmlOrientation,
    XmlDocument
) {
    "use strict";
    describe("KmlOrientationTest",function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Orientation>" +
                "   <heading>45.0</heading>" +
                "   <tilt>10.0</tilt>" +
                "   <roll>0.0</roll>" +
                "</Orientation>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var orientation = new KmlOrientation({objectNode:
                kmlRepresentation.getElementsByTagName("Orientation")[0]});
        it('should have the Heading, Tilt and Roll properties', function(){

            expect(orientation.kmlHeading).toBe(45.0);
            expect(orientation.kmlTilt).toBe(10.0);
            expect(orientation.kmlRoll).toBe(0.0);
        });
    });
});