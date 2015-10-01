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
    };

    KmlTrack.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlTrack.prototype, {
        /**
         * Array of the tag names representing Kml track.
         * @memberof KmlTrack.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['gx:Track'];
            }
        }
    });

    KmlElements.addKey(KmlTrack.prototype.tagName[0], KmlTrack);

    return KmlTrack;
});