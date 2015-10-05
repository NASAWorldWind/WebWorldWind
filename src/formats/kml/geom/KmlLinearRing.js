/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlLineString',
    '../KmlElements'
], function (
    KmlLineString,
    KmlElements
) {
    "use strict";
    /**
     * Constructs an KmlLinearRing element. Applications don't usually call this constructor. It is called by objects in
     * the hierarchy of KmlObject.
     * @alias KmlLinearRing
     * @classdesc Contains the data associated with LinerRing
     * @param linearRingNode Node of the object to be retrieved.
     * @constructor
     * @see https://developers.google.com/kml/documentation/kmlreference#linearring
     */
    var KmlLinearRing = function(linearRingNode) {
        KmlLineString.call(this, linearRingNode);
    };

    KmlLinearRing.prototype = Object.create(KmlLineString.prototype);

    Object.defineProperties(KmlLinearRing.prototype, {
        /**
         * Array of the tag names representing Kml linear ring.
         * @memberof KmlLinearRing.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['LinearRing'];
            }
        }
    });

    KmlElements.addKey(KmlLinearRing.prototype.tagName[0], KmlLinearRing);

    return KmlLinearRing;
});