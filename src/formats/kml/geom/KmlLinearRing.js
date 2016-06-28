/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlLineString',
    '../KmlElements'
], function (KmlLineString,
             KmlElements) {
    "use strict";
    /**
     * Constructs an KmlLinearRing element. Applications don't usually call this constructor. It is called by objects in
     * the hierarchy of KmlObject.
     * @alias KmlLinearRing
     * @classdesc Contains the data associated with LinerRing
     * @param options {Object}
     * @param options.objectNode {Node} Node representing LinearRing.
     * @param options.style {Promise} Promise of style to be applied to current geometry
     * @constructor
     * @see https://developers.google.com/kml/documentation/kmlreference#linearring
     * @augments KmlLineString
     */
    var KmlLinearRing = function (options) {
        KmlLineString.call(this, options);
    };

    KmlLinearRing.prototype = Object.create(KmlLineString.prototype);

    /**
     * @inheritDoc
     */
    KmlLinearRing.prototype.getTagNames = function () {
        return ['LinearRing'];
    };

    KmlElements.addKey(KmlLinearRing.prototype.getTagNames()[0], KmlLinearRing);

    return KmlLinearRing;
});