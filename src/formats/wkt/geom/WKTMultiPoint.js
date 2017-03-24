/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './WKTObject',
    '../WKTType'
], function (WKTObject,
             WKTType) {
    /**
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
     * It returns array of either Positions or Locations representing this shape. Mainly to use in other processing.
     * @return {Position[]|Location[]}
     */
    WKTMultiPoint.prototype.reference = function() {
        return this.coordinates;
    };

    return WKTMultiPoint;
});