/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/geom/KmlLineString',
    'src/geom/Position',
    'src/util/XmlDocument',
    'src/WorldWind'
], function (
    KmlLineString,
    Position,
    XmlDocument,
    WorldWind
) {
    "use strict";
    describe("KmlLineString", function () {

        var kmlContainingLineString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
            "<LineString id=\"1\">" +
            "   <coordinates>-122.364167,37.824787,0 -122.363917,37.824423,0</coordinates>" +
            "</LineString>" +
            "</kml>";
        var lineString;

        var kmlRepresentation = new XmlDocument(kmlContainingLineString).dom();
        lineString = new KmlLineString({
            objectNode: kmlRepresentation.getElementsByTagName("LineString")[0],
            style: {
                then: function () {
                }
            }
        });

        it("should have the length ans position properties", function () {
            expect(lineString.kmlPositions.length).toEqual(2);
            expect(lineString.kmlPositions[0].longitude).toEqual(new Position(37.824787, -122.364167, 0).longitude);
            expect(lineString.kmlPositions[0].latitude).toEqual(new Position(37.824787, -122.364167, 0).latitude);
            expect(lineString.kmlPositions[0].altitude).toEqual(new Position(37.824787, -122.364167, 0).altitude);
            expect(lineString.kmlPositions[1].longitude).toEqual(new Position(37.824423, -122.363917, 0).longitude);
            expect(lineString.kmlPositions[1].latitude).toEqual(new Position(37.824423, -122.363917, 0).latitude);
            expect(lineString.kmlPositions[1].altitude).toEqual(new Position(37.824423, -122.363917, 0).altitude);
        });

        it("should have the position, AltitudeMode, Extrude and Tessellate properties", function () {
            expect(lineString.equals({
                kmlPositions: [
                    new Position(37.824787, -122.364167, 0),
                    new Position(37.824423, -122.363917, 0)],
                kmlAltitudeMode: 'absolute',
                kmlExtrude: false,
                kmlTessellate: false
            })).toBeTruthy();

        });


    });
});