/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
	'src/formats/kml/util/KmlElementsFactory',
	'src/formats/kml/geom/KmlGeometry',
	'src/formats/kml/geom/KmlLineString',
	'src/formats/kml/geom/KmlMultiGeometry',
	'src/formats/kml/geom/KmlPoint',
	'src/formats/kml/util/NodeTransformers',
	'src/util/XmlDocument'
], function (KmlElementsFactory,
			 KmlGeometry,
			 KmlLineString,
			 KmlMultiGeometry,
			 KmlPoint,
			 NodeTransformers,
			 XmlDocument) {
	"use strict";
	describe("KmlElementsFactoryTest", function () {
		var factory = new KmlElementsFactory();
		var exampleDocument = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
			"<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
			"<MultiGeometry id=\"7\">" +
			"   <LineString id=\"8\">" +
			"       <coordinates>10,10,0 20,10,0</coordinates>" +
			"   </LineString>" +
			"   <LineString id=\"9\">" +
			"       <extrude>0</extrude>" +
			"   </LineString>" +
			"</MultiGeometry>" +
			"<Placemark id=\"11\">" +
			"   <Point id=\"13\">" +
			"       <extrude>0</extrude>" +
			"   </Point>" +
			"</Placemark>" +
			"<Icon id=\"10\">" +
			"   <x>10</x>" +
			"</Icon>" +
			"</kml>";
		var document = new XmlDocument(exampleDocument).dom();

		it('should return single primitive', function () {
			var currentLineString = new KmlLineString({objectNode: document.getElementById("8")});
			var retrievedValue = factory.specific(currentLineString, {name: 'coordinates', transformer: NodeTransformers.string});

			expect("10,10,0 20,10,0").toEqual(retrievedValue);
		});

		it('should return single non primitive', function () {
			var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("7")});
			var retrievedValue = factory.specific(
				currentMultiGeometry, {name: 'LineString', transformer: NodeTransformers.kmlObject}
			);

			expect(retrievedValue instanceof KmlLineString).toEqual(true);
		});

		it('should return any type of element.', function(){
			var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("11")});
			var createdElement = factory.any(currentMultiGeometry, {name: KmlGeometry.getTagNames()});

			expect(createdElement instanceof KmlPoint).toEqual(true);
		});

		it('should return all elements in level', function(){
			var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("7")});
			var createdElements = factory.all(currentMultiGeometry);

			expect(2).toEqual(createdElements.length);
			expect(createdElements[0] instanceof KmlLineString).toEqual(true);
			expect(createdElements[1] instanceof KmlLineString).toEqual(true);
		});
	});
});