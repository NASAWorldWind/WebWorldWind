/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTObject
 */
define([
    '../../../geom/Location',
    '../../../geom/Position'
], function (Location,
             Position) {
    /**
     * THis shouldn't be initiated from outside. It is only for internal use. Every other WKT Objects are themselves
     * WKTObject
     * @param type {String} Textual representation of the type of current object.
     * @param shapeConfigurationCallback {Function} Function which is called whenever any shape is created.
     * @param layer {Layer} Layer which should be used for adding of all renderables.
     * @constructor
     */
    var WKTObject = function (type, shapeConfigurationCallback, layer) {
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
         * Callback which is called any time the shape is created but before adding it to the layer.
         * @type {Function}
         */
        this.shapeConfigurationCallback = shapeConfigurationCallback;

        /**
         *
         * @type {Layer}
         */
        this.layer = layer;
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
     * It returns either array of shapes representing the current object.
     * Every subclass must overwrite this method. This is actually an abstract method even though JS doesn't allow me to
     * do that.
     * @protected
     * @return {Renderable[]} Renderable or array of renderables representing current WKTObject.
     */
    WKTObject.prototype._shapes = function() {
        throw new Error("It must be implemented by all subclasses.");
    };

    /**
     * It is used to retrieve and create the shape or shapes associated.
     * @returns {Renderable[]} Array of renderables associated with given shape.
     */
    WKTObject.prototype.shapes = function() {
        var self = this;
        var shapes = this._shapes();
        shapes.forEach(function(shape){
            self.shapeConfigurationCallback(shape);
        });

        this.layer.addRenderables(shapes);

        return shapes;
    };

    return WKTObject;
});