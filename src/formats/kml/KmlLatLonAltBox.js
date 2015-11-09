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
     * Constructs an KmlLatLonAltBox. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLatLonAltBox
     * @classdesc Contains the data associated with LatLonAltBox node.
     * @param node {Node} Node representing alternative lat lon box in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#latlonaltbox
     */
    var KmlLatLonAltBox = function (node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * Specifies the latitude of the north edge of the bounding box, in decimal degrees from 0 to +-90.
             * @memberof KmlLatLonAltBox.prototype
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
             * @memberof KmlLatLonAltBox.prototype
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
             * @memberof KmlLatLonAltBox.prototype
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
             * @memberof KmlLatLonAltBox.prototype
             * @readonly
             * @type {Number}
             */
            kmlWest: {
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
            kmlMinAltitude: {
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
            kmlMaxAltitude: {
                get: function () {
                    return this.retrieve({name: 'maxAltitude'});
                }
            }
        });

        extend(this, KmlLatLonAltBox.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlLatLonAltBox.prototype.getTagNames = function () {
        return ['LatLonAltBox'];
    };

    KmlElements.addKey(KmlLatLonAltBox.prototype.getTagNames()[0], KmlLatLonAltBox);

    return KmlLatLonAltBox;
});