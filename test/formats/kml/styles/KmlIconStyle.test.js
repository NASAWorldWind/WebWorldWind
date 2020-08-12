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
    'src/formats/kml/KmlFileCache',
    'src/formats/kml/styles/KmlIconStyle',
    'src/util/XmlDocument'
], function (
    KmlFileCache,
    KmlIconStyle,
    XmlDocument
) {
    "use strict";
    describe ("KmlIconStyle", function (){

    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
        "<IconStyle id=\"1\">" +
        "   <color>ffffffff</color>" +
        "   <colorMode>normal</colorMode>" +
        "   " +
        "   <scale>1</scale>" +
        "   <heading>0</heading>" +
        "   <Icon>" +
        "       <href>test</href>" +
        "   </Icon>" +
        "</IconStyle>" +
        "</kml>";

            var kmlRepresentation = new XmlDocument(validKml).dom();
            var iconStyle = new KmlIconStyle({objectNode:
                kmlRepresentation.getElementsByTagName("IconStyle")[0]});
            it("should have the Color, ColorMode, Scale, Heading and Href properties", function(){

                expect(iconStyle.kmlColor).toEqual('ffffffff');
                expect(iconStyle.kmlColorMode).toEqual('normal');
                expect(iconStyle.kmlScale).toEqual(1);
                expect(iconStyle.kmlHeading).toEqual(0);
                expect(iconStyle.kmlIcon.kmlHref(new KmlFileCache())).toEqual('test');

        });
    });
});