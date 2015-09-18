/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/formats/kml/KmlFile'
], function (
    CatchTest,
    KmlFile
) {
    "use strict";
    TestCase("KmlFile", {
        "testSimpleKml": CatchTest(function(){
            var kmlFileXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <extrude>true</extrude>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "   <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>" +
                "</Point>" +
                "</kml>";

            var kmlFile = new KmlFile(kmlFileXml, {});
            assertEquals(1, kmlFile.shapes.length);
        })
    });
});