/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/util/XmlDocument',
    'src/formats/kml/styles/KmlLineStyle'
], function (
    XmlDocument,
    KmlLineStyle
) {
    "use strict";
    describe("KmlLineStyle", function(){

    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
        "<LineStyle id=\"1\">" +
        "   <color>ffffffff</color>" +
        "   <colorMode>normal</colorMode>" +
        "   " +
        "   <width>1</width>" +
        "   <gx:outerColor>ffffffff</gx:outerColor>" +
        "   <gx:outerWidth>0.5</gx:outerWidth>" +
        "   <gx:physicalWidth>0.4</gx:physicalWidth>" +
        "   <gx:labelVisibility>0</gx:labelVisibility>" +
        "</LineStyle>" +
        "</kml>";

            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lineStyle = new KmlLineStyle({objectNode:
                kmlRepresentation.getElementsByTagName("LineStyle")[0]});

            it("should have the Width, OuterColor, OuterWidth, PhysicalWidth and LabelVisibility properties", function(){
            expect(lineStyle.kmlWidth).toEqual(1);
            expect(lineStyle.kmlOuterColor).toEqual('ffffffff');
            expect(lineStyle.kmlOuterWidth).toEqual(0.5);
            expect(lineStyle.kmlPhysicalWidth).toEqual(0.4);
            expect(lineStyle.kmlLabelVisibility).toEqual(false);

        });


    });
});