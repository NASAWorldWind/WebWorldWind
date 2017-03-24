/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTObject
 */
define([
    '../../../geom/Location',
    '../../../geom/Position',
    '../../../shapes/ShapeAttributes'
], function (Location,
             Position,
             ShapeAttributes) {
    /**
     * THis shouldn't be initiated from outside. It is only for internal use. Every other WKT Objects are themselves
     * WKTObject
     * @param type {String} Textual representation of the type of current object.
     * @constructor
     */
    var WKTObject = function (type) {
        /**
         * Type of this object.
         * @type {WKTType}
         */
        this.type = type;

        /**
         * It is possible for the WKT object to be displayed not in 2D but in 3D.
         * @type {Boolean}
         * @private
         */
        this._is3d = false;

        /**
         * It is possible for
         * @type {boolean}
         * @private
         */
        this._isLrs = false;

        /**
         *
         * @type {Position[]|Location[]}
         */
        this.coordinates = [];

        /**
         * The default attribtues that will be applied to all the shapes in the WKTObjects unless changed
         * TODO: Add meaningfull way to adapt them.
         * @protected
         * @type {ShapeAttributes}
         */
        this._defaultShapeAttributes = new ShapeAttributes(null);
    };

    /**
     * It sets the information that this object is actually represented in 3D
     */
    WKTObject.prototype.set3d = function () {
        this._is3d = true;
    };

    /**
     * It sets the information that the object contain information about LRS offset.
     */
    WKTObject.prototype.setLrs = function () {
        this._isLrs = true;
    };

    /**
     * Array containing latitude, longitude and potentially either altitude or LRS.
     * @coordinates {Number[]} Array containing longitude, latitude and potentially altitude of another point in the
     *  object.
     */
    WKTObject.prototype.addCoordinates = function (coordinates) {
        if (this._is3d) {
            this.coordinates.push(new Position(coordinates[0], coordinates[1], coordinates[2] || 0));
        } else {
            this.coordinates.push(new Location(coordinates[0], coordinates[1]));
        }
    };

    /**
     * It is possible to render any WKTObject. Default implementation does nothing. Specific objects have their own ways
     * of handling this, usually by creating some geometry objects and rendering them.
     * @param dc {DrawContext}
     */
    WKTObject.prototype.render = function(dc) {};

    return WKTObject;
});