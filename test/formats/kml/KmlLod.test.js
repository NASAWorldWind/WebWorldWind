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
    'src/formats/kml/KmlLod',
    'src/util/XmlDocument'
], function (
    KmlLod,
    XmlDocument
) {
    "use strict";
    describe("KmlLodTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Lod>" +
                "   <minLodPixels>256</minLodPixels>" +
                "   <maxLodPixels>-1</maxLodPixels>" +
                "   <minFadeExtent>0</minFadeExtent>" +
                "   <maxFadeExtent>0</maxFadeExtent>" +
                "</Lod>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var lod = new KmlLod({objectNode:
                kmlRepresentation.getElementsByTagName("Lod")[0]});
        it ('should have the MinLodPixels, MaxLodPixels,MinFadeExtent and MaxFadeExtent properties', function(){

            expect(lod.kmlMinLodPixels).toBe(256);
            expect(lod.kmlMaxLodPixels).toBe(-1);
            expect(lod.kmlMinFadeExtent).toBe(0);
            expect(lod.kmlMaxFadeExtent).toBe(0);
        });
    });
});