/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
	'src/formats/kml/util/KmlTreeKeyValueCache'
], function (TreeKeyValueCache) {
	"use strict";
	describe("TreKeyValueCacheTest", function () {
		describe('#retrieval', function(){
			var cache;
			beforeEach(function(){
				cache = new TreeKeyValueCache();
				cache.add("MultiGeometry#1", "LineString#1", "ToStore");
				cache.add("MultiGeometry#1", "LineString#2", "ToStore2");
				cache.add("MultiGeometry#2", "LineString#1", "ToStore3");
			});

			it('retrieves the specific piece of data', function(){
				var retrievedValue = cache.value("MultiGeometry#1", "LineString#1");
				expect("ToStore").toEqual(retrievedValue);
			});

			it('retrieves the data for whole level', function(){
				var level = cache.level("MultiGeometry#1");
				expect("ToStore").toEqual(level["LineString#1"]);
				expect("ToStore2").toEqual(level["LineString#2"]);
			});

			it('retrieves the unspecified amount of data', function(){
				var retrievedValue = cache.value("MultiGeometry#1", "LineString");
				expect("ToStore").toEqual(retrievedValue);
			});
		});

		describe('#removal', function(){
			var cache;
			beforeEach(function(){
				cache = new TreeKeyValueCache();
				cache.add("MultiGeometry#1", "LineString#1", "ToStore");
				cache.add("MultiGeometry#1", "LineString#2", "ToStore2");
				cache.add("MultiGeometry#2", "LineString#1", "ToStore3");

				cache.remove("MultiGeometry#1", "LineString#2");
			});

			it('retrieves null', function(){
				expect(null).toEqual(cache.value("MultiGeometry#1", "LineString#2"));
			})
		});
	});
});