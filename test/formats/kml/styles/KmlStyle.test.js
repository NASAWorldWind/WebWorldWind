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
    'src/formats/kml/styles/KmlStyle',
    'src/formats/kml/styles/KmlIconStyle',
    'src/formats/kml/styles/KmlLabelStyle',
    'src/formats/kml/styles/KmlLineStyle',
    'src/formats/kml/styles/KmlPolyStyle',
    'src/formats/kml/styles/KmlBalloonStyle',
    'src/formats/kml/styles/KmlListStyle',
    'src/util/XmlDocument'
], function (
    KmlStyle,
    KmlIconStyle,
    KmlLabelStyle,
    KmlLineStyle,
    KmlPolyStyle,
    KmlBalloonStyle,
    KmlListStyle,
    XmlDocument
) {
    "use strict";
    describe("KmlStyleTest",function(){

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Style>" +
                "   <IconStyle></IconStyle>" +
                "   <LabelStyle></LabelStyle>" +
                "   <LineStyle></LineStyle>" +
                "   <PolyStyle></PolyStyle>" +
                "   <BalloonStyle></BalloonStyle>" +
                "   <ListStyle></ListStyle>" +
                "</Style>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var style = new KmlStyle({objectNode:
                kmlRepresentation.getElementsByTagName("Style")[0]});
            it ("should have the prototype property of KmlIconStyle, KmlLabelStyle, KmlLineStyle, KmlPolyStyle, KmlBalloonStyle" +
                " KmlBalloonStyle and KmlListStyle", function(){
                expect(style.kmlIconStyle instanceof KmlIconStyle).toBeTruthy();
                expect(style.kmlLabelStyle instanceof KmlLabelStyle).toBeTruthy();
                expect(style.kmlLineStyle instanceof KmlLineStyle).toBeTruthy();
                expect(style.kmlPolyStyle instanceof KmlPolyStyle).toBeTruthy();
                expect(style.kmlBalloonStyle instanceof KmlBalloonStyle).toBeTruthy();
                expect(style.kmlListStyle instanceof KmlListStyle).toBeTruthy();

            });

        });
    });
