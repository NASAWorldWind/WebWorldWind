define([], function() {
    var StyleAttributes = function() {

    };

    /**
     * Prepare default values for the placemark Attributes.
     * @param attributes
     * @returns {Object}
     */
    StyleAttributes.prototype.placemarkAttributes = function(attributes) {
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
    StyleAttributes.prototype.textAttributes = function(attributes) {
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
    StyleAttributes.prototype.shapeAttributes = function(attributes) {
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
});