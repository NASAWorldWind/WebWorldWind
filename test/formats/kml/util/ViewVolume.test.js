/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
define([
    'src/formats/kml/util/KmlViewVolume',
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
