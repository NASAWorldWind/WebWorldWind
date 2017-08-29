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
     * It represents multiple line string as one object.
     * @alias WktMultiLineString
     * @augments WktObject
     * @constructor
     */
    var WktMultiLineString = function () {
        WktObject.call(this, WktType.SupportedGeometries.MULTI_LINE_STRING);

        this.objectBoundaries = [];
    };

    WktMultiLineString.prototype = Object.create(WktObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WktMultiLineString.prototype.commaWithoutCoordinates = function() {
        this.objectBoundaries.push(this.coordinates.slice());
        this.coordinates = [];
    };

    /**
     * In case of 2D it returns SurfacePolyline, In case of 3D return Path.
     * @inheritDoc
     * @return {Path[]|SurfacePolyline[]}
     */
    WktMultiLineString.prototype.shapes = function() {
        this.commaWithoutCoordinates(); // This needs to be more careful and probably move to the stuff

        if(this._is3d){
            return this.objectBoundaries.map(function(boundaries){
                return new Path(boundaries, new ShapeAttributes(null));
            }.bind(this));
        } else {
            return this.objectBoundaries.map(function(boundaries){
                return new SurfacePolyline(boundaries, new ShapeAttributes(null));
            }.bind(this));
        }
    };

    WktElements['MULTILINESTRING'] = WktMultiLineString;

    return WktMultiLineString;
});