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
    'src/formats/kml/features/KmlFolder',
    'src/formats/kml/features/KmlPlacemark',
    'src/util/XmlDocument'
], function (
    KmlFolder,
    KmlPlacemark,
    XmlDocument
) {
    "use strict";
    describe("KmlFolderTest", function() {

            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Document id=\"1\">" +
                "   <Placemark id=\"2\"></Placemark>" +
                "</Document>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var folder = new KmlFolder({objectNode:
                kmlRepresentation.getElementsByTagName("Document")[0]});
            it("it should contain documents",function(){
                expect(folder.kmlShapes.length).toEqual(1);
                expect(folder.kmlShapes[0] instanceof KmlPlacemark).toBeTruthy();
            });
        });
    });