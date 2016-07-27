/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlIcon',
    'src/util/XmlDocument'
], function (
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
        expect(link.kmlHref).toEqual ('link');
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