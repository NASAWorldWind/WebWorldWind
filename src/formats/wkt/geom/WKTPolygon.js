/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Polygon',
    '../../../shapes/SurfacePolygon',
    './WKTObject',
    '../WKTType'
], function (Polygon,
             SurfacePolygon,
             WKTObject,
             WKTType) {
    /**
     * @augments WKTObject
     * @constructor
     */
    var WKTPolygon = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.POLYGON);

        this._renderable = null;
    };

    WKTPolygon.prototype = Object.create(WKTObject.prototype);

    /**
     * @inheritDoc
     */
    WKTPolygon.prototype.render = function (dc) {
        if (!this._renderable) {
            if (this._is3d) {
                this._renderable = new Polygon(this.coordinates, this._defaultShapeAttributes);
            } else {
                this._renderable = new SurfacePolygon(this.coordinates, this._defaultShapeAttributes);
            }
        }

        this._renderable.render(dc);
    };

    return WKTPolygon;
});