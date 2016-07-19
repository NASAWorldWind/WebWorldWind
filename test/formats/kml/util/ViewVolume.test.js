/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/util/ViewVolume',
    'src/util/XmlDocument'
], function (
    ViewVolume,
    XmlDocument
) {
    "use strict";
    describe("KmlViewVolumeTest", function () {
        var index = 0;

        beforeEach(function() {

            this.index = index++;
        });

        afterEach(function() {
            if (this.index > 0)
            {   var failed = jsApiReporter.specResults(this.index -1, 1)[0].failedExpectations;
                console.log('failed: ', failed);
                if (failed.length > 0)
                {
                    console.log('After: ', this, failed[0].message);
                    alert('ha');
                }
            }
        });
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<ViewVolume>" +
                "   <leftFov>0</leftFov>" +
                "   <rightFov>0</rightFov>" +
                "   <bottomFov>0</bottomFov>" +
                "   <topFov>0</topFov>" +
                "   <near>0</near>" +
                "</ViewVolume>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var viewVolume = new ViewVolume({objectNode:
                kmlRepresentation.getElementsByTagName("ViewVolume")[0]});
        it('should have the LeftFov, RightFov, BottomFov, TopFov and Near properties', function(){
            expect(viewVolume.kmlLeftFov).toBe(0);
            expect(viewVolume.kmlRightFov).toBe(0);
            expect(viewVolume.kmlBottomFov).toBe(0);
            expect(viewVolume.kmlTopFov).toBe(0);
            expect(viewVolume.kmlNear).toBe('0');
        });


        });
    });
