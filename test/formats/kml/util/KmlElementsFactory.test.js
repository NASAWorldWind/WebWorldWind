/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/KmlElementsFactory',
    'src/formats/kml/geom/KmlGeometry',
    'src/formats/kml/geom/KmlLineString',
    'src/formats/kml/geom/KmlMultiGeometry',
    'src/formats/kml/geom/KmlPoint',
    'src/formats/kml/util/NodeTransformers',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlElementsFactory,
    KmlGeometry,
    KmlLineString,
    KmlMultiGeometry,
    KmlPoint,
    NodeTransformers,
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

    TestCase("KmlElementsFactory", {
        testCreationOfSinglePrimitive: CatchTest(function () {
            var currentLineString = new KmlLineString({objectNode: document.getElementById("8")});
            var retrievedValue = factory.specific(currentLineString, {name: 'coordinates', transformer: NodeTransformers.string});

            assertEquals("10,10,0 20,10,0", retrievedValue);
        }),

        testCreationOfSingleNonPrimitive: CatchTest(function(){
            var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("7")});
            var retrievedValue = factory.specific(
                currentMultiGeometry, {name: 'LineString', transformer: NodeTransformers.kmlObject}
            );

            assertTrue(retrievedValue instanceof KmlLineString);
        }),

        testCreationOfAnyTypeOfElement: CatchTest(function(){
            var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("11")});
            var createdElement = factory.any(currentMultiGeometry, {name: KmlGeometry.getTagNames()});

            assertTrue(createdElement instanceof KmlPoint);
        }),

        testCreationOfAllElementsInLayer: CatchTest(function(){
            var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("7")});
            var createdElements = factory.all(currentMultiGeometry);

            assertEquals(2, createdElements.length);
            assertTrue(createdElements[0] instanceof KmlLineString);
            assertTrue(createdElements[1] instanceof KmlLineString);
        })
    })
});