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
    'src/formats/kml/KmlIcon',
    'src/formats/kml/features/KmlOverlay',
    'src/util/XmlDocument'
], function (
    KmlIcon,
    KmlOverlay,
    XmlDocument
) {
    "use strict";
    describe("KmlOverlayTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Overlay>" +
                "   <color>ffffffff</color>" +
                "   <drawOrder>1</drawOrder>" +
                "   <Icon></Icon>" +
                "</Overlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var overlay = new KmlOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("Overlay")[0]});
            it("should have the Color and DrawOrder properties and have the prototype properties of KmlIcon", function(){
                expect(overlay.kmlColor).toEqual('ffffffff');
                expect(overlay.kmlDrawOrder).toEqual('1');
                expect(overlay.kmlIcon instanceof KmlIcon).toBeTruthy();
            });

        });
    });
