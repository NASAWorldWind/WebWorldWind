/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlColorStyle',
    './../KmlElements',
    '../KmlIcon',
    '../util/NodeTransformers'
], function (KmlColorStyle,
             KmlElements,
             KmlIcon,
             NodeTransformers) {
    "use strict";
    /**
     * Constructs an KmlIconStyle. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlIconStyle
     * @classdesc Contains the data associated with IconStyle node
     * @param options {Object}
     * @param options.objectNode {Node} Node representing IconStyle in the document.
     * @returns {KmlIconStyle}
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined
     * @see https://developers.google.com/kml/documentation/kmlreference#iconstyle
     * @augments KmlColorStyle
     */
    var KmlIconStyle = function (options) {
        KmlColorStyle.call(this, options);
    };

    KmlIconStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlIconStyle.prototype, {
        /**
         * Scale in which to resize the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlScale: {
            get: function () {
                return this._factory.specific(this, {name: 'scale', transformer: NodeTransformers.number});
            }
        },

        /**
         * Direction in degrees of the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlHeading: {
            get: function () {
                return this._factory.specific(this, {name: 'heading', transformer: NodeTransformers.number});
            }
        },

        /**
         * Custom Icon. If the icon is part of the IconStyle, only href is allowed for the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {KmlIcon}
         */
        kmlIcon: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlIcon.prototype.getTagNames()
                });
            }
        },

        /**
         * Either the number of pixels, a fractional component of the icon, or a pixel inset indicating the x
         * component of a point on the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotX: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('x')});
            }
        },

        /**
         * Either the number of pixels, a fractional component of the icon, or a pixel inset indicating the y
         * component of a point on the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotY: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('y')});
            }
        },

        /**
         * Units in which the x value is specified. A value of fraction indicates the x value is a fraction of the
         * icon. A value of pixels indicates the x value in pixels. A value of insetPixels indicates the indent from
         * the right edge of the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotXUnits: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('xunits')});
            }
        },

        /**
         * Units in which the y value is specified. A value of fraction indicates the y value is a fraction of the
         * icon. A value of pixels indicates the y value in pixels. A value of insetPixels indicates the indent from
         * the top edge of the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {String}
         */
        kmlHotSpotYUnits: {
            get: function () {
                return this._factory.specific(this, {name: 'hotSpot', transformer: NodeTransformers.attribute('yunits')});
            }
        }
    });

    KmlIconStyle.update = function(style, options) {
        style = style || {};
        var shapeOptions = options || {};

        shapeOptions._imageScale = style.kmlScale || 1;
        shapeOptions._imageSource = style.kmlIcon && style.kmlIcon.kmlHref || null;

        return shapeOptions;
    };

    /**
     * @inheritDoc
     */
    KmlIconStyle.prototype.getTagNames = function () {
        return ['IconStyle'];
    };

    KmlElements.addKey(KmlIconStyle.prototype.getTagNames()[0], KmlIconStyle);

    return KmlIconStyle;
});