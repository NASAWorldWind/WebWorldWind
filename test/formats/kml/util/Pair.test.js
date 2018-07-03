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
    'src/formats/kml/util/KmlPair',
    'src/formats/kml/styles/KmlStyle',
    'src/util/XmlDocument'
], function (
    Pair,
    KmlStyle,
    XmlDocument
) {
    "use strict";
    describe ("KmlPairTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Pair>" +
                "   <key>normal</key>" +
                "   <styleUrl>validUrl</styleUrl>" +
                "   <Style></Style>" +
                "</Pair>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var scale = new Pair({objectNode:
                kmlRepresentation.getElementsByTagName("Pair")[0]});
        it('should have the Key, StyleUrl properties and the prototype property of KmlStyle', function(){
            expect(scale.kmlKey).toBe('normal');
            expect(scale.kmlStyleUrl).toBe('validUrl');
            expect(scale.kmlStyleSelector instanceof KmlStyle).toBeTruthy();
        });


        });
    });
