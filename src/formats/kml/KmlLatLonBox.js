/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../util/extend',
    './KmlElements',
    './KmlObject'
], function (extend,
             KmlElements,
             KmlObject) {
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

        Object.defineProperties(this, {
            /**
             * Specifies the latitude of the north edge of the bounding box, in decimal degrees from 0 to +-90.
             * @memberof KmlLatLonBox.prototype
             * @readonly
             * @type {Number}
             */
            kmlNorth: {
                get: function () {
                    return this.retrieve({name: 'north', transformer: Number});
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
                    return this.retrieve({name: 'south', transformer: Number});
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
                    return this.retrieve({name: 'east', transformer: Number});
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
                    return this.retrieve({name: 'west', transformer: Number});
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
                    return this.retrieve({name: 'rotation'});
                }
            }
        });

        extend(this, KmlLatLonBox.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlLatLonBox.prototype.getTagNames = function () {
        return ['LatLonBox'];
    };

    KmlElements.addKey(KmlLatLonBox.prototype.getTagNames()[0], KmlLatLonBox);

    return KmlLatLonBox;
});