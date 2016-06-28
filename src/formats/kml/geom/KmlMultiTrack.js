/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlGeometry'
], function (KmlElements,
             KmlGeometry) {
    "use strict";

    /**
     * Constructs an KmlMultiTrack. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlMultiTrack
     * @classdesc Contains the data associated with MultiTrack node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing MultiTrack.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxmultitrack
     * @augments KmlGeometry
     */
    var KmlMultiTrack = function (options) {
        KmlGeometry.call(this, options);
    };

    KmlMultiTrack.prototype = Object.create(KmlGeometry.prototype);

    /**
     * @inheritDoc
     */
    KmlMultiTrack.prototype.getTagNames = function () {
        return ['gx:MultiTrack'];
    };

    KmlElements.addKey(KmlMultiTrack.prototype.getTagNames()[0], KmlMultiTrack);

    return KmlMultiTrack;
});