/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './WKTObject',
    '../WKTType'
], function (WKTObject,
             WKTType) {
    /**
     * This item can contain other geometries to be shown.
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
    WKTGeometryCollection.prototype.add = function(object) {
        this.objects.push(object);
    };

    WKTGeometryCollection.prototype.token = function() {

    };

    /**
     * @inheritDoc
     */
    WKTGeometryCollection.prototype.shapes = function() {
        var shapes = [];

        this.objects.forEach(function(associatedShapes){
            associatedShapes.shapes().forEach(function(shape){
                shapes.push(shape);
            });
        });

        return shapes;
    };

    return WKTGeometryCollection;
});