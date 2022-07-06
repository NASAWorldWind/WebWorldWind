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
define( [
    'src/formats/kml/util/KmlImagePyramid',
    'src/formats/kml/util/KmlViewVolume',
    'src/formats/kml/geom/KmlPoint',
    'src/formats/kml/features/KmlPhotoOverlay',
    'src/util/XmlDocument'
], function (
    ImagePyramid,
    ViewVolume,
    KmlPoint,
    KmlPhotoOverlay,
    XmlDocument
) {
    "use strict";
    describe("KmlPhotoOverlayTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<PhotoOverlay>" +
                "   <rotation>0</rotation>" +
                "   <ViewVolume></ViewVolume>" +
                "   <ImagePyramid></ImagePyramid>" +
                "   <Point></Point>" +
                "   <shape>rectangle</shape>" +
                "</PhotoOverlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var photoOverlay = new KmlPhotoOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("PhotoOverlay")[0]});
            it("should have the Rotation, Shape properties and have the prototype properties of ViewVolume,ImagePyramid," +
                "KmlPoint", function(){
                expect(photoOverlay.kmlRotation).toEqual('0');
                expect(photoOverlay.kmlShape).toEqual('rectangle');

                console.log(photoOverlay.kmlViewVolume);
                expect(photoOverlay.kmlViewVolume instanceof ViewVolume).toBeTruthy();
                console.log(photoOverlay.kmlImagePyramid);
                expect(photoOverlay.kmlImagePyramid instanceof ImagePyramid).toBeTruthy();
                expect(photoOverlay.kmlPoint instanceof KmlPoint).toBeTruthy();

            });



        });
    });
