/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlCamera',
    'src/formats/kml/KmlTimeSpan',
    'src/formats/kml/styles/KmlStyle',
    'src/formats/kml/KmlRegion',
    'src/formats/kml/features/KmlFeature',
    'src/util/XmlDocument'
], function (
    CatchTest,
    KmlCamera,
    KmlTimeSpan,
    KmlStyle,
    KmlRegion,
    KmlFeature,
    XmlDocument
) {
    "use strict";
    TestCase("KmlFeatureTest", {
        testValidKml: CatchTest(function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Feature id=\"ID\">" +
                    "<name>featureName</name>" +
                    "<visibility>1</visibility>" +
                    "<open>0</open>" +
                    "<address>validAddress</address>" +
                    "<phoneNumber>validPhoneNumber</phoneNumber>" +
                    "<Snippet maxLines=\"2\">validSnippet</Snippet>" +
                    "<description>validDescription</description>" +
                    "<Camera></Camera>" +
                    "<TimeSpan></TimeSpan>" +
                    "<styleUrl>someUrl</styleUrl>" +
                    "<Style></Style>" +
                    "<Region></Region>" +
                "</Feature>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var feature = new KmlFeature(
                kmlRepresentation.getElementsByTagName("Feature")[0]);

            assertEquals('featureName', feature.name);
            assertEquals(true, feature.visibility);
            assertEquals(false, feature.open);
            assertEquals('validAddress', feature.address);
            assertEquals('validPhoneNumber', feature.phoneNumber);
            assertEquals('validSnippet', feature.Snippet);
            assertEquals('validDescription', feature.description);
            assertEquals('someUrl', feature.styleUrl);

            assertTrue(feature.AbstractView instanceof KmlCamera);
            assertTrue(feature.TimePrimitive instanceof KmlTimeSpan);
            assertTrue(feature.StyleSelector instanceof KmlStyle);
            assertTrue(feature.Region instanceof KmlRegion);
        })
    })
});