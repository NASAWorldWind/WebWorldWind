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
         * @type {Number}
         */
        rotation: {
            get: function () {
                return this.retrieve({name: 'rotation', transformer: Number});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the image, or a pixel inset indicating the x
         * component of a point on the overlay image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        overlayXYx: {
            get: function () {
                return this.retrieveAttribute({name: 'overlayXY', attributeName: 'x'});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the image, or a pixel inset indicating the y
         * component of a point on the overlay image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        overlayXYy: {
            get: function () {
                return this.retrieveAttribute({name: 'overlayXY', attributeName: 'y'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of the
         * image. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the indent
         * from the right edge of the image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        overlayXYxunits: {
            get: function () {
                return this.retrieveAttribute({name: 'overlayXY', attributeName: 'xunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of "fraction" indicates the y value is a fraction of the
         * image. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the indent
         * from the top edge of the image.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        overlayXYyunits: {
            get: function () {
                return this.retrieveAttribute({name: 'overlayXY', attributeName: 'yunits'});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the screen, or a pixel inset indicating the x
         * component of a point on the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        screenXYx: {
            get: function () {
                return this.retrieveAttribute({name: 'screenXY', attributeName: 'x'});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the screen, or a pixel inset indicating the y
         * component of a point on the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        screenXYy: {
            get: function () {
                return this.retrieveAttribute({name: 'screenXY', attributeName: 'y'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of the
         * screen. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the indent
         * from the right edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        screenXYxunits: {
            get: function () {
                return this.retrieveAttribute({name: 'screenXY', attributeName: 'xunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * screen. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the indent
         * from the top edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        screenXYyunits: {
            get: function () {
                return this.retrieveAttribute({name: 'screenXY', attributeName: 'yunits'});
            }
        },

        /**
         *
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        rotationXYx: {
            get: function () {
                return this.retrieveAttribute({name: 'rotationXY', attributeName: 'x'});
            }
        },

        /**
         *
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        rotationXYy: {
            get: function () {
                return this.retrieveAttribute({name: 'rotationXY', attributeName: 'y'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of the
         * screen. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the indent
         * from the right edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        rotationXYxunits: {
            get: function () {
                return this.retrieveAttribute({name: 'rotationXY', attributeName: 'xunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * screen. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the indent
         * from the top edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        rotationXYyunits: {
            get: function () {
                return this.retrieveAttribute({name: 'rotationXY', attributeName: 'yunits'});
            }
        },

        /**
         * A value of ?1 indicates to use the native dimension
         * A value of 0 indicates to maintain the aspect ratio
         * A value of n sets the value of the dimension
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        sizex: {
            get: function () {
                return this.retrieveAttribute({name: 'size', attributeName: 'x'});
            }
        },

        /**
         * A value of ?1 indicates to use the native dimension
         * A value of 0 indicates to maintain the aspect ratio
         * A value of n sets the value of the dimension
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        sizey: {
            get: function () {
                return this.retrieveAttribute({name: 'size', attributeName: 'y'});
            }
        },

        /**
         * Units in which the x value is specified. A value of "fraction" indicates the x value is a fraction of the
         * screen. A value of "pixels" indicates the x value in pixels. A value of "insetPixels" indicates the indent
         * from the right edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        sizexunits: {
            get: function () {
                return this.retrieveAttribute({name: 'size', attributeName: 'xunits'});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * screen. A value of "pixels" indicates the y value in pixels. A value of "insetPixels" indicates the indent
         * from the top edge of the screen.
         * @memberof KmlScreenOverlay.prototype
         * @readonly
         * @type {String}
         */
        sizeyunits: {
            get: function () {
                return this.retrieveAttribute({name: 'size', attributeName: 'yunits'});
            }
        }
    });

    KmlElements.addKey(KmlScreenOverlay.prototype.tagName[0], KmlScreenOverlay);

    return KmlScreenOverlay;
});