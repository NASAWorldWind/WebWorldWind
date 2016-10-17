/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlRegion',
    'src/formats/kml/KmlLatLonAltBox',
    'src/formats/kml/KmlLod',
    'src/util/XmlDocument'
], function (
    KmlRegion,
    KmlLatLonAltBox,
    KmlLod,
    XmlDocument
) {
    "use strict";
    describe ("KmlRegionTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Region>" +
                "   <LatLonAltBox></LatLonAltBox>" +
                "   <Lod></Lod>" +
                "</Region>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var style = new KmlRegion({objectNode:
                kmlRepresentation.getElementsByTagName("Region")[0]});
        it('should have the prototype property of KmlLatLonAltBox and KmlLod', function(){
            expect(style.kmlLatLonAltBox instanceof KmlLatLonAltBox).toBeTruthy();
            expect(style.kmlLod instanceof KmlLod).toBeTruthy();

        });


        });
    });
