/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Path',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolyline',
    './WKTObject',
    '../WKTType'
], function (Path,
             ShapeAttributes,
             SurfacePolyline,
             WKTObject,
             WKTType) {
    /**
     * @augments WKTObject
     * @constructor
     */
    var WKTLineString = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.LINE_STRING);
    };

    WKTLineString.prototype = Object.create(WKTObject.prototype);

    /**
     * @inheritDoc
     */
    WKTLineString.prototype.shapes = function () {
        if (this._is3d) {
            return [new Path(this.coordinates, new ShapeAttributes(null))];
        } else {
            return [new SurfacePolyline(this.coordinates, new ShapeAttributes(null))];
        }
    };

    return WKTLineString;
});