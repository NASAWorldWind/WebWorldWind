/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Placemark',
    '../../../shapes/PlacemarkAttributes',
    '../WktElements',
    './WktObject',
    '../WktType'
], function (Placemark,
             PlacemarkAttributes,
             WktElements,
             WktObject,
             WktType) {
    /**
     * It represents Point
     * @alias WktPoint
     * @augments WktObject
     * @constructor
     */
    var WktPoint = function () {
        WktObject.call(this, WktType.SupportedGeometries.POINT);
    };

    WktPoint.prototype = Object.create(WktObject.prototype);

    /**
     * It returns Placemark representing this point.
     * @return {Placemark[]}
     */
    WktPoint.prototype.shapes = function () {
        return [WktPoint.placemark(this.coordinates[0])];
    };

    /**
     * Default Placemark implementation for the Point and MultiPoint.
     * @param coordinates {Location|Position} Location or Position for the Placemark
     * @return {Placemark} Placemark to be displayed on the map.
     */
    WktPoint.placemark = function(coordinates) {
        var placemarkAttributes = new PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/castshadow-purple.png";

        var placemark = new Placemark(coordinates, true, placemarkAttributes);
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

        return placemark;
    };

    WktElements['POINT'] = WktPoint;

    return WktPoint;
});