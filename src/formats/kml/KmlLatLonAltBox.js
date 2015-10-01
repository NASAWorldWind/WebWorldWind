/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlObject'
], function (KmlElements,
             KmlObject) {
    "use strict";

    /**
     * Constructs an KmlLatLonAltBox. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLatLonAltBox
     * @classdesc Contains the data associated with LatLonAltBox node.
     * @param node Node representing alternative lat lon box in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#latlonaltbox
     */
    var KmlLatLonAltBox = function (node) {
        KmlObject.call(this, node);
    };

    KmlLatLonAltBox.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonAltBox.prototype, {
        /**
         * Array of the tag names representing Kml alternative lat lon box.
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function () {
                return ['LatLonAltBox'];
            }
        },

        /**
         * Specifies the latitude of the north edge of the bounding box, in decimal degrees from 0 to ±90.
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        north: {
            get: function () {
                return this.retrieve({name: 'north', transformer: Number});
            }
        },

        /**
         * Specifies the latitude of the south edge of the bounding box, in decimal degrees from 0 to ±90.
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        south: {
            get: function () {
                return this.retrieve({name: 'south', transformer: Number});
            }
        },

        /**
         * Specifies the longitude of the east edge of the bounding box, in decimal degrees from 0 to ±180.
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        east: {
            get: function () {
                return this.retrieve({name: 'east', transformer: Number});
            }
        },

        /**
         * Specifies the longitude of the west edge of the bounding box, in decimal degrees from 0 to ±180.
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        west: {
            get: function () {
                return this.retrieve({name: 'west', transformer: Number});
            }
        },

        /**
         * Specified in meters (and is affected by the altitude mode specification).
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        minAltitude: {
            get: function () {
                return this.retrieve({name: 'minAltitude'});
            }
        },

        /**
         * Specified in meters (and is affected by the altitude mode specification).
         * @memberof KmlLatLonAltBox.prototype
         * @readonly
         * @type {Number}
         */
        maxAltitude: {
            get: function () {
                return this.retrieve({name: 'maxAltitude'});
            }
        }
    });

    KmlElements.addKey(KmlLatLonAltBox.prototype.tagName[0], KmlLatLonAltBox);

    return KmlLatLonAltBox;
});