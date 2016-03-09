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
     * Constructs an KmlTrack. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlTrack
     * @classdesc Contains the data associated with Track node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Track.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxtrack
     * @augments KmlGeometry
     */
    var KmlTrack = function (options) {
        KmlGeometry.call(this, options);
    };

    KmlTrack.prototype = Object.create(KmlGeometry.prototype);

    /**
     * @inheritDoc
     */
    KmlTrack.prototype.getTagNames = function () {
        return ['gx:Track'];
    };

    KmlElements.addKey(KmlTrack.prototype.getTagNames()[0], KmlTrack);

    return KmlTrack;
});