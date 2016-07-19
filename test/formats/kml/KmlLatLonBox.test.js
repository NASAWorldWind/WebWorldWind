/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlLatLonBox',
    'src/util/XmlDocument'
], function (
    KmlLatLonBox,
    XmlDocument
) {
    "use strict";
    describe("KmlLatLonBox test", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<LatLonBox>" +
                "   <north>48.25475939255556</north>" +
                "   <south>48.25207367852141</south>" +
                "   <east>-90.86591508839973</east>" +
                "   <west>-90.8714285289695</west>" +
                "   <rotation>39.37878630116985</rotation>" +
                "</LatLonBox>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lod = new KmlLatLonBox({objectNode:
                kmlRepresentation.getElementsByTagName("LatLonBox")[0]});
        it ('should have the North, South, East, West and Rotation properties', function (){

            expect(lod.kmlNorth).toEqual(48.25475939255556);
            expect(lod.kmlSouth).toEqual(48.25207367852141);
            expect(lod.kmlEast).toEqual(-90.86591508839973);
            expect(lod.kmlWest).toEqual(-90.8714285289695);
            expect(lod.kmlRotation).toEqual('39.37878630116985');
        });
    });
});