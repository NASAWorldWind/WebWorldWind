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
        this._balloonStyle = {};
        this._iconStyle = {};
        this._labelStyle = {};
        this._lineStyle = {};
        this._listStyle = {};
        this._polyStyle = {};
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
        this.balloonStyle.kmlBgColor = style.kmlBgColor || this.balloonStyle.kmlBgColor;
        this.balloonStyle.kmlTextColor = style.kmlTextColor || this.balloonStyle.kmlTextColor;
        this.balloonStyle.kmlText = style.kmlText || this.balloonStyle.kmlText;
        this.balloonStyle.kmlDisplayMode = style.kmlDisplayMode || this.balloonStyle.kmlDisplayMode;
    };

    Style.prototype.applyIconStyle = function(style){
        this.iconStyle.kmlScale = style.kmlScale || this.iconStyle.kmlScale;
        this.iconStyle.kmlHeading = style.kmlHeading || this.iconStyle.kmlHeading;
        this.iconStyle.kmlIcon = style.kmlIcon || this.iconStyle.kmlIcon;
        this.iconStyle.hotSpotX = style.hotSpotX || this.iconStyle.hotSpotX;
        this.iconStyle.hotSpotY = style.hotSpotY || this.iconStyle.hotSpotY;
        this.iconStyle.hotSpotXUnits = style.hotSpotXUnits || this.iconStyle.hotSpotXUnits;
        this.iconStyle.hotSpotYUnits = style.hotSpotYUnits || this.iconStyle.hotSpotYUnits;
    };

    Style.prototype.applyLabelStyle = function(style) {
        
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

    /**
     * Applies the retrieved polyStyle to the current version of the style.
     * @param polyStyle {KmlPolyStyle}
     */
    Style.prototype.applyPolyStyle = function(polyStyle) {
        this._shapeAttributes.drawInterior = polyStyle.kmlFill;
        this._shapeAttributes.drawOutline = polyStyle.kmlOutline;
    };

    return Style;
});