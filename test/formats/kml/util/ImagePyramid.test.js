/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/ImagePyramid',
    'src/util/XmlDocument'
], function (
    CatchTest,
    ImagePyramid,
    XmlDocument
) {
    "use strict";
    TestCase("KmlImagePyramidTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<ImagePyramid>" +
                "   <tileSize>256</tileSize>" +
                "   <maxWidth>10</maxWidth>" +
                "   <maxHeight>10</maxHeight>" +
                "   <gridOrigin>lowerLeft</gridOrigin>" +
                "</ImagePyramid>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var imagePyramid = new ImagePyramid(
                kmlRepresentation.getElementsByTagName("ImagePyramid")[0]);

            assertEquals(256, imagePyramid.tileSize);
            assertEquals(10, imagePyramid.maxWidth);
            assertEquals(10, imagePyramid.maxHeight);
            assertEquals("lowerLeft", imagePyramid.gridOrigin);
        })
    })
});