/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
define([
	'src/formats/kml/util/KmlElementsFactoryCached',
	'src/formats/kml/geom/KmlGeometry',
	'src/formats/kml/geom/KmlLineString',
	'src/formats/kml/geom/KmlMultiGeometry',
	'src/formats/kml/geom/KmlPoint',
	'src/formats/kml/util/KmlNodeTransformers',
	'src/util/XmlDocument'
], function (KmlElementsFactoryCached,
			 KmlGeometry,
			 KmlLineString,
			 KmlMultiGeometry,
			 KmlPoint,
			 NodeTransformers,
			 XmlDocument) {
	"use strict";
	describe("KmlElementsFactoryCachedTest", function () {
		var factory = new KmlElementsFactoryCached();
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

		it('should return all cached elements', function(){
			var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("7")});
			var createdElements = factory.all(currentMultiGeometry);
			var createdElementsFromCache = factory.all(currentMultiGeometry);

			expect(createdElements[0] && createdElements[0] === createdElementsFromCache[0]).toBeTruthy();
			expect(createdElements[1] && createdElements[1] === createdElementsFromCache[1]).toBeTruthy();
		});

		it('should return any cached element', function(){
			var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("11")});
			var createdElement = factory.any(currentMultiGeometry, {name: KmlGeometry.getTagNames()});
			var createdElementFromCache = factory.any(currentMultiGeometry, {name: KmlGeometry.getTagNames()});

			expect(createdElement === createdElementFromCache).toBeTruthy();
		});

		it('should return specific cached element', function(){
			var currentMultiGeometry = new KmlMultiGeometry({objectNode: document.getElementById("11")});
			var createdElement = factory.specific(currentMultiGeometry, {name: "Point", transformer: NodeTransformers.kmlObject});
			var createdElementFromCache = factory.specific(currentMultiGeometry, {name: "Point", transformer: NodeTransformers.kmlObject});

			expect(createdElement === createdElementFromCache).toBeTruthy();
		});

		it('should return correct cached primitive when the start is the same but longer.', function(){
			var currentLineString = new KmlLineString({objectNode: document.getElementById("8")});
			factory.specific(currentLineString, {name: 'coordinatesSpecific', transformer: NodeTransformers.string});
			var retrievedValue = factory.specific(currentLineString, {name: 'coordinates', transformer: NodeTransformers.string});

			expect("10,10,0 20,10,0").toEqual(retrievedValue);
		})
	});
});