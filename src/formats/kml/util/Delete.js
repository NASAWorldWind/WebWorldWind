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