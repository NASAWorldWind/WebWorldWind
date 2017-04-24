/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Placemark',
    '../../../shapes/PlacemarkAttributes',
    '../WKTElements',
    './WKTObject',
    '../WKTType'
], function (Placemark,
             PlacemarkAttributes,
             WKTElements,
             WKTObject,
             WKTType) {
    /**
     * It represents Point
     * @alias WKTPoint
     * @augments WKTObject
     * @constructor
     */
    var WKTPoint = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.POINT);
    };

    WKTPoint.prototype = Object.create(WKTObject.prototype);

    /**
     * It returns Placemark representing this point.
     * @return {Placemark[]}
     */
    WKTPoint.prototype.shapes = function () {
        return [new Placemark(this.coordinates[0], true, new PlacemarkAttributes(null))];
    };

    WKTElements['POINT'] = WKTPoint;

    return WKTPoint;
});