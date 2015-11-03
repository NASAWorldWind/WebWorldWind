/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/Color',
    '../../../util/extend',
    './KmlColorStyle',
    './../KmlElements'
], function (Color,
             extend,
             KmlColorStyle,
             KmlElements) {
    "use strict";

    /**
     * Constructs an KmlLineStyle object.  Applications shouldn't use this constructor. It is used by
     * {@link KmlFile}. KmlLineStyle represents one line style.
     * @param lineStyleNode {Node} Node representing this line style.
     * @constructor
     * @alias KmlLineStyle
     * @classdesc Class representing LineStyle element of KmlFile
     * @see https://developers.google.com/kml/documentation/kmlreference#linestyle
     */
    var KmlLineStyle = function (lineStyleNode) {
        KmlColorStyle.call(this, lineStyleNode);

        Object.defineProperties(this, {
            /**
             * Width of the line in pixels.
             * @memberof KmlLineStyle.prototype
             * @readonly
             * @type {Number}
             */
            width: {
                get: function () {
                    return this.retrieve({name: 'width', transformer: Number});
                }
            },

            /**
             * Color applied to outer width. Ignored by Polygon and LinearRing.
             * @memberof KmlLineStyle.prototype
             * @readonly
             * @type {String}
             */
            outerColor: {
                get: function () {
                    return this.retrieve({name: 'gx:outerColor'});
                }
            },

            /**
             * Value between 0.0 and 1.0 specifies the proportion of the line used by outerColor. Only applies to line
             * setting width with physical width.
             * @memberof KmlLineStyle.prototype
             * @readonly
             * @type {Number}
             */
            outerWidth: {
                get: function () {
                    return this.retrieve({name: 'gx:outerWidth', transformer: Number});
                }
            },

            /**
             * Physical width of the line in meters.
             * @memberof KmlLineStyle.prototype
             * @readonly
             * @type {Number}
             */
            physicalWidth: {
                get: function () {
                    return this.retrieve({name: 'gx:physicalWidth', transformer: Number});
                }
            },

            /**
             * A boolean defining whether or not to display a text label on a LineString. A LineString's label is
             * contained in the <name> element that is a sibling of <LineString> (i.e. contained within the same
             * <Placemark> element).
             * @memberof KmlLineStyle.prototype
             * @readonly
             * @type {Boolean}
             */
            labelVisibility: {
                get: function () {
                    return this.retrieve({name: 'gx:labelVisibility'});
                }
            }
        });

        extend(this, KmlLineStyle.prototype);
    };

    KmlLineStyle.update = function (style, options) {
        var shapeOptions = options || {};
        style = style || {};

        shapeOptions._outlineColor = style.color && Color.colorFromHex(style.color) || Color.WHITE;
        shapeOptions._outlineWidth = style.width || 10.0;

        return shapeOptions;
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlLineStyle.prototype.getTagNames = function () {
        return ['LineStyle'];
    };

    KmlElements.addKey(KmlLineStyle.prototype.getTagNames()[0], KmlLineStyle);

    return KmlLineStyle;
});