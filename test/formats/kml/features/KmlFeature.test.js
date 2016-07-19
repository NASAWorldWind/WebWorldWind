/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlCamera',
    'src/formats/kml/KmlTimeSpan',
    'src/formats/kml/styles/KmlStyle',
    'src/formats/kml/KmlRegion',
    'src/formats/kml/features/KmlFeature',
    'src/util/XmlDocument'
], function (
    KmlCamera,
    KmlTimeSpan,
    KmlStyle,
    KmlRegion,
    KmlFeature,
    XmlDocument
) {
    "use strict";
    describe("KmlFeatureTest", function(){
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
            var feature = new KmlFeature({objectNode:
                kmlRepresentation.getElementsByTagName("Feature")[0]});
            it ("should have the Name, Visibility, Open, Address, PhoneNumber, Snippet, Description, StyleUrl properties " +
                "and have the prototype properties of KmlCamera, KmlTimeSpan, KmlStyle and KmlRegion",function(){
                expect(feature.kmlName).toEqual('featureName');
                expect(feature.kmlVisibility).toEqual(true);
                expect(feature.kmlOpen).toEqual(false);
                expect(feature.kmlAddress).toEqual('validAddress');
                expect(feature.kmlPhoneNumber).toEqual('validPhoneNumber');
                expect(feature.kmlSnippet).toEqual('validSnippet');
                expect(feature.kmlDescription).toEqual('validDescription');
                expect(feature.kmlStyleUrl).toEqual('someUrl');

                expect(feature.kmlAbstractView instanceof KmlCamera).toBeTruthy();
                expect(feature.kmlTimePrimitive instanceof KmlTimeSpan).toBeTruthy();
                expect(feature.kmlStyleSelector instanceof KmlStyle).toBeTruthy();
                expect(feature.kmlRegion instanceof KmlRegion).toBeTruthy();


            });

        });
    });
