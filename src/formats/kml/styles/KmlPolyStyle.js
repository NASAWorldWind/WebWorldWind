/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/Color',
    '../../../util/extend',
    './KmlColorStyle',
    './../KmlElements',
    '../../../util/WWUtil'
], function (
    Color,
    extend,
    KmlColorStyle,
    KmlElements,
    WWUtil
) {
    "use strict";

    /**
     * Constructs an KmlPolyStyle. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias KmlPolyStyle
     * @constructor
     * @classdesc Contains the data associated with Kml poly style
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml poly style.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#polystyle
     * @augments KmlColorStyle
     */
    var KmlPolyStyle = function (options) {
        KmlColorStyle.call(this, options);

        Object.defineProperties(this, {
            /**
             * If true the polygon's surface will be filled with color
             * @memberof KmlPolyStyle.prototype
             * @readonly
             * @type {Boolean}
             */
            kmlFill: {
                get: function(){
                    return this.retrieve({name: 'fill', transformer: WWUtil.transformToBoolean});
                }
            },

            /**
             * Specifies whether outline polygon. Outline style is defined by line style if present.
             * @memberof KmlPolyStyle.prototype
             * @readonly
             * @type {Boolean}
             */
            kmlOutline: {
                get: function(){
                    return this.retrieve({name: 'outline', transformer: WWUtil.transformToBoolean});
                }
            }
        });

        extend(this, KmlPolyStyle.prototype);
    };

    KmlPolyStyle.update = function (style, options) {
        style = style || {};
        var shapeOptions = options || {};
        shapeOptions._drawInterior = style.kmlFill || true;
        shapeOptions._drawOutline = style.kmlOutline || false;
        shapeOptions._outlineColor = options._outlineColor || Color.WHITE;
        shapeOptions._interiorColor = style.kmlColor && Color.colorFromKmlHex(style.kmlColor) || Color.WHITE;
        shapeOptions._colorMode = style.kmlColorMode || 'normal'; // TODO Not yet supported.

        return shapeOptions;
    };

    /**
     * @inheritDoc
     */
    KmlPolyStyle.prototype.getTagNames = function () {
        return ['PolyStyle'];
    };

    KmlElements.addKey(KmlPolyStyle.prototype.getTagNames()[0], KmlPolyStyle);

    return KmlPolyStyle;
});