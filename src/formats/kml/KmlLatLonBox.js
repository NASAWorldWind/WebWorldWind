/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlObject',
    './util/NodeTransformers'
], function (KmlElements,
             KmlObject,
             NodeTransformers) {
    "use strict";

    /**
     * Constructs an KmlLatLonBox. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLatLonBox
     * @classdesc Contains the data associated with LatLonBox node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing box lat lon in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#latlonbox
     * @augments KmlObject
     */
    var KmlLatLonBox = function (options) {
        KmlObject.call(this, options);
    };

    KmlLatLonBox.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonBox.prototype, {
        /**
         * Specifies the latitude of the north edge of the bounding box, in decimal degrees from 0 to +-90.
         * @memberof KmlLatLonBox.prototype
         * @readonly
         * @type {Number}
         */
        kmlNorth: {
            get: function () {
                return this._factory.specific(this, {name: 'north', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies the latitude of the south edge of the bounding box, in decimal degrees from 0 to +-90.
         * @memberof KmlLatLonBox.prototype
         * @readonly
         * @type {Number}
         */
        kmlSouth: {
            get: function () {
                return this._factory.specific(this, {name: 'south', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies the longitude of the east edge of the bounding box, in decimal degrees from 0 to +-180.
         * @memberof KmlLatLonBox.prototype
         * @readonly
         * @type {Number}
         */
        kmlEast: {
            get: function () {
                return this._factory.specific(this, {name: 'east', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies the longitude of the west edge of the bounding box, in decimal degrees from 0 to +-180.
         * @memberof KmlLatLonBox.prototype
         * @readonly
         * @type {Number}
         */
        kmlWest: {
            get: function () {
                return this._factory.specific(this, {name: 'west', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies a rotation of the overlay about its center, in degrees. Values can be +-180. The default is 0
         * (north). Rotations are specified in a counterclockwise direction.
         * @memberof KmlLatLonBox.prototype
         * @readonly
         * @type {String}
         */
        kmlRotation: {
            get: function () {
                return this._factory.specific(this, {name: 'rotation', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlLatLonBox.prototype.getTagNames = function () {
        return ['LatLonBox'];
    };

    KmlElements.addKey(KmlLatLonBox.prototype.getTagNames()[0], KmlLatLonBox);

    return KmlLatLonBox;
});