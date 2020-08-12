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
    'src/formats/kml/KmlFileCache',
    'src/formats/kml/KmlIcon',
    'src/util/XmlDocument'
], function (
    KmlFileCache,
    KmlIcon,
    XmlDocument
) {
    "use strict";
    describe ("KmlIconTest", function (){
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\">" +
                "<Icon>" +
                "   <href>link</href>" +
                "   <refreshMode>onChange</refreshMode>" +
                "   <refreshInterval>4</refreshInterval>" +
                "   <viewRefreshMode>never</viewRefreshMode>" +
                "   <viewRefreshTime>4</viewRefreshTime>" +
                "   <viewBoundScale>1</viewBoundScale>" +
                "   <viewFormat>BBOX=10,10,10,10</viewFormat>" +
                "   <httpQuery>validQuery</httpQuery>" +
                "   <gx:x>0</gx:x>" +
                "   <gx:y>0</gx:y>" +
                "   <gx:w>-1</gx:w>" +
                "   <gx:h>-1</gx:h>" +
                "</Icon>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var link = new KmlIcon({objectNode:
                kmlRepresentation.getElementsByTagName("Icon")[0]});
    it('should have the X, Y, W, H, Href, RefreshMode, RefreshInterval, ViewRefreshMode, ViewRefreshTime, ViewBoundScale,' +
        'ViewFormat and ViewScale properties', function(){
        expect(link.kmlX).toEqual(0);
        expect(link.kmlY).toEqual(0);
        expect(link.kmlW).toEqual(-1);
        expect(link.kmlH).toEqual(-1);
        expect(link.kmlHref(new KmlFileCache())).toEqual ('link');
        expect(link.kmlRefreshMode).toEqual('onChange');
        expect(link.kmlRefreshInterval).toEqual(4);
        expect(link.kmlViewRefreshMode).toEqual('never');
        expect(link.kmlViewRefreshTime).toEqual (4);
        expect(link.kmlViewBoundScale).toEqual(1);
        expect(link.kmlViewFormat).toEqual('BBOX=10,10,10,10');
        expect(link.kmlHttpQuery).toEqual('validQuery');
        });
    });
});