/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlLod',
    'src/util/XmlDocument'
], function (
    KmlLod,
    XmlDocument
) {
    "use strict";
    describe("KmlLodTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Lod>" +
                "   <minLodPixels>256</minLodPixels>" +
                "   <maxLodPixels>-1</maxLodPixels>" +
                "   <minFadeExtent>0</minFadeExtent>" +
                "   <maxFadeExtent>0</maxFadeExtent>" +
                "</Lod>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lod = new KmlLod({objectNode:
                kmlRepresentation.getElementsByTagName("Lod")[0]});
        it ('should have the MinLodPixels, MaxLodPixels,MinFadeExtent and MaxFadeExtent properties', function(){

            expect(lod.kmlMinLodPixels).toBe(256);
            expect(lod.kmlMaxLodPixels).toBe(-1);
            expect(lod.kmlMinFadeExtent).toBe(0);
            expect(lod.kmlMaxFadeExtent).toBe(0);
        });
    });
});