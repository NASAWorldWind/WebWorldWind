/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlFeature',
    './../KmlIcon'
], function (extend,
             KmlFeature,
             KmlIcon) {
    "use strict";

    /**
     * Constructs an KmlOverlay. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlOverlay
     * @classdesc Contains the data associated with Overlay node.
     * @param node {Node} Node representing overlay in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#overlay
     */
    var KmlOverlay = function (node) {
        KmlFeature.call(this, node);

        Object.defineProperties(this, {
            /**
             * Color values are expressed in hexadecimal notation, including opacity (alpha) values. The order of
             * expression is alpha, blue, green, red (aabbggrr). The range of values for any one color is 0 to 255 (00
             * to ff). For opacity, 00 is fully transparent and ff is fully opaque. For example, if you want to apply a
             * blue color with
             * 50 percent opacity to an overlay, you would specify the following: &lt;color&gt;7fff0000&lt;/color&gt;
             * @memberof KmlOverlay.prototype
             * @readonly
             * @type {String}
             */
            kmlColor: {
                get: function() {
                    return this.retrieve({name: 'color'});
                }
            },

            /**
             * This element defines the stacking order for the images in overlapping overlays. Overlays with higher
             * &lt;drawOrder&gt; values are drawn on top of overlays with lower &lt;drawOrder&gt; values.
             * @memberof KmlOverlay.prototype
             * @readonly
             * @type {Number}
             */
            kmlDrawOrder: {
                get: function() {
                    return this.retrieve({name: 'drawOrder', transformer: Number});
                }
            },

            /**
             * Defines the image associated with the Overlay. The &lt;href&gt; element defines the location of the image to
             * be
             * used as the Overlay. This location can be either on a local file system or on a web server. If this
             * element is omitted or contains no &lt;href&gt;, a rectangle is drawn using the color and size defined by the
             * ground or screen overlay.
             * @memberof KmlOverlay.prototype
             * @readonly
             * @type {KmlIcon}
             */
            kmlIcon: {
                get: function(){
                    return this.createChildElement({
                        name: KmlIcon.prototype.getTagNames()
                    });
                }
            }
        });

        extend(this, KmlOverlay.prototype);
    };

    /**
     * Returns tag name of all descendants of this abstract node.
     * @returns {String[]}
     */
    KmlOverlay.prototype.getTagNames = function () {
        return ['PhotoOverlay', 'ScreenOverlay', 'GroundOverlay'];
    };

    return KmlOverlay;
});