/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Placemark',
    '../../../shapes/PlacemarkAttributes',
    '../WktElements',
    './WktObject',
    './WktPoint',
    '../WktType'
], function (Placemark,
             PlacemarkAttributes,
             WktElements,
             WktObject,
             WktPoint,
             WktType) {
    /**
     * It represents multiple points.
     * @alias WktMultiPoint
     * @augments WktObject
     * @constructor
     */
    var WktMultiPoint = function () {
        WktObject.call(this, WktType.SupportedGeometries.MULTI_POINT);
    };

    WktMultiPoint.prototype = Object.create(WktObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WktMultiPoint.prototype.commaWithoutCoordinates = function() {};

    /**
     * It returns Placemark for each point.
     * @inheritDoc
     * @return {Placemark[]}
     */
    WktMultiPoint.prototype.shapes = function() {
        return this.coordinates.map(function(coordinate){
            return WktPoint.placemark(coordinate);
        }.bind(this));
    };

    WktElements['MULTIPOINT'] = WktMultiPoint;

    return WktMultiPoint;
});