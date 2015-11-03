/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlElements',
    './KmlFeature'
], function (
    extend,
    KmlElements,
    KmlFeature
) {
    "use strict";

    /**
     * Constructs an KmlTour. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlTour
     * @classdesc Contains the data associated with Tour node.
     * @param node {Node} Node representing tour in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxtour
     */
    var KmlTour = function(node) {
        KmlFeature.call(this, node);

        extend(this, KmlTour.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlTour.prototype.getTagNames = function() {
        return ['gx:Tour'];
    };

    KmlElements.addKey(KmlTour.prototype.getTagNames()[0], KmlTour);

    return KmlTour;
});