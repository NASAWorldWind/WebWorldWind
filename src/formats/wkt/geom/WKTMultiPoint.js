/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Placemark',
    '../../../shapes/PlacemarkAttributes',
    '../WKTElements',
    './WKTObject',
    './WKTPoint',
    '../WKTType'
], function (Placemark,
             PlacemarkAttributes,
             WKTElements,
             WKTObject,
             WKTPoint,
             WKTType) {
    /**
     * It represents multiple points.
     * @alias WKTMultiPoint
     * @augments WKTObject
     * @constructor
     */
    var WKTMultiPoint = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.MULTI_POINT);
    };

    WKTMultiPoint.prototype = Object.create(WKTObject.prototype);

    /**
     * Specific for Multi objects as it depicts the boundaries.
     */
    WKTMultiPoint.prototype.commaWithoutCoordinates = function() {};

    /**
     * It returns Placemark for each point.
     * @inheritDoc
     * @return {Placemark[]}
     */
    WKTMultiPoint.prototype.shapes = function() {
        return this.coordinates.map(function(coordinate){
            return WKTPoint.placemark(coordinate);
        }.bind(this));
    };

    WKTElements['MULTIPOINT'] = WKTMultiPoint;

    return WKTMultiPoint;
});