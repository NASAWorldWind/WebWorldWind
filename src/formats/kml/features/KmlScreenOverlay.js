/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlOverlay'
], function (KmlElements,
             KmlOverlay) {
    "use strict";

    /**
     * Constructs an KmlScreenOverlay. Applications usually don't call this constructor. It is called by {@link
     * KmlFile} as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlScreenOverlay
     * @classdesc Contains the data associated with ScreenOverlay node.
     * @param node Node representing screen overlay in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#screenoverlay
     */
    var KmlScreenOverlay = function (node) {
        KmlOverlay.call(this, node);
    };

    KmlScreenOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlScreenOverlay.prototype, {
        /**
         * Array of the tag names representing Kml screen overlay.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function () {
                return ['ScreenOverlay'];
            }
        },

        /**
         * Indicates the angle of rotation of the parent object. A value of 0 means no rotation. The value is an angle
         * in degrees counterclockwise starting from north. Use ±180 to indicate the rotation of the parent object from
         * 0. The center of the <rotation>, if not (.5,.5), is specified in <rotationXY>.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {Array}
         */
        rotation: {
            get: function () {
                return this.retrieve({name: 'rotation', transformer: Number});
            }
        }
    });

    KmlElements.addKey(KmlScreenOverlay.prototype.tagName[0], KmlScreenOverlay);

    return KmlScreenOverlay;
});