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
    'src/formats/kml/KmlLookAt',
    'src/util/XmlDocument'
], function (
    KmlLookAt,
    XmlDocument
) {
    "use strict";
    describe ("KmlLookAtTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<LookAt>" +
                "   <longitude>10</longitude>" +
                "   <latitude>9</latitude>" +
                "   <altitude>8</altitude>" +
                "   <heading>1</heading>" +
                "   <tilt>7</tilt>" +
                "   <range>6</range>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "</LookAt>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lookAt = new KmlLookAt({objectNode:
                kmlRepresentation.getElementsByTagName("LookAt")[0]});
        it ('should have the Longitude, Latitude, Altitude, Heading, Tilt, Range and AltitudeMode properties',function (){

            expect(lookAt.kmlLongitude).toBe(10);
            expect(lookAt.kmlLatitude).toBe(9);
            expect(lookAt.kmlAltitude).toBe(8);
            expect(lookAt.kmlHeading).toBe(1);
            expect(lookAt.kmlTilt).toBe(7);
            expect(lookAt.kmlRange).toBe(6);
            expect(lookAt.kmlAltitudeMode).toBe("clampToGround");
        });
    });
});