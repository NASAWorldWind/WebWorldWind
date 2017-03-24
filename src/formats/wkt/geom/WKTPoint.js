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
    var WKTPoint = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.POINT);
    };

    WKTPoint.prototype = Object.create(WKTObject.prototype);

    /**
     * It returns either Position or Location representing this shape. Mainly to use in other processing.
     * @return {Position|Location}
     */
    WKTPoint.prototype.reference = function() {
        return this.coordinates[0];
    };

    return WKTPoint;
});