/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/geom/Position',
    'src/formats/kml/geom/KmlPolygon',
    'src/formats/kml/geom/KmlLinearRing',
    'src/util/XmlDocument'
], function (
    CatchTest,
    Position,
    KmlPolygon,
    KmlLinearRing,
    XmlDocument
) {
    "use strict";
    TestCase("KmlPolygonTestCase", {
        "testValidKml": CatchTest(function() {
            var validPolygonKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Polygon id=\"4\">" +
                "   <outerBoundaryIs>" +
                "       <LinearRing id=\"5\">" +
                "           <coordinates>-60,30,0 -30,30,0 -30,0,0 -60,0,0</coordinates>" +
                "       </LinearRing>" +
                "   </outerBoundaryIs>" +
                "   <innerBoundaryIs>" +
                "       <LinearRing id=\"6\">" +
                "           <coordinates>-50,20,0 -40,20,0 -40,10,0 -50,10,0</coordinates>" +
                "       </LinearRing>" +
                "   </innerBoundaryIs>" +
                "   <extrude>1</extrude>" +
                "   <tessellate>0</tessellate>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "</Polygon>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validPolygonKml).dom();
            var polygon = new KmlPolygon(kmlRepresentation.getElementsByTagName("Polygon")[0]);

            assertTrue(polygon.extrude);
            assertFalse(polygon.tessellate);
            assertEquals("clampToGround", polygon.altitudeMode);
            assertTrue(polygon.center.equals(new Position(15, -45, 0)));
            assertTrue(polygon.outerBoundary.equals({
                extrude: false,
                tessellate: false,
                altitudeMode: WorldWind.ABSOLUTE,
                positions: [
                    new Position(30,-60,0),
                    new Position(30,-30,0),
                    new Position(0,-30,0),
                    new Position(0,-60,0)]
            }));
            assertTrue(polygon.innerBoundary.equals({
                extrude: false,
                tessellate: false,
                altitudeMode: WorldWind.ABSOLUTE,
                positions: [
                    new Position(20,-50,0),
                    new Position(20,-40,0),
                    new Position(10,-40,0),
                    new Position(10,-50,0)]
            }));
        })
    });
});