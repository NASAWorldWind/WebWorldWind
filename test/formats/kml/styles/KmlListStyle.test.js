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
    'src/util/XmlDocument',
    'src/formats/kml/styles/KmlListStyle',
    'src/formats/kml/util/KmlItemIcon'
], function (
    XmlDocument,
    KmlListStyle,
    ItemIcon
) {
    "use strict";
    describe ("KmlListStyleTest", function(){

    var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
        "<ListStyle id=\"1\">" +
        "   <listItemType>check</listItemType>" +
        "   <bgColor>ffffffff</bgColor>" +
        "   <ItemIcon></ItemIcon>" +
        "</ListStyle>" +
        "</kml>";


            var kmlRepresentation = new XmlDocument(validKml).dom();
            var listStyle = new KmlListStyle({objectNode:
                kmlRepresentation.getElementsByTagName("ListStyle")[0]});
            it ("should have the ListItemType, BgColor and ItemIcon properties",function(){
                expect(listStyle.kmlListItemType).toEqual('check');
                expect(listStyle.kmlBgColor).toEqual('ffffffff');
                console.log(listStyle.kmlItemIcon);
                expect(listStyle.kmlItemIcon instanceof ItemIcon).toBeTruthy();

            });

    });
});