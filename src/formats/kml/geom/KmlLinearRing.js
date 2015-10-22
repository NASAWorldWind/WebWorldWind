/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlLineString',
    '../KmlElements'
], function (
    extend,
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
    var KmlLinearRing = function(linearRingNode, pStyle) {
        KmlLineString.call(this, linearRingNode, pStyle);

        extend(this, KmlLinearRing.prototype);
    };

    KmlLinearRing.prototype = Object.create(KmlLineString.prototype);

    KmlLinearRing.prototype.getTagNames = function() {
        return ['LinearRing'];
    };

    KmlElements.addKey(KmlLinearRing.prototype.getTagNames()[0], KmlLinearRing);

    return KmlLinearRing;
});