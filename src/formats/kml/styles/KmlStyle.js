/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/Color',
    '../../../util/Font',
    './KmlStyleSelector',
    './../KmlElements',
    './KmlPolyStyle',
    './KmlIconStyle',
    './KmlLabelStyle',
    './KmlLineStyle',
    './KmlListStyle',
    './KmlBalloonStyle',
    '../../../util/Offset',
    '../../../util/Promise',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/TextAttributes'
], function (
    Color,
    Font,
    KmlStyleSelector,
    KmlElements,
    KmlPolyStyle,
    KmlIconStyle,
    KmlLabelStyle,
    KmlLineStyle,
    KmlListStyle,
    KmlBalloonStyle,
    Offset,
    Promise,
    ShapeAttributes,
    TextAttributes
) {
    "use strict";

    /**
     * Constructs an KmlStyle. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * Style can contain any amount of different styles. At most one from each of these styles.
     * Possible children styles: IconStyle, LabelStyle, LineStyle, PolyStyle, BalloonStyle
     * @alias KmlStyle
     * @constructor
     * @classdesc Contains the data associated with Kml style
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml style.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#style
     * @augments KmlStyleSelector
     */
    var KmlStyle = function (options) {
        KmlStyleSelector.call(this, options);
    };

    KmlStyle.prototype = Object.create(KmlStyleSelector.prototype);

    Object.defineProperties(KmlStyle.prototype, {
        /**
         * Style used for icons in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlIconStyle|null}
         */
        kmlIconStyle: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlIconStyle.prototype.getTagNames()
                });
            }
        },

        /**
         * Style used for labels in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlLabelStyle|null}
         */
        kmlLabelStyle: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlLabelStyle.prototype.getTagNames()
                });
            }
        },

        /**
         * Style used for line in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlLineStyle|null}
         */
        kmlLineStyle: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlLineStyle.prototype.getTagNames()
                });
            }
        },

        /**
         * Style used for polygon in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlPolyStyle|null}
         */
        kmlPolyStyle: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlPolyStyle.prototype.getTagNames()
                });
            }
        },

        /**
         * Style used for balloons in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlBalloonStyle|null}
         */
        kmlBalloonStyle: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlBalloonStyle.prototype.getTagNames()
                });
            }
        },

        /**
         * Style used for lists in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlListStyle|null}
         */
        kmlListStyle: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlListStyle.prototype.getTagNames()
                });
            }
        }
    });

    KmlStyle.prototype.generate = function(options) {
        options = options || {};
        var style = this || {};

        if(style.kmlIconStyle) {
            KmlIconStyle.update(style.kmlIconStyle, options);
        }
        if(style.kmlListStyle) {
            KmlListStyle.update(style.kmlListStyle, options);
        }
        if(style.kmlBalloonStyle) {
            KmlBalloonStyle.update(style.kmlBalloonStyle, options);
        }
        if(style.kmlLabelStyle) {
            KmlLabelStyle.update(style.kmlLabelStyle, options);
        }
        if(style.kmlPolyStyle) {
            KmlPolyStyle.update(style.kmlPolyStyle, options);
        }
        if(style.kmlLineStyle) {
            KmlLineStyle.update(style.kmlLineStyle, options);
        }

        return options;
    };

    /**
     * @inheritDoc
     */
    KmlStyle.prototype.getStyle = function() {
        var self = this;
        return new Promise(function(resolve){
            window.setTimeout(function(){
                resolve(self);
            }, 0);
        });
    };

    /**
     * @inheritDoc
     */
    KmlStyle.prototype.getTagNames = function () {
        return ['Style'];
    };

    KmlElements.addKey(KmlStyle.prototype.getTagNames()[0], KmlStyle);

    /**
     * Prepare default values for the placemark Attributes.
     * @param attributes
     * @returns {Object}
     */
    KmlStyle.placemarkAttributes = function(attributes) {
        attributes = attributes || {};
        // These are all documented with their property accessors below.
        attributes._imageColor = attributes._imageColor || new Color(1, 1, 1, 1);
        attributes._imageOffset = attributes._imageOffset||
            new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
        attributes._imageScale = attributes._imageScale || 1;
        attributes._imageSource = attributes._imageSource || null;
        attributes._depthTest = attributes._depthTest || true;
        attributes._labelAttributes = attributes._labelAttributes || new TextAttributes(KmlStyle.textAttributes());
        attributes._drawLeaderLine = attributes._drawLeaderLine || false;
        attributes._leaderLineAttributes = attributes._leaderLineAttributes || new ShapeAttributes(KmlStyle.shapeAttributes());

        return attributes;
    };

    /**
     * Prepare default values for text attributes
     * @param attributes
     * @returns {Object}
     */
    KmlStyle.textAttributes = function(attributes) {
        attributes = attributes || {};
        attributes._color = attributes._color || new Color(1, 1, 1, 1);
        attributes._font = attributes._font || new Font(14);
        attributes._offset = attributes._offset || new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.0);
        attributes._scale = attributes._scale || 1;
        attributes._depthTest = attributes._depthTest || false;

        return attributes;
    };

    /**
     * Prepare default values for shape attributes
     * @param attributes
     * @returns {*|{}}
     */
    KmlStyle.shapeAttributes = function(attributes) {
        attributes = attributes || {};
        // All these are documented with their property accessors below.
        attributes._drawInterior = attributes._drawInterior || true;
        attributes._drawOutline = attributes._drawOutline || true;
        attributes._enableLighting = attributes._enableLighting || false;
        attributes._interiorColor = attributes._interiorColor || Color.WHITE;
        attributes._outlineColor = attributes._outlineColor || Color.RED;
        attributes._outlineWidth = attributes._outlineWidth || 1.0;
        attributes._outlineStippleFactor = attributes._outlineStippleFactor || 0;
        attributes._outlineStipplePattern = attributes._outlineStipplePattern || 0xF0F0;
        attributes._imageSource = attributes._imageSource || null;
        attributes._depthTest = attributes._depthTest || true;
        attributes._drawVerticals = attributes._drawVerticals || false;
        attributes._applyLighting = attributes._applyLighting || false;

        return attributes;
    };

    return KmlStyle;
});