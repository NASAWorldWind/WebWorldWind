/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/ViewVolume',
    'src/util/XmlDocument'
], function (
    CatchTest,
    ViewVolume,
    XmlDocument
) {
    "use strict";
    TestCase("KmlViewVolumeTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<ViewVolume>" +
                "   <leftFov>0</leftFov>" +
                "   <rightFov>0</rightFov>" +
                "   <bottomFov>0</bottomFov>" +
                "   <topFov>0</topFov>" +
                "   <near>0</near>" +
                "</ViewVolume>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var viewVolume = new ViewVolume({objectNode:
                kmlRepresentation.getElementsByTagName("ViewVolume")[0]});

            assertEquals(0, viewVolume.kmlLeftFov);
            assertEquals(0, viewVolume.kmlRightFov);
            assertEquals(0, viewVolume.kmlBottomFov);
            assertEquals(0, viewVolume.kmlTopFov);
            assertEquals(0, viewVolume.kmlNear);
        })
    })
});