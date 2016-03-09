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
     * Constructs an KmlLatLonQuad. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLatLonQuad
     * @classdesc Contains the data associated with LatLonQuad node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing lat lon quadruple in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxlatlonquad
     * @augments KmlObject
     */
    var KmlLatLonQuad = function (options) {
        KmlObject.call(this, options);
    };

    KmlLatLonQuad.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonQuad.prototype, {
        /**
         * Specifies the coordinates of the four corner points of a quadrilateral defining the overlay area.
         * Exactly
         * four coordinate tuples have to be provided, each consisting of floating point values for longitude and
         * latitude. Insert a space between tuples. Do not include spaces within a tuple. The coordinates must be
         * specified in counter-clockwise order with the first coordinate corresponding to the lower-left corner of
         * the overlayed image. The shape described by these corners must be convex.
         * @memberof KmlLatLonQuad.prototype
         * @readonly
         * @type {String}
         */
        kmlCoordinates: {
            get: function () {
                return this._factory.specific(this, {name: 'coordinates', transformer: NodeTransformers.string});
            }
        }
    });


    /**
     * @inheritDoc
     */
    KmlLatLonQuad.prototype.getTagNames = function () {
        return ['gx:LatLonQuad'];
    };

    KmlElements.addKey(KmlLatLonQuad.prototype.getTagNames()[0], KmlLatLonQuad);

    return KmlLatLonQuad;
});