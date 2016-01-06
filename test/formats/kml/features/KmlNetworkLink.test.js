/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlLink',
    'src/formats/kml/features/KmlNetworkLink',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlLink,
    KmlNetworkLink,
    XmlDocument
) {
    "use strict";
    TestCase("KmlNetworkLinkTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<NetworkLink>" +
                    "<refreshVisibility>1</refreshVisibility>" +
                    "<flyToView>1</flyToView>" +
                    "<Link> </Link>" +
                "</NetworkLink>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var networkLink = new KmlNetworkLink({objectNode:
                kmlRepresentation.getElementsByTagName("NetworkLink")[0]});

            assertEquals(true, networkLink.kmlRefreshVisibility);
            assertEquals(true, networkLink.kmlFlyToView);

            assertTrue(networkLink.kmlLink instanceof KmlLink);
        })
    })
});