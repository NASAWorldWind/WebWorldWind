/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/styles/KmlStyle',
    'src/formats/kml/styles/KmlIconStyle',
    'src/formats/kml/styles/KmlLabelStyle',
    'src/formats/kml/styles/KmlLineStyle',
    'src/formats/kml/styles/KmlPolyStyle',
    'src/formats/kml/styles/KmlBalloonStyle',
    'src/formats/kml/styles/KmlListStyle',
    'src/util/XmlDocument'
], function (
    KmlStyle,
    KmlIconStyle,
    KmlLabelStyle,
    KmlLineStyle,
    KmlPolyStyle,
    KmlBalloonStyle,
    KmlListStyle,
    XmlDocument
) {
    "use strict";
    describe("KmlStyleTest",function(){

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Style>" +
                "   <IconStyle></IconStyle>" +
                "   <LabelStyle></LabelStyle>" +
                "   <LineStyle></LineStyle>" +
                "   <PolyStyle></PolyStyle>" +
                "   <BalloonStyle></BalloonStyle>" +
                "   <ListStyle></ListStyle>" +
                "</Style>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var style = new KmlStyle({objectNode:
                kmlRepresentation.getElementsByTagName("Style")[0]});
            it ("should have the prototype property of KmlIconStyle, KmlLabelStyle, KmlLineStyle, KmlPolyStyle, KmlBalloonStyle" +
                " KmlBalloonStyle and KmlListStyle", function(){
                expect(style.kmlIconStyle instanceof KmlIconStyle).toBeTruthy();
                expect(style.kmlLabelStyle instanceof KmlLabelStyle).toBeTruthy();
                expect(style.kmlLineStyle instanceof KmlLineStyle).toBeTruthy();
                expect(style.kmlPolyStyle instanceof KmlPolyStyle).toBeTruthy();
                expect(style.kmlBalloonStyle instanceof KmlBalloonStyle).toBeTruthy();
                expect(style.kmlListStyle instanceof KmlListStyle).toBeTruthy();

            });

        });
    });
