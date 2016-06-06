/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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