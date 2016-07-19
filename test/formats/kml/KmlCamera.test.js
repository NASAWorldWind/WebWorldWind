/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlCamera',
    'src/util/XmlDocument'
], function (KmlCamera,
    		 XmlDocument) {
	"use strict";

	describe("KmlCameraTest", function() {
		var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
    		"<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
    		"<Camera>" +
    		"   <longitude>10</longitude>" +
    		"   <latitude>9</latitude>" +
    		"   <altitude>8</altitude>" +
    		"   <heading>1</heading>" +
    		"   <tilt>7</tilt>" +
    		"   <roll>6</roll>" +
    		"   <altitudeMode>clampToGround</altitudeMode>" +
    		"</Camera>" +
    		"</kml>";
		var kmlRepresentation = new XmlDocument(validKml).dom();
		var camera = new KmlCamera({objectNode:
    		kmlRepresentation.getElementsByTagName("Camera")[0]});
	
		it("should have the Longitude, Latitude, Altitude, Heading, Tilt, Roll and AltitudeMode properties", function() {
			expect(camera.kmlLongitude).toEqual('10');
			expect(camera.kmlLatitude).toEqual('9');
			expect(camera.kmlAltitude).toEqual('8');
			expect(camera.kmlHeading).toEqual('1');
			expect(camera.kmlTilt).toEqual('7');
			expect(camera.kmlRoll).toEqual('6');
			expect(camera.kmlAltitudeMode).toEqual("clampToGround");
		})	
	});
});