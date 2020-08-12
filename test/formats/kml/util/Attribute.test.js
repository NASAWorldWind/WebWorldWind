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
	'src/formats/kml/util/KmlAttribute',
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