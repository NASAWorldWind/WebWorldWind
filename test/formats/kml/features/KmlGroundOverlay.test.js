/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/features/KmlGroundOverlay',
    'src/formats/kml/KmlLatLonBox',
    'src/formats/kml/KmlLatLonQuad',
    'src/util/XmlDocument'
], function (
    KmlGroundOverlay,
    KmlLatLonBox,
    KmlLatLonQuad,
    XmlDocument
) {
    "use strict";
    describe("KmlGroundOverlayTest", function() {

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">>" +
                "<GroundOverlay>" +
                "   <altitude>0</altitude>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "   <LatLonBox></LatLonBox>" +
                "   <gx:LatLonQuad></gx:LatLonQuad>" +
                "</GroundOverlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var groundOverlay = new KmlGroundOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("GroundOverlay")[0]});
            it ("should have the Altitude and  AltitudeMode properties and have the prototype properties of KmlLatLonBox" +
                "and KmlLatLonQuad", function(){
                expect(groundOverlay.kmlAltitude).toEqual('0');
                expect(groundOverlay.kmlAltitudeMode).toEqual('clampToGround');

                expect(groundOverlay.kmlLatLonBox instanceof KmlLatLonBox).toBeTruthy();
                expect(groundOverlay.kmlLatLonQuad instanceof KmlLatLonQuad).toBeTruthy();
            });



        });
    });
