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
    'src/formats/kml/KmlLatLonQuad',
    'src/util/XmlDocument'
], function (
    KmlLatLonQuad,
    XmlDocument
) {
    "use strict";
    describe("KmlLatLonQuadTest",function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
                "<gx:LatLonQuad>" +
                "   <coordinates>81.601884,44.160723 83.529902,43.665148 82.947737,44.248831 81.509322,44.321015</coordinates>" +
                "</gx:LatLonQuad>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var latLonQuad = new KmlLatLonQuad({objectNode:
                kmlRepresentation.getElementsByTagName("LatLonQuad")[0]});
        it('should have the Coordinates property', function (){

            expect(
                latLonQuad.kmlCoordinates).toEqual("81.601884,44.160723 83.529902,43.665148 82.947737,44.248831 81.509322,44.321015");
        });
    });
});