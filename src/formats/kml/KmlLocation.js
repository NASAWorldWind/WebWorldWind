/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlObject',
    './util/NodeTransformers'
], function (
    KmlElements,
    KmlObject, 
    NodeTransformers
) {
    "use strict";

    /**
     * Constructs an KmlLocation. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLocation
     * @classdesc Contains the data associated with Location node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing location in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#location
     * @augments KmlObject
     */
    var KmlLocation = function (options) {
        KmlObject.call(this, options);
    };

    KmlLocation.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLocation.prototype, {
        /**
         * Longitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {String}
         */
        kmlLongitude: {
            get: function() {
                return this._factory.specific(this, {name: 'longitude', transformer: NodeTransformers.string});
            }
        },

        /**
         * Latitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {String}
         */
        kmlLatitude: {
            get: function() {
                return this._factory.specific(this, {name: 'latitude', transformer: NodeTransformers.string});
            }
        },

        /**
         * Altitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {String}
         */
        kmlAltitude: {
            get: function() {
                return this._factory.specific(this, {name: 'altitude', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlLocation.prototype.getTagNames = function () {
        return ['Location'];
    };

    KmlElements.addKey(KmlLocation.prototype.getTagNames()[0], KmlLocation);

    return KmlLocation;
});