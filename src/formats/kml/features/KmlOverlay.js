/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlFeature',
    './../KmlIcon'
], function (
    KmlFeature,
    KmlIcon
) {
    "use strict";

    /**
     * Constructs an KmlOverlay. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlOverlay
     * @classdesc Contains the data associated with Overlay node.
     * @param node Node representing overlay in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#overlay
     */
    var KmlOverlay = function(node) {
        KmlFeature.call(this, node);
    };

    KmlOverlay.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlOverlay.prototype, {
        /**
         * Tag names for descendant of the Overlay.
         * @memberof KmlOverlay.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['PhotoOverlay', 'ScreenOverlay', 'GroundOverlay'];
            }
        },

        /**
         * Color values are expressed in hexadecimal notation, including opacity (alpha) values. The order of expression
         * is alpha, blue, green, red (aabbggrr). The range of values for any one color is 0 to 255 (00 to ff). For
         * opacity, 00 is fully transparent and ff is fully opaque. For example, if you want to apply a blue color with
         * 50 percent opacity to an overlay, you would specify the following: <color>7fff0000</color>
         * @memberof KmlOverlay.prototype
         * @readonly
         * @type {String}
         */
        color: {
            get: function() {
                return this.retrieve({name: 'color'});
            }
        },

        /**
         * This element defines the stacking order for the images in overlapping overlays. Overlays with higher
         * <drawOrder> values are drawn on top of overlays with lower <drawOrder> values.
         * @memberof KmlOverlay.prototype
         * @readonly
         * @type {Number}
         */
        drawOrder: {
            get: function() {
                return this.retrieve({name: 'drawOrder', transformer: Number});
            }
        },

        /**
         * Defines the image associated with the Overlay. The <href> element defines the location of the image to be
         * used as the Overlay. This location can be either on a local file system or on a web server. If this element
         * is omitted or contains no <href>, a rectangle is drawn using the color and size defined by the ground or
         * screen overlay.
         * @memberof KmlOverlay.prototype
         * @readonly
         * @type {KmlIcon}
         */
        Icon: {
            get: function(){
                return this.createChildElement({
                    name: KmlIcon.prototype.tagName
                });
            }
        }
    });

    return KmlOverlay;
});