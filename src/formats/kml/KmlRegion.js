/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlLatLonAltBox',
    './KmlLod',
    './KmlObject'
], function (KmlElements,
             KmlLatLonAltBox,
             KmlLod,
             KmlObject) {
    "use strict";

    /**
     * Constructs an KmlRegion. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlRegion
     * @classdesc Contains the data associated with Region node.
     * @param node Node representing region in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#region
     */
    var KmlRegion = function (node) {
        KmlObject.call(this, node);
    };

    KmlRegion.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlRegion.prototype, {
        /**
         * Array of the tag names representing Kml region.
         * @memberof KmlRegion.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function () {
                return ['Region'];
            }
        },

        /**
         * A bounding box that describes an area of interest defined by geographic coordinates and altitudes. Default
         * values and required fields are as follows:
         * @memberof KmlRegion.prototype
         * @readonly
         * @type {Array}
         */
        LatLonAltBox: {
            get: function () {
                return this.createChildElement({
                    name: KmlLatLonAltBox.prototype.tagName
                });
            }
        },

        /**
         * Lod is an abbreviation for Level of Detail. <Lod> describes the size of the projected region on the screen
         * that is required in order for the region to be considered "active." Also specifies the size of the pixel
         * ramp used for fading in (from transparent to opaque) and fading out (from opaque to transparent). See
         * diagram below for a visual representation of these parameters.
         * @memberof KmlRegion.prototype
         * @readonly
         * @type {Array}
         */
        Lod: {
            get: function () {
                return this.createChildElement({
                    name: KmlLod.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(KmlRegion.prototype.tagName[0], KmlRegion);

    return KmlRegion;
});