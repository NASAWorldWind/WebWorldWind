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
    var WKTMultiPolygon = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.MULTI_POLYGON);

        this.objectBoundaries = [];

        this._renderables = null;
    };

    WKTMultiPolygon.prototype = Object.create(WKTObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WKTMultiPolygon.prototype.commaWithoutCoordinates = function() {
        this.objectBoundaries.push(this.coordinates.slice());
        this.coordinates = [];
    };

    /**
     * @inheritDoc
     */
    WKTMultiPolygon.prototype.render = function(dc) {
        if(!this._renderables) {
            this.commaWithoutCoordinates();
            this._renderables = [];
            if(this._is3d){
                this.objectBoundaries.forEach(function(boundaries){
                    this._renderables.push(new Polygon(boundaries, this._defaultShapeAttributes));
                }.bind(this))
            } else {
                this.objectBoundaries.forEach(function(boundaries){
                    this._renderables.push(new SurfacePolygon(boundaries, this._defaultShapeAttributes));
                }.bind(this))
            }
        }

        this._renderables.forEach(function(renderable){
            renderable.render(dc);
        });
    };

    return WKTMultiPolygon;
});