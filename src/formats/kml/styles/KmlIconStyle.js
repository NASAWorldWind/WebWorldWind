/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlColorStyle',
    './../KmlElements',
    '../KmlIcon'
], function (extend,
             KmlColorStyle,
             KmlElements,
             KmlIcon) {
    "use strict";
    /**
     * Constructs an KmlIconStyle. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlIconStyle
     * @classdesc Contains the data associated with IconStyle node
     * @param iconStyleNode {Node} Node representing IconStyle in the document.
     * @returns {KmlIconStyle}
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined
     * @see https://developers.google.com/kml/documentation/kmlreference#iconstyle
     */
    var KmlIconStyle = function (iconStyleNode) {
        KmlColorStyle.call(this, iconStyleNode);

        Object.defineProperties(this, {
            /**
             * Scale in which to resize the icon.
             * @memberof KmlIconStyle.prototype
             * @readonly
             * @type {Number}
             */
            kmlScale: {
                get: function () {
                    return this.retrieve({name: 'scale', transformer: Number});
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
                    return this.retrieve({name: 'heading', transformer: Number});
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
                    return this.createChildElement({
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
                    return this.retrieveAttribute({name: 'hotSpot', attributeName: 'x'});
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
                    return this.retrieveAttribute({name: 'hotSpot', attributeName: 'y'});
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
                    return this.retrieveAttribute({name: 'hotSpot', attributeName: 'xunits'});
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
                    return this.retrieveAttribute({name: 'hotSpot', attributeName: 'yunits'});
                }
            }
        });

        extend(this, KmlIconStyle);
    };

    KmlIconStyle.update = function(style, options) {
        style = style || {};
        var shapeOptions = options || {};

        shapeOptions._imageScale = style.kmlScale || 1;
        shapeOptions._imageSource = style.kmlIcon && style.kmlIcon.kmlHref || null;

        return shapeOptions;
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlIconStyle.prototype.getTagNames = function () {
        return ['IconStyle'];
    };

    KmlElements.addKey(KmlIconStyle.prototype.getTagNames()[0], KmlIconStyle);

    return KmlIconStyle;
});