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
     * Constructs an KmlLatLonAltBox. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLatLonAltBox
     * @classdesc Contains the data associated with LatLonAltBox node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing alternative lat lon box in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#latlonaltbox
     * @aguments KmlObject
     */
    var KmlLatLonAltBox = function (options) {
        KmlObject.call(this, options);
    };

    KmlLatLonAltBox.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonAltBox.prototype, {
        /**
         * Specifies the latitude of the north edge of the bounding box, in decimal degrees from 0 to +-90.
         * @memberof KmlLatLonAltBox.prototype
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
         * @memberof KmlLatLonAltBox.prototype
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
         * @memberof KmlLatLonAltBox.prototype
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
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        kmlWest: {
            get: function () {
                return this._factory.specific(this, {name: 'west', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specified in meters (and is affected by the altitude mode specification).
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        kmlMinAltitude: {
            get: function () {
                return this._factory.specific(this, {name: 'minAltitude', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specified in meters (and is affected by the altitude mode specification).
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        kmlMaxAltitude: {
            get: function () {
                return this._factory.specific(this, {name: 'maxAltitude', transformer: NodeTransformers.number});
            }
        }
    });


    /**
     * @inheritDoc
     */
    KmlLatLonAltBox.prototype.getTagNames = function () {
        return ['LatLonAltBox'];
    };

    KmlElements.addKey(KmlLatLonAltBox.prototype.getTagNames()[0], KmlLatLonAltBox);

    return KmlLatLonAltBox;
});