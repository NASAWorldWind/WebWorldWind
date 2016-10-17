/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlLookAt',
    'src/util/XmlDocument'
], function (
    KmlLookAt,
    XmlDocument
) {
    "use strict";
    describe ("KmlLookAtTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<LookAt>" +
                "   <longitude>10</longitude>" +
                "   <latitude>9</latitude>" +
                "   <altitude>8</altitude>" +
                "   <heading>1</heading>" +
                "   <tilt>7</tilt>" +
                "   <range>6</range>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "</LookAt>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lookAt = new KmlLookAt({objectNode:
                kmlRepresentation.getElementsByTagName("LookAt")[0]});
        it ('should have the Longitude, Latitude, Altitude, Heading, Tilt, Range and AltitudeMode properties',function (){

            expect(lookAt.kmlLongitude).toBe(10);
            expect(lookAt.kmlLatitude).toBe(9);
            expect(lookAt.kmlAltitude).toBe(8);
            expect(lookAt.kmlHeading).toBe(1);
            expect(lookAt.kmlTilt).toBe(7);
            expect(lookAt.kmlRange).toBe(6);
            expect(lookAt.kmlAltitudeMode).toBe("clampToGround");
        });
    });
});