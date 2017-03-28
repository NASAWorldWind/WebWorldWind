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
    var WKTPoint = function (shapeConfigurationCallback, layer) {
        WKTObject.call(this, WKTType.SupportedGeometries.POINT);

        this.shapeConfigurationCallback = shapeConfigurationCallback;

        this.layer = layer;
    };

    WKTPoint.prototype = Object.create(WKTObject.prototype);

    /**
     * It returns either Position or Location representing this shape. Mainly to use in other processing.
     * @return {Position|Location}
     */
    WKTPoint.prototype.shape = function () {
        var placemark = new Placemark(this.coordinates, false, new PlacemarkAttributes);

        this.shapeConfigurationCallback(placemark);

        return placemark;
    };

    return WKTPoint;
});