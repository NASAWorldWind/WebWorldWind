/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/formats/kml/KmlLineString',
    'src/geom/Position',
    'src/util/XmlDocument',
    'src/WorldWind'
], function (
    CatchTest,
    KmlLineString,
    Position,
    XmlDocument,
    WorldWind
) {
    "use strict";
    var kmlContainingLineString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<LineString id=\"1\">" +
        "   <coordinates>-122.364167,37.824787,0 -122.363917,37.824423,0</coordinates>" +
        "</LineString>" +
        "</kml>";
    var lineString;

    TestCase("KmlLineString", {
        setUp: function(){
            var kmlRepresentation = new XmlDocument(kmlContainingLineString).dom();
            lineString = new KmlLineString(kmlRepresentation.getElementsByTagName("LineString")[0],{});
        },

        "testParsing": CatchTest(function() {
            assertEquals(2, lineString.positions.length);
            assertEqualsPosition(new Position(37.824787,-122.364167,0), lineString.positions[0]);
            assertEqualsPosition(new Position(37.824423,-122.363917,0), lineString.positions[1]);
        }),

        testValidEquals: CatchTest(function(){
            assertTrue(lineString.equals({positions: [
                new Position(37.824787,-122.364167,0),
                new Position(37.824423,-122.363917,0)],
                altitudeMode: 'absolute',
                extrude: false,
                tessellate: false
                }));
        }),

        testValidCenter: CatchTest(function(){

        })
    });

    function assertEqualsPosition(expectedPosition, actualPosition) {
        assertEquals(expectedPosition.longitude, actualPosition.longitude);
        assertEquals(expectedPosition.latitude, actualPosition.latitude);
        assertEquals(expectedPosition.altitude, actualPosition.altitude);
    }
});