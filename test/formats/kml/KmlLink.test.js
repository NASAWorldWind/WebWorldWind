/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLink',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLink,
    XmlDocument
) {
    "use strict";
    TestCase("KmlLinkTest", {
        testValidKml: CatchTest(function () {
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