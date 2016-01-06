/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlIcon',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlIcon,
    XmlDocument
) {
    "use strict";
    TestCase("KmlIconTest", {
        testValidKml: CatchTest(function () {
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

            assertEquals(0, link.kmlX);
            assertEquals(0, link.kmlY);
            assertEquals(-1, link.kmlW);
            assertEquals(-1, link.kmlH);
            assertEquals('link', link.kmlHref);
            assertEquals('onChange', link.kmlRefreshMode);
            assertEquals(4, link.kmlRefreshInterval);
            assertEquals('never', link.kmlViewRefreshMode);
            assertEquals(4, link.kmlViewRefreshTime);
            assertEquals(1, link.kmlViewBoundScale);
            assertEquals('BBOX=10,10,10,10', link.kmlViewFormat);
            assertEquals('validQuery', link.kmlHttpQuery);
        })
    })
});