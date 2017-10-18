/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Path',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolyline',
    '../WktElements',
    './WktObject',
    '../WktType'
], function (Path,
             ShapeAttributes,
             SurfacePolyline,
             WktElements,
             WktObject,
             WktType) {
    /**
     * It represents WKT LineString.
     * @alias WktLineString
     * @augments WktObject
     * @constructor
     */
    var WktLineString = function () {
        WktObject.call(this, WktType.SupportedGeometries.LINE_STRING);
    };

    WktLineString.prototype = Object.create(WktObject.prototype);

    /**
     * In case of 2D return SurfacePolyline, in case of 3D returns Path.
     * @inheritDoc
     * @return {Path[]|SurfacePolyline[]}
     */
    WktLineString.prototype.shapes = function () {
        if (this._is3d) {
            return [new Path(this.coordinates, new ShapeAttributes(null))];
        } else {
            return [new SurfacePolyline(this.coordinates, new ShapeAttributes(null))];
        }
    };

    WktElements['LINESTRING'] = WktLineString;

    return WktLineString;
});