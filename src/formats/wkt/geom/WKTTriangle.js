/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolygon',
    './WKTObject',
    '../WKTType'
], function (Polygon,
             ShapeAttributes,
             SurfacePolygon,
             WKTObject,
             WKTType) {
    /**
     * @augments WKTObject
     * @constructor
     */
    var WKTTriangle = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.TRIANGLE);

        this._renderable = null;
    };

    WKTTriangle.prototype = Object.create(WKTObject.prototype);

    /**
     * @inheritDoc
     */
    WKTTriangle.prototype.shapes = function () {
        if (this._is3d) {
            return [new Polygon(this.coordinates, new ShapeAttributes(null))];
        } else {
            return [new SurfacePolygon(this.coordinates, new ShapeAttributes(null))];
        }
    };

    return WKTTriangle;
});