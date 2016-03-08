/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/KmlElementsFactory',
    'src/formats/kml/util/KmlElementsFactoryCached',
    'src/formats/kml/geom/KmlGeometry',
    'src/formats/kml/geom/KmlLineString',
    'src/formats/kml/geom/KmlMultiGeometry',
    'src/formats/kml/geom/KmlPoint',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlElementsFactory,
    KmlElementsFactoryCached,
    KmlGeometry,
    KmlLineString,
    KmlMultiGeometry,
    KmlPoint,
    XmlDocument
) {
    "use strict";
    var factory = new KmlElementsFactoryCached();
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

    TestCase("KmlElementsFactoryCached", {
        testCachingElementsWhenAllAsked: CatchTest(function(){
            var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("7")});
            var createdElements = factory.all(currentMultiGeometry);
            var createdElementsFromCache = factory.all(currentMultiGeometry);

            assertTrue(createdElements[0] === createdElementsFromCache[0]);
            assertTrue(createdElements[1] === createdElementsFromCache[1]);
        }),

        testCachingElementsWhenAnyAsked: CatchTest(function () {
            var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("11")});
            var createdElement = factory.any(currentMultiGeometry, {name: KmlGeometry.getTagNames()});
            var createdElementFromCache = factory.any(currentMultiGeometry, {name: KmlGeometry.getTagNames()});

            assertTrue(createdElement === createdElementFromCache);
        }),

        testCachingElementsWhenSpecificAsked: CatchTest(function () {
            var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("11")});
            var createdElement = factory.specific(currentMultiGeometry, {name: "Point", transformer: KmlElementsFactory.kmlObject});
            var createdElementFromCache = factory.specific(currentMultiGeometry, {name: "Point", transformer: KmlElementsFactory.kmlObject});

            assertTrue(createdElement === createdElementFromCache);
        })
    });
});