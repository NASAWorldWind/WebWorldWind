/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
	'../KmlElements',
	'../KmlObject'
], function(KmlElements,
			KmlObject){
	/**
	 * @augments KmlObject
	 * @param options
	 * @constructor
	 * @alias Delete
	 */
	var Delete = function(options) {
		KmlObject.call(this, options);
	};

	Delete.prototype = Object.create(KmlObject.prototype);

	Object.defineProperties(Delete.prototype, {
		/**
		 * All shapes which should be deleted
		 * @memberof Delete.prototype
		 * @readonly
		 * @type {KmlObject[]}
		 */
		shapes: {
			get: function(){
				return this._factory.all(this);
			}
		}
	});

	/**
	 * @inheritDoc
	 */
	Delete.prototype.getTagNames = function() {
		return ['Delete'];
	};

	KmlElements.addKey(Delete.prototype.getTagNames()[0], Delete);

	return Delete;
});