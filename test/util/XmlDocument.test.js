/*
 * Copyright 2015-2017 WorldWind Contributors
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
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
require([
    'src/util/XmlDocument'
], function(
    XmlDocument
){
    describe("XmlDocument", function() {
        it("testGettingDomOfValidXml", function() {
            var xmlDocument = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Placemark>" +
                "   <Point>" +
                "       <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>" +
                "   </Point>" +
                "</Placemark>" +
                "</kml>";
            var document = new XmlDocument(xmlDocument);
            var resultingDom = document.dom();

            expect(resultingDom.childNodes.length).toEqual(1);
        });
    });
});