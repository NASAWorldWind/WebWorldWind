/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/features/KmlScreenOverlay',
    'src/util/XmlDocument'
], function (
    KmlScreenOverlay,
    XmlDocument
) {
    "use strict";
    describe("KmlScreenOverlayTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<ScreenOverlay>" +
                "   <rotation>0</rotation>" +
                "</ScreenOverlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var screenOverlay = new KmlScreenOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("ScreenOverlay")[0]});
            it("should have the Rotation property", function(){
                expect(screenOverlay.kmlRotation).toEqual(0);
            });
        });
    });
