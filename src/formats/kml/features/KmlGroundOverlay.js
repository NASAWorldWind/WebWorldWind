/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlLatLonBox',
    '../KmlLatLonQuad',
    './KmlOverlay'
], function (
    KmlElements,
    KmlLatLonBox,
    KmlLatLonQuad,
    KmlOverlay
) {
    "use strict";

    /**
     * Constructs an KmlGroundOverlay. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlGroundOverlay
     * @classdesc Contains the data associated with GroundOverlay node.
     * @param node Node representing ground overlay in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#groundoverlay
     */
    var KmlGroundOverlay = function(node) {
        KmlOverlay.call(this, node);
    };

    KmlGroundOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlGroundOverlay.prototype, {
        /**
         * Array of the tag names representing Kml ground overlay.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['GroundOverlay'];
            }
        },

        /**
         * Specifies the distance above the earth's surface, in meters, and is interpreted according to the altitude
         * mode.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {String}
         */
        altitude: {
            get: function() {
                return this.retrieve({name: 'altitude'});
            }
        },

        /**
         * Specifies how the <altitude>is interpreted.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {Array}
         */
        altitudeMode: {
            get: function() {
                return this.retrieve({name: 'altitudeMode'});
            }
        },

        /**
         * Specifies where the top, bottom, right, and left sides of a bounding box for the ground overlay are aligned.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {Array}
         */
        LatLonBox: {
            get: function() {
                return this.createChildElement({
                    name: KmlLatLonBox.prototype.tagName
                });
            }
        },

        /**
         * Used for nonrectangular quadrilateral ground overlays.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {Array}
         */
        LatLonQuad: {
            get: function() {
                return this.createChildElement({
                    name: KmlLatLonQuad.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(KmlGroundOverlay.prototype.tagName[0], KmlGroundOverlay);

    return KmlGroundOverlay;
});