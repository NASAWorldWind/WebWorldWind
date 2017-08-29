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
     * It represents the polygon.
     * @alias WktPolygon
     * @augments WktObject
     * @constructor
     */
    var WktPolygon = function () {
        WktObject.call(this, WktType.SupportedGeometries.POLYGON);

        this._renderable = null;
    };

    WktPolygon.prototype = Object.create(WktObject.prototype);

    /**
     * @inheritDoc
     */
    WktPolygon.prototype.commaWithoutCoordinates = function() {
        this.outerBoundaries = this.coordinates.slice();
        this.coordinates = [];
    };

    /**
     * It returns SurfacePolygon for 2D. It returns Polygon for 3D.
     * @inheritDoc
     * @return {Polygon[]|SurfacePolyline[]}
     */
    WktPolygon.prototype.shapes = function () {
        if (this._is3d) {
            if(this.outerBoundaries) {
                return [new Polygon([this.outerBoundaries, this.coordinates], new ShapeAttributes(null))];
            } else {
                return [new Polygon(this.coordinates, new ShapeAttributes(null))];
            }
        } else {
            if(this.outerBoundaries) {
                return [new SurfacePolygon([this.outerBoundaries, this.coordinates], new ShapeAttributes(null))];
            } else {
                return [new SurfacePolygon(this.coordinates, new ShapeAttributes(null))];
            }
        }
    };

    WktElements['POLYGON'] = WktPolygon;

    return WktPolygon;
});