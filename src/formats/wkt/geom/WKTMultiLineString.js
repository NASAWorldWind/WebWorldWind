/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Path',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolyline',
    '../WKTElements',
    './WKTObject',
    '../WKTType'
], function (Path,
             ShapeAttributes,
             SurfacePolyline,
             WKTElements,
             WKTObject,
             WKTType) {
    /**
     * @augments WKTObject
     * @constructor
     */
    var WKTMultiLineString = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.MULTI_LINE_STRING);

        this.objectBoundaries = [];
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
    WKTMultiLineString.prototype.shapes = function() {
        this.commaWithoutCoordinates(); // This needs to be more careful and probably move to the stuff

        if(this._is3d){
            return this.objectBoundaries.map(function(boundaries){
                return new Path(boundaries, new ShapeAttributes(null));
            }.bind(this))
        } else {
            return this.objectBoundaries.map(function(boundaries){
                return new SurfacePolyline(boundaries, new ShapeAttributes(null));
            }.bind(this))
        }
    };

    WKTElements['MULTILINESTRING'] = WKTMultiLineString;

    return WKTMultiLineString;
});