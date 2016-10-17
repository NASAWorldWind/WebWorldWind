/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
	'src/formats/kml/util/TreeKeyValueCache'
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