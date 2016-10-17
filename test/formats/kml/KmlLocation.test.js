/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlLocation',
    'src/util/XmlDocument'
], function (
    KmlLocation,
    XmlDocument
) {
    "use strict";
    describe("KmlLocationTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Location>" +
                "   <longitude>45.0</longitude>" +
                "   <latitude>10.0</latitude>" +
                "   <altitude>0.0</altitude>" +
                "</Location>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var location = new KmlLocation({objectNode:
                kmlRepresentation.getElementsByTagName("Location")[0]});
        it('should have the Longitude, Latitude and Altitude properties', function(){

            expect(location.kmlLongitude).toBe('45.0');
            expect(location.kmlLatitude).toBe('10.0');
            expect(location.kmlAltitude).toBe('0.0');
        });
    });
});