/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
	'src/formats/kml/util/Attribute',
	'src/util/XmlDocument'
], function (Attribute,
			 XmlDocument) {
	"use strict";
	describe("KmlAttributeTest", function () {
		var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
			"<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
			"<MultiGeometry id=\"7\">" +
			"   <LineString id=\"8\">" +
			"       <coordinates>10,10,0 20,10,0</coordinates>" +
			"   </LineString>" +
			"   <LineString id=\"9\">" +
			"       <extrude>0</extrude>" +
			"   </LineString>" +
			"</MultiGeometry>" +
			"<Icon id=\"10\">" +
			"   <x>10</x>" +
			"</Icon>" +
			"</kml>";
		var document = new XmlDocument(validKml).dom();

		it('should return value of existing attribute', function () {
			var node = document.getElementById("9");
			var attribute = new Attribute(node, "id");
			expect(attribute.value()).toEqual('9');
		});

		it('sets value to a nonexistent attribute', function() {
			var node = document.getElementById("9");
			var attribute = new Attribute(node, "name");
			attribute.save("newOne");
			expect(attribute.value()).toEqual('newOne');
		});

		it('updates value to existing attribute', function() {
			var node = document.getElementById("10");
			var attribute = new Attribute(node, "id");
			attribute.save("15");
			expect(attribute.value()).toEqual('15');
		});

		it('returns true if attribute exists', function() {
			var node = document.getElementById("9");
			var attribute = new Attribute(node, "id");
			expect(attribute.exists()).toEqual(true);
		});

		it('returns false if attribute doesn\'t exist', function() {
			var node = document.getElementById("9");
			var attribute = new Attribute(node, "test");
			expect(attribute.exists()).toEqual(false);
		});
	});
});