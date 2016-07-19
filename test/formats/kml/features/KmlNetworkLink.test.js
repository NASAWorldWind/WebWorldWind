/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlLink',
    'src/formats/kml/features/KmlNetworkLink',
    'src/util/XmlDocument'
], function (
    KmlLink,
    KmlNetworkLink,
    XmlDocument
) {
    "use strict";
    describe("KmlNetworkLinkTest", function() {
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
            it ("should have the RefreshVisibility, FlyToView properties and have the prototype properties of " +
                "KmlLink", function(){
                expect(networkLink.kmlRefreshVisibility).toEqual(true);
                expect(networkLink.kmlFlyToView).toEqual(true);
                expect(networkLink.kmlLink instanceof KmlLink).toBeTruthy();

            });

        });
    });