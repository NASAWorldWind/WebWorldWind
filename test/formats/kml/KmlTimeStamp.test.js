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
    'src/formats/kml/KmlTimeStamp',
    'src/util/XmlDocument'
], function (KmlTimeStamp,
             XmlDocument) {
    describe ("KmlTimeStamp", function () {
            var validTimeStampXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<TimeStamp id=\"1\">" +
                "   <when>1997-07-16T07:30:15Z</when>" +
                "</TimeStamp>" +
                "</kml>";

            var kmlRepresentation = new XmlDocument(validTimeStampXml).dom();
            var timeStamp = new KmlTimeStamp({objectNode:kmlRepresentation.getElementsByTagName("TimeStamp")[0],style: {}});
        it('should have the time property which specifies when exactly the event happen', function(){
            expect(timeStamp.kmlWhen.toUTCString()).toBe("Wed, 16 Jul 1997 07:30:15 GMT");
        });


        });
});
