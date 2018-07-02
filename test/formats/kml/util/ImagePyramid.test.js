/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    'src/formats/kml/util/KmlImagePyramid',
    'src/util/XmlDocument'
], function (
    ImagePyramid,
    XmlDocument
) {
    "use strict";
    describe("KmlImagePyramidTest", function () {
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
                "<ImagePyramid>" +
                "   <tileSize>256</tileSize>" +
                "   <maxWidth>10</maxWidth>" +
                "   <maxHeight>10</maxHeight>" +
                "   <gridOrigin>lowerLeft</gridOrigin>" +
                "</ImagePyramid>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var imagePyramid = new ImagePyramid({objectNode:
                kmlRepresentation.getElementsByTagName("ImagePyramid")[0]});

        it('should have the TileSize, MaxWidth, MaxHeight and GridOrigin properties', function(){
            expect(imagePyramid.kmlTileSize).toEqual(256);
            expect(imagePyramid.kmlMaxWidth).toEqual(10);
            expect(imagePyramid.kmlMaxHeight).toEqual(10);
            expect(imagePyramid.kmlGridOrigin).toEqual("lowerLeft");
        });


        });
    });
