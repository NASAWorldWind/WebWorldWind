/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/KmlElementsFactory',
    'src/formats/kml/geom/KmlLineString',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlElementsFactory,
    KmlLineString,
    XmlDocument
) {
    "use strict";
    var factory = new KmlElementsFactory();
    var exampleDocument = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<MultiGeometry id=\"7\">" +
        "   <LineString id=\"8\">" +
        "       <coordinates>10,10,0 20,10,0</coordinates>" +
        "   </LineString>" +
        "   <LineString id=\"9\">" +
        "       <extrude>0</extrude>" +
        "   </LineString>" +
        "</MultiGeometry>" +
        "<Icon id=\"10\">" +
        "   <x>10</x>" +
        "</Icon>" +
        "</kml>";
    var document = new XmlDocument(exampleDocument).dom();

    TestCase("KmlElementsFactory", {
        testStringCorrectlyRetrievesTheValueOfTheNode: CatchTest(function(){
            var node = document.getElementById("8");
            var result = KmlElementsFactory.string(node.childNodes[1]);
            assertEquals("10,10,0 20,10,0", result);
        }),

        testNumberCorrectlyRetrievesTheValueOfTheNode: CatchTest(function() {
            var node = document.getElementById("10");
            var result = KmlElementsFactory.number(node.childNodes[1]);
            assertEquals(10, result);
        }),

        testBooleanCorrectlyRetrievesTheValueOfTheNode: CatchTest(function(){
            var node = document.getElementById("9");
            var result = KmlElementsFactory.boolean(node.childNodes[1]);
            assertEquals(false, result);
        }),

        testKmlObjectRetrievesCorrectlyTheAssociatedElement: CatchTest(function(){
            var node = document.getElementById("8");
            var result = KmlElementsFactory.kmlObject(node);
            assertTrue(result instanceof KmlLineString);
        }),

        testCreationOfSinglePrimitive: CatchTest(function () {
            var currentLineString = new KmlLineString({objectNode: document.getElementById("8")});
            // style needs to be moved elsewhere. Probably StyleResolver?
            var retrievedValue = factory.specific(currentLineString, {name: 'coordinates', transformer: KmlElementsFactory.string});

            assertEquals("10,10,0 20,10,0", retrievedValue);
        }),

        testCreationOfSingleNonPrimitive: CatchTest(function(){

        }),

        testAttributeRetrieval: CatchTest(function(){

        }),

        testCreationOfAllElementsInLayer: CatchTest(function(){

        })
    })
});