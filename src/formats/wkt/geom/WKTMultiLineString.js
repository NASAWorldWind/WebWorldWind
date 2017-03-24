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
    var WKTMultiLineString = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.MULTI_LINE_STRING);

        this.objectBoundaries = [];

        this._renderables = null;
    };

    WKTMultiLineString.prototype = Object.create(WKTObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WKTMultiLineString.prototype.commaWithoutCoordinates = function() {
        this.objectBoundaries.push(this.coordinates.slice());
        this.coordinates = [];
    };

    /**
     * @inheritDoc
     */
    WKTMultiLineString.prototype.render = function(dc) {
        if(!this._renderables) {
            this.commaWithoutCoordinates();
            this._renderables = [];
            if(this._is3d){
                this.objectBoundaries.forEach(function(boundaries){
                    this._renderables.push(new Path(boundaries, this._defaultShapeAttributes));
                }.bind(this))
            } else {
                this.objectBoundaries.forEach(function(boundaries){
                    this._renderables.push(new SurfacePolyline(boundaries, this._defaultShapeAttributes));
                }.bind(this))
            }
        }

        this._renderables.forEach(function(renderable){
            renderable.render(dc);
        });
    };

    return WKTMultiLineString;
});