/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
},[
    'test/CatchTest',
    'src/formats/kml/KmlObject',
    'src/formats/kml/geom/KmlPoint',
    'src/util/XmlDocument'
], function(
    CatchTest,
    KmlObject,
    KmlPoint,
    XmlDocument
){
    TestCase("KmlObjectTestCase", {
        "testUndefinedNode": CatchTest(function() {
            try {
                new KmlObject();
                fail("Exception should have been thrown");
            } catch(e) {
                assertEquals("ArgumentError", e.name);
            }
        }),

        testNullNode: CatchTest(function() {
            try {
                new KmlObject(null,{});
                fail("Exception should have been thrown");
            } catch(e) {
                assertEquals("ArgumentError", e.name);
            }
        }),

        testRetrievalOfExistingNodeWithContent: CatchTest(function(){
            var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <extrude>true</extrude>" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'extrude', transformer: Boolean});
            assertEquals(true, retrievedValue);
        }),

        testRetrievalOfExistingNodeWithoutTransformer: CatchTest(function(){
            var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <extrude>true</extrude>" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'extrude'});
            assertEquals("true", retrievedValue);
        }),

        testRetrievalOfExistingNodeWithoutContent: CatchTest(function(){
            var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <extrude></extrude>" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'extrude'});
            assertEquals("", retrievedValue);
        }),

        testRetrievalOfExistingAttribute: CatchTest(function(){
            var validKmlWithoutSubNode = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithoutSubNode).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'id', isAttribute: true, transformer: Number});
            assertEquals(1, retrievedValue);
        }),

        testRetrievalOfNonexistentAttribute: CatchTest(function(){
            var validKmlWithoutAttribute = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithoutAttribute).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'class', isAttribute: true});
            assertEquals(null, retrievedValue);
        }),

        testRetrievalOfNonexistentNode: CatchTest(function(){
            var validKmlWithoutSubNode = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithoutSubNode).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'extrude', transformer: Boolean});
            assertEquals(null, retrievedValue);
        }),

        testRetrievingChildNode: CatchTest(function(){
            var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <Point id=\"2\"></Point>" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).createChildElement({name: 'Point'});
            assertTrue(retrievedValue instanceof KmlPoint);
        }),

        testRetrievalOfAttributeFromChildNode: CatchTest(function() {
            var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <Point id=\"2\" randAttr=\"value\"></Point>" +
                "</Point>" +
                "</kml>";

            var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
            var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
            var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieveAttribute({name: 'Point', attributeName: 'randAttr'});
            assertEquals("value", retrievedValue);
        })
    });
});