/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlFeature'
], function (
    KmlElements,
    KmlFeature
) {
    "use strict";

    /**
     * Constructs an KmlTour. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlTour
     * @classdesc Contains the data associated with Tour node.
     * @param node Node representing tour in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxtour
     */
    var KmlTour = function(node) {
        KmlFeature.call(this, node);
    };

    KmlTour.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlTour.prototype, {
        /**
         * Array of the tag names representing Kml tour.
         * @memberof KmlTour.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['gx:Tour'];
            }
        }
    });

    KmlElements.addKey(KmlTour.prototype.tagName[0], KmlTour);

    return KmlTour;
});