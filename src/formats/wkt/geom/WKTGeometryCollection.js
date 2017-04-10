/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../geom/Location',
    '../../../geom/Position',
    '../WKTElements',
    './WKTObject',
    '../WKTType'
], function (Location,
             Position,
             WKTElements,
             WKTObject,
             WKTType) {
    /**
     * This item can contain other geometries to be shown.
     * @augments WKTObject
     * @constructor
     */
    var WKTGeometryCollection = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.GEOMETRY_COLLECTION);

        this.objects = [];
    };

    WKTGeometryCollection.prototype = Object.create(WKTObject.prototype);

    /**
     * It takes an object and adds it among those, it will render
     * @param object
     */
    WKTGeometryCollection.prototype.add = function (object) {
        this.objects.push(object);
    };

    /**
     * In geometry collection the coordinates should belong to the currently parsed object.
     * Array containing latitude, longitude and potentially either altitude or LRS.
     * @inheritDoc
     */
    WKTGeometryCollection.prototype.addCoordinates = function (coordinates) {
        var object = this.objects[this.objects.length - 1];
        if (this._is3d) {
            object.coordinates.push(new Position(coordinates[0], coordinates[1], coordinates[2] || 0));
        } else {
            object.coordinates.push(new Location(coordinates[0], coordinates[1]));
        }
    };

    /**
     * It returns representation for all shapes in the GeometryCollection.
     * @inheritDoc
     * @return {Renderable[]}
     */
    WKTGeometryCollection.prototype.shapes = function () {
        var shapes = [];

        this.objects.forEach(function (associatedShapes) {
            associatedShapes.shapes().forEach(function (shape) {
                shapes.push(shape);
            });
        });

        return shapes;
    };

    WKTElements['GEOMETRYCOLLECTION'] = WKTGeometryCollection;

    return WKTGeometryCollection;
});