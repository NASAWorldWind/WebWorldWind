/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/util/Scale',
    'src/util/XmlDocument'
], function (
    Scale,
    XmlDocument
) {
    "use strict";
    describe("ScaleTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Scale>" +
                "   <x>1</x>" +
                "   <y>1</y>" +
                "   <z>1</z>" +
                "</Scale>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var scale = new Scale({objectNode:
                kmlRepresentation.getElementsByTagName("Scale")[0]});
        it('should have the X, Y and Z properties',function(){
            expect(scale.kmlX).toBe(1);
            expect(scale.kmlY).toBe(1);
            expect(scale.kmlZ).toBe(1);
        });


        });
    });
