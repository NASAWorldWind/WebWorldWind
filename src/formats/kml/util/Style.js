define([
    '../../../util/Color',
    '../../../util/Font',
    '../../../util/Offset',
    '../../../shapes/PlacemarkAttributes',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/TextAttributes'
], function(
    Color,
    Font,
    Offset,
    PlacemarkAttributes,
    ShapeAttributes,
    TextAttributes
) {
    /**
     * This object is used to apply all the styles applicable to current element. It remains stable unless NetworkLink
     * or Region
     * @constructor
     */
    var Style = function() {
        this._balloonStyle = null;
        this._iconStyle = null;
        this._labelStyle = null;
        this._lineStyle = null;
        this._listStyle = null;
        this._polyStyle = null;
    };

    Object.defineProperties(Style.prototype, {
        balloonStyle: {
            get: function() {
                return this._balloonStyle;
            }
        },

        iconStyle: {
            get: function() {
                return this._iconStyle;
            }
        },

        labelStyle: {
            get: function() {
                return this._labelStyle;
            }
        },

        lineStyle: {
            get: function() {
                return this._lineStyle;
            }
        },

        listStyle: {
            get: function() {
                return this._listStyle;
            }
        },

        polyStyle: {
            get: function() {
                return this._polyStyle;
            }
        }
    });

    /**
     * It applies the KmlStyle element to current status of the attributes;
     * @param styleElement {KmlStyle}
     */
    Style.prototype.apply = function(styleElement) {
        if(styleElement.kmlBalloonStyle) {
            this.applyBalloonStyle(styleElement.kmlBalloonStyle);
        }
        if(styleElement.kmlIconStyle) {
            this.applyIconStyle(styleElement.kmlIconStyle);
        }
        if(styleElement.kmlLabelStyle) {
            this.applyLabelStyle(styleElement.kmlLabelStyle);
        }
        if(styleElement.kmlLineStyle) {
            this.applyLineStyle(styleElement.kmlLineStyle);
        }
        if(styleElement.kmlListStyle) {
            this.applyListStyle(styleElement.kmlListStyle);
        }
        if(styleElement.kmlPolyStyle) {
            this.applyPolyStyle(styleElement.kmlPolyStyle);
        }
    };

    Style.prototype.applyBalloonStyle = function(style) {
        // TODO: To be implemented later.
    };

    Style.prototype.applyIconStyle = function(style){
        // TODO: To be implemented later.
    };

    Style.prototype.applyLabelStyle = function(style) {
        // So far it seems, that it doesn't do anything.
    };

    /**
     * So far it seems that we support only these attributes. color, outerColor and width.
     * @param style {KmlLineStyle} Style applied to the shape attributes.
     */
    Style.prototype.applyLineStyle = function(style) {
        this._shapeAttributes.interiorColor = style.kmlColor;
        this._shapeAttributes.outlineColor =  style.kmlOuterColor;
        this._shapeAttributes.outlineWidth = style.kmlWidth;
    };

    Style.prototype.applyListStyle = function(style) {
        // TODO: To be implemented later.
    };

    Style.prototype.applyPolyStyle = function(polyStyle) {

    };

    /**
     * Prepare default values for the placemark Attributes.
     * @param attributes
     * @returns {Object}
     */
    Style.prototype.placemarkAttributes = function(attributes) {
        attributes = attributes || {};
        // These are all documented with their property accessors below.
        attributes._imageColor = attributes._imageColor || new Color(1, 1, 1, 1);
        attributes._imageOffset = attributes._imageOffset||
            new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
        attributes._imageScale = attributes._imageScale || 1;
        attributes._imageSource = attributes._imageSource || null;
        attributes._depthTest = attributes._depthTest || true;
        attributes._drawLeaderLine = attributes._drawLeaderLine || false;

        return attributes;
    };

    /**
     * Prepare default values for text attributes
     * @param attributes
     * @returns {Object}
     */
    Style.prototype.textAttributes = function(attributes) {
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
    Style.prototype.shapeAttributes = function(attributes) {
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



    return Style;
});