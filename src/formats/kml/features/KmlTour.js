/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlFeature'
], function (KmlElements,
             KmlFeature) {
    "use strict";

    /**
     * Constructs an KmlTour. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlTour
     * @classdesc Contains the data associated with Tour node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Tour.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxtour
     * @augments KmlFeature
     */
    var KmlTour = function (options) {
        KmlFeature.call(this, options);
    };

    KmlTour.prototype = Object.create(KmlFeature.prototype);

    /**
     * @inheritDoc
     */
    KmlTour.prototype.getTagNames = function () {
        return ['gx:Tour'];
    };

    KmlElements.addKey(KmlTour.prototype.getTagNames()[0], KmlTour);

    return KmlTour;
});