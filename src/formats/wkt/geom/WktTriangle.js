/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolygon',
    '../WktElements',
    './WktObject',
    '../WktType'
], function (Polygon,
             ShapeAttributes,
             SurfacePolygon,
             WktElements,
             WktObject,
             WktType) {
    /**
     * It represents triangle.
     * @alias WktTriangle
     * @augments WktObject
     * @constructor
     */
    var WktTriangle = function () {
        WktObject.call(this, WktType.SupportedGeometries.TRIANGLE);

        this._renderable = null;
    };

    WktTriangle.prototype = Object.create(WktObject.prototype);

    /**
     * It returns SurfacePolygon for 2D. It returns Polygon for 3D. Triangle doesn't support inner boundaries.
     * @inheritDoc
     * @return {Polygon|SurfacePolyline}
     */
    WktTriangle.prototype.shapes = function () {
        if (this._is3d) {
            return [new Polygon(this.coordinates, new ShapeAttributes(null))];
        } else {
            return [new SurfacePolygon(this.coordinates, new ShapeAttributes(null))];
        }
    };

    WktElements['TRIANGLE'] = WktTriangle;

    return WktTriangle;
});