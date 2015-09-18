/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/util/XmlDocument',
    'src/formats/kml/KmlBalloonStyle'
], function (
    CatchTest,
    XmlDocument,
    KmlBalloonStyle
) {
    "use strict";
    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<BalloonStyle id=\"1\">" +
        "   <bgColor>ffffffff</bgColor>" +
        "   <textColor>ff000000</textColor>" +
        "   <text>TextToTest</text>" +
        "   <displayMode>default</displayMode>" +
        "</BalloonStyle>" +
        "</kml>";

    TestCase("BallonStyle", {
        testValidKml: CatchTest(function(){
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var balloonStyle = new KmlBalloonStyle(
                kmlRepresentation.getElementsByTagName("BalloonStyle")[0]);

            assertEquals('ffffffff', balloonStyle.bgColor);
            assertEquals('ff000000', balloonStyle.textColor);
            assertEquals('TextToTest', balloonStyle.text);
            assertEquals('default', balloonStyle.displayMode);
        })
    });
});