/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlObject',
    'src/formats/kml/geom/KmlPoint',
    'src/util/XmlDocument'
], function(
    KmlObject,
    KmlPoint,
    XmlDocument
) {
    describe("KmlObjectTestCase", function () {
        describe("testUndefinedNode", function () {

            it('should raise an exception', function () {
                expect(function () {
                    new KmlObject();
                    fail("Exception should have been thrown");
                }).toThrow();
            });


            });
            describe('testNullNode', function () {


                it('should raise an Argument Error exception', function () {
                    expect(function () {
                        new KmlObject(null, {});
                        fail("Exception should have been thrown")}).toThrow();
                });
            });

            describe('testRetrievalOfExistingNodeWithContent', function () {
                var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "   <extrude>true</extrude>" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({
                    name: 'extrude',
                    transformer: Boolean
                });
                it('should be correctly retrieved', function () {
                    expect(retrievedValue).toBe(true);
                });
            });

            describe('testRetrievalOfExistingNodeWithoutTransformer', function () {
                var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "   <extrude>true</extrude>" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'extrude'});
                it('should be correctly retrieved', function () {
                    expect(retrievedValue).toBe('true');
                });
            });

            describe('testRetrievalOfExistingNodeWithoutContent', function () {
                var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "   <extrude></extrude>" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'extrude'});
                it('should be correctly retrieved without content', function () {
                    expect(retrievedValue).toBe("");
                });
            });

            describe('testRetrievalOfExistingAttribute', function () {
                var validKmlWithoutSubNode = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithoutSubNode).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({
                    name: 'id',
                    isAttribute: true,
                    transformer: Number
                });
                it('should be correctly retrieved', function () {
                    expect(retrievedValue).toBe(1);
                });
            });

            describe('testRetrievalOfNonexistentAttribute', function () {
                var validKmlWithoutAttribute = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithoutAttribute).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({name: 'class', isAttribute: true});
                it('the retreved value should be null', function () {
                    expect(retrievedValue).toBe(null);
                });

            });

            describe('testRetrievalOfNonexistentNode', function () {
                var validKmlWithoutSubNode = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithoutSubNode).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieve({
                    name: 'extrude',
                    transformer: Boolean
                });

                it('the retreved value should be null', function () {
                    expect(retrievedValue).toBe(null);
                });
            });

            describe('testRetrievingChildNode', function () {
                var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "   <Point id=\"2\"></Point>" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).createChildElement({name: 'Point'});
                it('the retrieved value should be an instance of KmlPoint', function () {
                    expect(retrievedValue instanceof KmlPoint).toBeTruthy();
                });

            });

            describe('testRetrievalOfAttributeFromChildNode', function () {
                var validKmlWithValidInformation = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "   <Point id=\"2\" randAttr=\"value\"></Point>" +
                    "</Point>" +
                    "</kml>";

                var kmlDocument = new XmlDocument(validKmlWithValidInformation).dom();
                var kmlNode = kmlDocument.getElementsByTagName("Point")[0];
                var retrievedValue = new KmlObject({objectNode: kmlNode}).retrieveAttribute({
                    name: 'Point',
                    attributeName: 'randAttr'
                });
                it('should be possible to retrieve the attibute value ', function () {
                    expect(retrievedValue).toBe("value");
                });
            });
        });
    });
