/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlGeometry'
], function (
    KmlElements,
    KmlGeometry
) {
    "use strict";

    /**
     * Constructs an KmlMultiTrack. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlMultiTrack
     * @classdesc Contains the data associated with MultiTrack node.
     * @param node Node representing multi track in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxmultitrack
     */
    var KmlMultiTrack = function(node) {
        KmlGeometry.call(this, node);
    };

    KmlMultiTrack.prototype.getTagNames = function() {
        return ['gx:MultiTrack'];
    };

    KmlElements.addKey(KmlMultiTrack.prototype.getTagNames()[0], KmlMultiTrack);

    return KmlMultiTrack;
});