/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlSubStyle'
], function (
    KmlSubStyle
) {
    "use strict";
    /**
     * Constructs an KmlColorStyle. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFiles are read. This object is abstract. Only its descendants are instantiating it.
     * @alias KmlColorStyle
     * @classdesc Contains the data associated with ColorStyle node
     * @param colorStyleNode Node representing ColorStyle from Kml document
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#colorstyle
     */
    var KmlColorStyle = function(colorStyleNode) {
        KmlSubStyle.call(this, colorStyleNode);
    };

    KmlColorStyle.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlColorStyle.prototype, {
        /**
         * Array of tag names representing Kml color style types.
         * @memberof KmlColorStyle.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['LineStyle','PolyStyle','IconStyle','LabelStyle'];
            }
        },

        /**
         * Color, which should be used. Shapes supporting colored styles must correctly apply the
         * color.
         * @memberof KmlColorStyle.prototype
         * @readonly
         * @type {String}
         */
        color: {
            get: function() {
                return this.retrieve({name: 'color'});
            }
        },

        /**
         * Either normal or random. Normal means applying of the color as stated. Random applies linear scale based on
         * the color. More on https://developers.google.com/kml/documentation/kmlreference#colorstyle
         * @memberof KmlColorStyle.prototype
         * @readonly
         * @type {String}
         */
        colorMode: {
            get: function() {
                return this.retrieve({name: 'colorMode'})
            }
        }
    });

    return KmlColorStyle;
});