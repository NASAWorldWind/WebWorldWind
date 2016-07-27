/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/util/XmlDocument',
    'src/formats/kml/styles/KmlBalloonStyle'
], function (
    XmlDocument,
    KmlBalloonStyle
) {
    "use strict";

    describe("BallonStyle", function(){
        var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
            "<BalloonStyle id=\"1\">" +
            "   <bgColor>ffffffff</bgColor>" +
            "   <textColor>ff000000</textColor>" +
            "   <text>TextToTest</text>" +
            "   <displayMode>default</displayMode>" +
            "</BalloonStyle>" +
            "</kml>";

            var kmlRepresentation = new XmlDocument(validKml).dom();
            var balloonStyle = new KmlBalloonStyle({objectNode:
                kmlRepresentation.getElementsByTagName("BalloonStyle")[0]});
        it ('should have the BgColor, TextColor, Text and DisplayMode properties',function(){

            expect(balloonStyle.kmlBgColor).toEqual('ffffffff');
            expect(balloonStyle.kmlText).toEqual('TextToTest');
            expect(balloonStyle.kmlTextColor).toEqual('ff000000');
            expect(balloonStyle.kmlDisplayMode).toEqual('default');
        });
    });
});