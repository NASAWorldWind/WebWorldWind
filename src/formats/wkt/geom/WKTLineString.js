/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Path',
    '../../../shapes/SurfacePolyline',
    './WKTObject',
    '../WKTType'
], function (Path,
             SurfacePolyline,
             WKTObject,
             WKTType) {
    /**
     * @augments WKTObject
     * @constructor
     */
    var WKTLineString = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.LINE_STRING);

        this._renderable = null;
    };

    WKTLineString.prototype = Object.create(WKTObject.prototype);

    /**
     * @inheritDoc
     */
    WKTLineString.prototype.render = function (dc) {
        if (!this._renderable) {
            if (this._is3d) {
                this._renderable = new Path(this.coordinates, this._defaultShapeAttributes)
            } else {
                this._renderable = new SurfacePolyline(this.coordinates, this._defaultShapeAttributes);
            }
        }

        this._renderable.render(dc);
    };

    return WKTLineString;
});