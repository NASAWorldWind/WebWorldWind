/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/geom/KmlLinearRing',
    'src/formats/kml/geom/KmlLineString',
    'src/formats/kml/util/NodeTransformers',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLinearRing,
    KmlLineString,
    NodeTransformers,
    XmlDocument
) {
    "use strict";
    var exampleDocument = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<MultiGeometry id=\"7\">" +
        "   <LineString id=\"8\">" +
        "       <coordinates>10,10,0 20,10,0</coordinates>" +
        "   </LineString>" +
        "   <LineString id=\"9\">" +
        "       <extrude>0</extrude>" +
        "   </LineString>" +
        "   <LinearRing id=\"16\">" +
        "       <coordinates>10,10,0 20,10,0</coordinates>" +
        "   </LinearRing>" +
        "</MultiGeometry>" +
        "<Placemark id=\"11\">" +
        "   <Point id=\"13\">" +
        "       <extrude>0</extrude>" +
        "   </Point>" +
        "</Placemark>" +
        "<Icon id=\"10\">" +
        "   <x>10</x>" +
        "</Icon>" +
        "</kml>";
    var document = new XmlDocument(exampleDocument).dom();

    TestCase("NodeTransformers", {
        testStringCorrectlyRetrievesTheValueOfTheNode: CatchTest(function(){
            var node = document.getElementById("8");
            var result = NodeTransformers.string(node.childNodes[1]);
            assertEquals("10,10,0 20,10,0", result);
        }),

        testNumberCorrectlyRetrievesTheValueOfTheNode: CatchTest(function() {
            var node = document.getElementById("10");
            var result = NodeTransformers.number(node.childNodes[1]);
            assertEquals(10, result);
        }),

        testBooleanCorrectlyRetrievesTheValueOfTheNode: CatchTest(function(){
            var node = document.getElementById("9");
            var result = NodeTransformers.boolean(node.childNodes[1]);
            assertEquals(false, result);
        }),

        testKmlObjectRetrievesCorrectlyTheAssociatedElement: CatchTest(function(){
            var node = document.getElementById("8");
            var result = NodeTransformers.kmlObject(node);
            assertTrue(result instanceof KmlLineString);
        }),

        testAttributeCorrectlyRetrievesValueOfAttribute: CatchTest(function(){
            var node = document.getElementById("11");
            var result = NodeTransformers.attribute("id")(node);
            assertEquals("11", result);
        }),

        testPositionsCorrectlyRetrievesThePositions: CatchTest(function(){
            var node = document.getElementById("8");
            var result = NodeTransformers.positions(node.childNodes[1]);
            assertEquals(result.length, 2);
        }),

        testLinearRingCorrectlyReturnsLinearRing: CatchTest(function(){
            var node = document.getElementById("16");
            var result = NodeTransformers.linearRing(node);
            assertTrue(result instanceof KmlLinearRing);
        })
    })
});