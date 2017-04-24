/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolygon',
    '../WKTElements',
    './WKTObject',
    '../WKTType'
], function (Polygon,
             ShapeAttributes,
             SurfacePolygon,
             WKTElements,
             WKTObject,
             WKTType) {
    /**
     * It represents triangle.
     * @alias WKTTriangle
     * @augments WKTObject
     * @constructor
     */
    var WKTTriangle = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.TRIANGLE);

        this._renderable = null;
    };

    WKTTriangle.prototype = Object.create(WKTObject.prototype);

    /**
     * It returns SurfacePolygon for 2D. It returns Polygon for 3D. Triangle doesn't support inner boundaries.
     * @inheritDoc
     * @return {Polygon|SurfacePolyline}
     */
    WKTTriangle.prototype.shapes = function () {
        if (this._is3d) {
            return [new Polygon(this.coordinates, new ShapeAttributes(null))];
        } else {
            return [new SurfacePolygon(this.coordinates, new ShapeAttributes(null))];
        }
    };

    WKTElements['TRIANGLE'] = WKTTriangle;

    return WKTTriangle;
});