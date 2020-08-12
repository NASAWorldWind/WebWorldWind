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
    'src/formats/kml/geom/KmlLineString',
    'src/geom/Position',
    'src/util/XmlDocument',
    'src/WorldWind'
], function (
    KmlLineString,
    Position,
    XmlDocument,
    WorldWind
) {
    "use strict";
    describe("KmlLineString", function () {

        var kmlContainingLineString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
            "<LineString id=\"1\">" +
            "   <coordinates>-122.364167,37.824787,0 -122.363917,37.824423,0</coordinates>" +
            "</LineString>" +
            "</kml>";
        var lineString;

        var kmlRepresentation = new XmlDocument(kmlContainingLineString).dom();
        lineString = new KmlLineString({
            objectNode: kmlRepresentation.getElementsByTagName("LineString")[0],
            style: {
                then: function () {
                }
            }
        });

        it("should have the length ans position properties", function () {
            expect(lineString.kmlPositions.length).toEqual(2);
            expect(lineString.kmlPositions[0].longitude).toEqual(new Position(37.824787, -122.364167, 0).longitude);
            expect(lineString.kmlPositions[0].latitude).toEqual(new Position(37.824787, -122.364167, 0).latitude);
            expect(lineString.kmlPositions[0].altitude).toEqual(new Position(37.824787, -122.364167, 0).altitude);
            expect(lineString.kmlPositions[1].longitude).toEqual(new Position(37.824423, -122.363917, 0).longitude);
            expect(lineString.kmlPositions[1].latitude).toEqual(new Position(37.824423, -122.363917, 0).latitude);
            expect(lineString.kmlPositions[1].altitude).toEqual(new Position(37.824423, -122.363917, 0).altitude);
        });

        it("should have the position, AltitudeMode, Extrude and Tessellate properties", function () {
            expect(lineString.equals({
                kmlPositions: [
                    new Position(37.824787, -122.364167, 0),
                    new Position(37.824423, -122.363917, 0)],
                kmlAltitudeMode: 'absolute',
                kmlExtrude: false,
                kmlTessellate: false
            })).toBeTruthy();

        });


    });
});