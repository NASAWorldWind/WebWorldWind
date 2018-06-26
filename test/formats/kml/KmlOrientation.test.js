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
    'src/formats/kml/KmlOrientation',
    'src/util/XmlDocument'
], function (
    KmlOrientation,
    XmlDocument
) {
    "use strict";
    describe("KmlOrientationTest",function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Orientation>" +
                "   <heading>45.0</heading>" +
                "   <tilt>10.0</tilt>" +
                "   <roll>0.0</roll>" +
                "</Orientation>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var orientation = new KmlOrientation({objectNode:
                kmlRepresentation.getElementsByTagName("Orientation")[0]});
        it('should have the Heading, Tilt and Roll properties', function(){

            expect(orientation.kmlHeading).toBe(45.0);
            expect(orientation.kmlTilt).toBe(10.0);
            expect(orientation.kmlRoll).toBe(0.0);
        });
    });
});