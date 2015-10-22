/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlElements',
    './KmlGeometry'
], function (
    extend,
    KmlElements,
    KmlGeometry
) {
    "use strict";

    /**
     * Constructs an KmlTrack. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlTrack
     * @classdesc Contains the data associated with Track node.
     * @param node Node representing track in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxtrack
     */
    var KmlTrack = function(node) {
        KmlGeometry.call(this, node);

        extend(this, KmlTrack.prototype);
    };

    KmlTrack.prototype.getTagNames = function() {
        return ['gx:Track'];
    };

    KmlElements.addKey(KmlTrack.prototype.getTagNames()[0], KmlTrack);

    return KmlTrack;
});