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
    var WKTMultiPolygon = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.MULTI_POLYGON);

        this.objectBoundaries = [];
    };

    WKTMultiPolygon.prototype = Object.create(WKTObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WKTMultiPolygon.prototype.commaWithoutCoordinates = function () {
        this.objectBoundaries.push(this.coordinates.slice()); // In this case it can be an issue of inner outer boundary.
        this.coordinates = [];
    };

    /**
     * @inheritDoc
     */
    WKTMultiPolygon.prototype.shapes = function () {
        this.commaWithoutCoordinates();

        if (this._is3d) {
            return this.objectBoundaries.map(function (boundaries) {
                return new Polygon(boundaries, new ShapeAttributes(null));
            }.bind(this))
        } else {
            return this.objectBoundaries.map(function (boundaries) {
                return new SurfacePolygon(boundaries, new ShapeAttributes(null));
            }.bind(this))
        }
    };

    return WKTMultiPolygon;
});