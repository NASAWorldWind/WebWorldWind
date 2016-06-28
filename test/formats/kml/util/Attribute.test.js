/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'src/formats/kml/util/Attribute',
    'test/CatchTest',
    'src/util/XmlDocument'
], function (
    Attribute,
    CatchTest,
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
        "</MultiGeometry>" +
        "<Icon id=\"10\">" +
        "   <x>10</x>" +
        "</Icon>" +
        "</kml>";
    var document = new XmlDocument(exampleDocument).dom();

    TestCase("Attribute", {
        testGettingValueOfExistingAttribute: CatchTest(function () {
            var node = document.getElementById("9");
            var attribute = new Attribute(node, "id");
            assertEquals("9", attribute.value());
        }),

        testSettingValueOfNonexistentAttribute: CatchTest(function () {
            var node = document.getElementById("9");
            var attribute = new Attribute(node, "name");
            attribute.save("newOne");
            assertEquals("newOne", attribute.value());
        }),

        testUpdatingValueOfExistingAttribute: CatchTest(function () {
            var node = document.getElementById("10");
            var attribute = new Attribute(node, "id");
            attribute.save("15");
            assertEquals("15", attribute.value());
        }),

        testExistsReturnsTrueIfExists: CatchTest(function () {
            var node = document.getElementById("9");
            var attribute = new Attribute(node, "id");
            assertTrue(attribute.exists());
        }),

        testExistsReturnsFalseIfDoesntExist: CatchTest(function () {
            var node = document.getElementById("9");
            var attribute = new Attribute(node, "test");
            assertFalse(attribute.exists());
        })
    });
});