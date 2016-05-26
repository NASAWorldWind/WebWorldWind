/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlLink',
    'src/util/XmlDocument'
], function (
    KmlLink,
    XmlDocument
) {
    "use strict";
    describe ("KmlLinkTest",function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Link>" +
                "   <href>link</href>" +
                "   <refreshMode>onChange</refreshMode>" +
                "   <refreshInterval>4</refreshInterval>" +
                "   <viewRefreshMode>never</viewRefreshMode>" +
                "   <viewRefreshTime>4</viewRefreshTime>" +
                "   <viewBoundScale>1</viewBoundScale>" +
                "   <viewFormat>BBOX=10,10,10,10</viewFormat>" +
                "   <httpQuery>validQuery</httpQuery>" +
                "</Link>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var link = new KmlLink({objectNode:
                kmlRepresentation.getElementsByTagName("Link")[0]});
        it('should have the Href, RefreshMode,RefreshInterval,ViewRefreshMode,ViewRefreshTime, ViewBoundScale, ViewFormat,' +
            'HttpQuery properties', function(){

            expect(link.kmlHref).toEqual('link');
            expect(link.kmlRefreshMode).toEqual('onChange');
            expect(link.kmlRefreshInterval).toEqual(4);
            expect(link.kmlViewRefreshMode).toEqual('never');
            expect(link.kmlViewRefreshTime).toEqual(4);
            expect(link.kmlViewBoundScale).toEqual(1);
            expect(link.kmlViewFormat).toEqual('BBOX=10,10,10,10');
            expect(link.kmlHttpQuery).toEqual('validQuery');
        });
    });
});