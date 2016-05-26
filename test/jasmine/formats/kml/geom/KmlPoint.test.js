/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Vec3.test.js 2498 2014-12-01 22:21:09Z danm $
 */
define([
    'src/util/XmlDocument',
    'src/formats/kml/geom/KmlPoint'
], function (XmlDocument,
             KmlPoint) {
    describe("KmlPointTest",function() {
            var kmlFile = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <extrude>true</extrude>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "   <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>" +
                "</Point>" +
                "</kml>";

            var kmlRepresentation = new XmlDocument(kmlFile).dom();
            var point = new KmlPoint({objectNode: kmlRepresentation.getElementsByTagName("Point")[0]});
            it("should have the longitude, latitude, altitude, Extrude, AltitudeMode and id properties", function(){
                expect(point.kmlPosition.longitude).toEqual('-122.0822035425683');
                expect(point.kmlPosition.latitude).toEqual('37.42228990140251');
                expect(point.kmlPosition.altitude).toEqual('0');
                expect(point.kmlExtrude).toEqual(true);
                expect(point.kmlAltitudeMode).toEqual("clampToGround");
                expect(point.id).toEqual("1");
            });




        });
    });

