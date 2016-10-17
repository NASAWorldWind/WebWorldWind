/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
	'../KmlAbstractView',
	'../KmlElements',
	'../KmlObject',
	'./NodeTransformers',
	'./Update'
], function (KmlAbstractView,
			 KmlElements,
			 KmlObject,
			 NodeTransformers,
			 Update) {
	/**
	 * Controls the behavior of files fetched by a <NetworkLink>. It is direct descendant of kml and there should always be maximum one per document.
	 * @alias NetworkLinkControl
	 * @constructor
	 * @augments KmlObject
	 */
	var NetworkLinkControl = function(options) {
		KmlObject.call(this, options);
	};

	NetworkLinkControl.prototype = Object.create(KmlObject.prototype);

	Object.defineProperties(NetworkLinkControl.prototype, {
		/**
		 * Specified in seconds, <minRefreshPeriod> is the minimum allowed time between fetches of the file. This parameter allows servers to throttle fetches of a particular file and to tailor refresh rates to the expected rate of change to the data. For example, a user might set a link refresh to 5 seconds, but you could set your minimum refresh period to 3600 to limit refresh updates to once every hour.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {Number}
		 */
		minRefreshPeriod: {
			get: function() {
				return this._factory.specific(this, {name: 'minRefreshPeriod', transformer: NodeTransformers.number});
			}
		},

		/**
		 * Specified in seconds, <maxSessionLength> is the maximum amount of time for which the client NetworkLink can remain connected. The default value of -1 indicates not to terminate the session explicitly.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {Number}
		 */
		maxSessionLength: {
			get: function() {
				return this._factory.specific(this, {name: 'maxSessionLength', transformer: NodeTransformers.number});
			}
		},

		/**
		 * Use this element to append a string to the URL query on the next refresh of the network link. You can use this data in your script to provide more intelligent handling on the server side, including version querying and conditional file delivery.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		cookie: {
			get: function() {
				return this._factory.specific(this, {name: 'cookie', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can deliver a pop-up message, such as usage guidelines for your network link. The message appears when the network link is first loaded into Google Earth, or when it is changed in the network link control.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		message: {
			get: function() {
				return this._factory.specific(this, {name: 'message', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can control the name of the network link from the server, so that changes made to the name on the client side are overridden by the server.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		linkName: {
			get: function() {
				return this._factory.specific(this, {name: 'linkName', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can control the description of the network link from the server, so that changes made to the description on the client side are overridden by the server.You can control the description of the network link from the server, so that changes made to the description on the client side are overridden by the server.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		linkDescription: {
			get: function() {
				return this._factory.specific(this, {name: 'linkDescription', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can control the snippet for the network link from the server, so that changes made to the snippet on the client side are overridden by the server. <linkSnippet> has a maxLines attribute, an integer that specifies the maximum number of lines to display.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {String}
		 */
		linkSnippet: {
			get: function() {
				return this._factory.specific(this, {name: 'linkSnippet', transformer: NodeTransformers.string});
			}
		},

		/**
		 * You can specify a date/time at which the link should be refreshed. This specification takes effect only if the <refreshMode> in <Link> has a value of onExpire. See <refreshMode>
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {Date}
		 */
		expires: {
			get: function() {
				return this._factory.specific(this, {name: 'expires', transformer: NodeTransformers.date});
			}
		},

		/**
		 * With <Update>, you can specify any number of Change, Create, and Delete tags for a .kml file or .kmz archive that has previously been loaded with a network link. See <Update>.
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {Update}
		 */
		Update: {
			get: function() {
				return this._factory.any(this, {
					name: Update.prototype.getTagNames()
				});
			}
		},

		/**
		 * Either Camera or LookAt which will be used to fly to the location whenever the
		 * @memberof NetworkLinkControl.prototype
		 * @readonly
		 * @type {AbstractView}
		 */
		AbstractView: {
			get: function() {
				return this._factory.any(this, {
					name: KmlAbstractView.prototype.getTagNames()
				});
			}
		}
	});

	/**
	 * @inheritDoc
	 */
	NetworkLinkControl.prototype.getTagNames = function() {
		return ['NetworkLinkControl'];
	};

	KmlElements.addKey(ItemIcon.prototype.getTagNames()[0], NetworkLinkControl);

	return NetworkLinkControl;
});