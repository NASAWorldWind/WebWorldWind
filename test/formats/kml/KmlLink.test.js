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
            var link = new KmlLink(
                kmlRepresentation.getElementsByTagName("Link")[0]);

            assertEquals('link', link.href);
            assertEquals('onChange', link.refreshMode);
            assertEquals(4, link.refreshInterval);
            assertEquals('never', link.viewRefreshMode);
            assertEquals(4, link.viewRefreshTime);
            assertEquals(1, link.viewBoundScale);
            assertEquals('BBOX=10,10,10,10', link.viewFormat);
            assertEquals('validQuery', link.httpQuery);
        })
    })
});