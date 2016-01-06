/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/ImagePyramid',
    'src/formats/kml/util/ViewVolume',
    'src/formats/kml/geom/KmlPoint',
    'src/formats/kml/features/KmlPhotoOverlay',
    'src/util/XmlDocument'
], function (
    CatchTest,
    ImagePyramid,
    ViewVolume,
    KmlPoint,
    KmlPhotoOverlay,
    XmlDocument
) {
    "use strict";
    TestCase("KmlPhotoOverlayTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<PhotoOverlay>" +
                "   <rotation>0</rotation>" +
                "   <ViewVolume></ViewVolume>" +
                "   <ImagePyramid></ImagePyramid>" +
                "   <Point></Point>" +
                "   <shape>rectangle</shape>" +
                "</PhotoOverlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var photoOverlay = new KmlPhotoOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("PhotoOverlay")[0]});

            assertEquals(0, photoOverlay.kmlRotation);
            assertEquals('rectangle', photoOverlay.kmlShape);

            assertTrue(photoOverlay.kmlViewVolume instanceof ViewVolume);
            assertTrue(photoOverlay.kmlImagePyramid instanceof ImagePyramid);
            assertTrue(photoOverlay.kmlPoint instanceof KmlPoint);
        })
    })
});