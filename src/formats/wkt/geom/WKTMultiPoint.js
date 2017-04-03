/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Placemark',
    '../../../shapes/PlacemarkAttributes',
    './WKTObject',
    '../WKTType'
], function (Placemark,
             PlacemarkAttributes,
             WKTObject,
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
     * @inheritDoc
     */
    WKTMultiPoint.prototype.shapes = function() {
        return this.coordinates.map(function(coordinate){
            return new Placemark(coordinate, false, new PlacemarkAttributes);
        }.bind(this));
    };

    return WKTMultiPoint;
});