/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/Scale',
    'src/util/XmlDocument'
], function (
    CatchTest,
    Scale,
    XmlDocument
) {
    "use strict";
    TestCase("ScaleTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Scale>" +
                "   <x>1</x>" +
                "   <y>1</y>" +
                "   <z>1</z>" +
                "</Scale>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var scale = new Scale({objectNode:
                kmlRepresentation.getElementsByTagName("Scale")[0]});

            assertEquals(1, scale.kmlX);
            assertEquals(1, scale.kmlY);
            assertEquals(1, scale.kmlZ);
        })
    })
});