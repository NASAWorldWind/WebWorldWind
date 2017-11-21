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
	 * @augment KmlObject
	 * @param options
	 * @constructor
	 * @alias Change
	 */
	var Change = function(options) {
		KmlObject.call(this, options);
	};

	Change.prototype = Object.create(KmlObject.prototype);

	Object.defineProperties(Change.prototype, {
		/**
		 * All shapes which should be changed with the location where they should be changed.
		 * @memberof Change.prototype
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
	Change.prototype.getTagNames = function() {
		return ['Change'];
	};

	KmlElements.addKey(Change.prototype.getTagNames()[0], Change);

	return Change;
});