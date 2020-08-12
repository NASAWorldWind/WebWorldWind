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
