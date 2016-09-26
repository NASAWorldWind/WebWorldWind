/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlIcon',
    'src/formats/kml/features/KmlOverlay',
    'src/util/XmlDocument'
], function (
    KmlIcon,
    KmlOverlay,
    XmlDocument
) {
    "use strict";
    describe("KmlOverlayTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Overlay>" +
                "   <color>ffffffff</color>" +
                "   <drawOrder>1</drawOrder>" +
                "   <Icon></Icon>" +
                "</Overlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var overlay = new KmlOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("Overlay")[0]});
            it("should have the Color and DrawOrder properties and have the prototype properties of KmlIcon", function(){
                expect(overlay.kmlColor).toEqual('ffffffff');
                expect(overlay.kmlDrawOrder).toEqual('1');
                expect(overlay.kmlIcon instanceof KmlIcon).toBeTruthy();
            });

        });
    });
