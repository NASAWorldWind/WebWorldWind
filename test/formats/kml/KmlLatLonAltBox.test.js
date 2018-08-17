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
    'src/formats/kml/KmlLatLonAltBox',
    'src/util/XmlDocument'
], function (
    KmlLatLonAltBox,
    XmlDocument
) {
    "use strict";
    describe ("KmlLatLonAltBoxTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<LatLonAltBox>" +
                "   <north>48.25475939255556</north>" +
                "   <south>48.25207367852141</south>" +
                "   <east>-90.86591508839973</east>" +
                "   <west>-90.8714285289695</west>" +
                "   <minAltitude>10</minAltitude>" +
                "   <maxAltitude>20</maxAltitude>" +
                "</LatLonAltBox>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lod = new KmlLatLonAltBox({objectNode:
                kmlRepresentation.getElementsByTagName("LatLonAltBox")[0]});
        it("it should have the North, South, East, West, MinAltitude and MaxAltitude properties", function(){

            expect(lod.kmlNorth).toEqual(48.25475939255556);
            expect(lod.kmlSouth).toEqual(48.25207367852141);
            expect(lod.kmlEast).toEqual(-90.86591508839973);
            expect(lod.kmlWest).toEqual(-90.8714285289695);
            expect(lod.kmlMinAltitude).toEqual(10);
            expect(lod.kmlMaxAltitude).toEqual(20);
        });
    });
});