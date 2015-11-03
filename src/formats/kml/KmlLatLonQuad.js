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
     * Constructs an KmlLatLonQuad. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLatLonQuad
     * @classdesc Contains the data associated with LatLonQuad node.
     * @param node {Node} Node representing lat lon quadruple in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxlatlonquad
     */
    var KmlLatLonQuad = function (node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * Specifies the coordinates of the four corner points of a quadrilateral defining the overlay area. Exactly
             * four coordinate tuples have to be provided, each consisting of floating point values for longitude and
             * latitude. Insert a space between tuples. Do not include spaces within a tuple. The coordinates must be
             * specified in counter-clockwise order with the first coordinate corresponding to the lower-left corner of the
             * overlayed image. The shape described by these corners must be convex.
             * @memberof KmlLatLonQuad.prototype
             * @readonly
             * @type {Array}
             */
            coordinates: {
                get: function () {
                    return this.retrieve({name: 'coordinates'});
                }
            }
        });

        extend(this, KmlLatLonQuad.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlLatLonQuad.prototype.getTagNames = function() {
        return ['gx:LatLonQuad'];
    };

    KmlElements.addKey(KmlLatLonQuad.prototype.getTagNames()[0], KmlLatLonQuad);

    return KmlLatLonQuad;
});