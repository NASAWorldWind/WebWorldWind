/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    "use strict";

    /**
     * Constructs an KmlLocation. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLocation
     * @classdesc Contains the data associated with Location node.
     * @param node Node representing location in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#location
     */
    var KmlLocation = function(node) {
        KmlObject.call(this, node);
    };

    KmlLocation.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLocation.prototype, {
        /**
         * Array of the tag names representing Kml location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Location'];
            }
        },

        /**
         * Longitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {Array}
         */
        longitude: {
            get: function() {
                return this.retrieve({name: 'longitude'});
            }
        },

        /**
         * Latitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {Array}
         */
        latitude: {
            get: function() {
                return this.retrieve({name: 'latitude'});
            }
        },

        /**
         * Altitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {Array}
         */
        altitude: {
            get: function() {
                return this.retrieve({name: 'altitude'});
            }
        }
    });

    KmlElements.addKey(KmlLocation.prototype.tagName[0], KmlLocation);

    return KmlLocation;
});