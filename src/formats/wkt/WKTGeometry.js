/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTGeometry
 */
define([
        '../../util/Logger',
        './WKTConstants'
    ],
    function (
        Logger,
        WKTConstants
    ) {
        "use strict";

        /**
         * Constructs a WKT Geometry object. Applications typically do not call this constructor. It is called by
         * {@link WKTParser} as WKT is read.
         * @alias WKTGeometry
         * @constructor
         * @classdesc A geometry is a WKT object where the type member's value is one of the following strings:
         * "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", or "GeometryCollection".
         * A WKT geometry object of any type other than "GeometryCollection" must have a member with the name
         * "coordinates". The value of the coordinates member is always an array.
         * The structure for the elements in this array is determined by the type of geometry.
         * @param {Number[]} coordinates An array containing geometry coordinates.
         * @param {String} type A string containing type of geometry.
         * @param {Object} bbox An array containing information on the coordinate range for geometries.
         * @throws {ArgumentError} If the specified mandatory coordinates or type are null or undefined.
         */
        var WKTGeometry = function (coordinates, type, bbox) {

            if (!coordinates) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometry", "constructor",
                        "missingCoordinates"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometry", "constructor",
                        "missingType"));
            }

            // Documented in defineProperties below.
            this._coordinates = coordinates;

            // Documented in defineProperties below.
            this._type =  type;

            // Documented in defineProperties below.
            this._bbox = bbox ? bbox : null;
        };

        Object.defineProperties(WKTGeometry.prototype, {
            /**
             * The WKT geometry coordinates as specified to this WKTGeometry's constructor.
             * @memberof WKTGeometry.prototype
             * @type {Number[]}
             * @readonly
             */
            coordinates: {
                get: function () {
                    return this._coordinates;
                }
            },
            /**
             * The WKT geometry type as specified to this WKTGeometry's constructor.
             * @memberof WKTGeometry.prototype
             * @type {String}
             * @readonly
             */
            type: {
                get: function () {
                    return this._type;
                }
            },
            /**
             * The WKT bbox object as specified to this WKTGeometry's constructor.
             * @memberof WKTGeometry.prototype
             * @type {Object}
             * @readonly
             */
            bbox: {
                get: function () {
                    return this._bbox;
                }
            }
        });

        /**
         * Indicates whether this WKT geometry is
         * [WKTConstants.TYPE_POINT]
         *
         * @return {Boolean} True if the geometry is a Point type.
         */
        WKTGeometry.prototype.isPointType = function () {
            return (this.type === WKTConstants.TYPE_POINT);
        };

        /**
         * Indicates whether this WKT geometry is
         * [WKTConstants.TYPE_MULTI_POINT]
         *
         * @return {Boolean} True if the geometry is a MultiPoint type.
         */
        WKTGeometry.prototype.isMultiPointType = function () {
            return (this.type === WKTConstants.TYPE_MULTI_POINT);
        };

        /**
         * Indicates whether this WKT geometry is
         * [WKTConstants.TYPE_LINE_STRING]
         *
         * @return {Boolean} True if the geometry is a LineString type.
         */
        WKTGeometry.prototype.isLineStringType = function () {
            return (this.type === WKTConstants.TYPE_LINE_STRING);
        };

        /**
         * Indicates whether this WKT geometry is
         * [WKTConstants.TYPE_MULTI_LINE_STRING]
         *
         * @return {Boolean} True if the geometry is a MultiLineString type.
         */
        WKTGeometry.prototype.isMultiLineStringType = function () {
            return (this.type === WKTConstants.TYPE_MULTI_LINE_STRING);
        };

        /**
         * Indicates whether this WKT geometry is
         * [WKTConstants.TYPE_POLYGON]
         *
         * @return {Boolean} True if the geometry is a Polygon type.
         */
        WKTGeometry.prototype.isPolygonType = function () {
            return (this.type === WKTConstants.TYPE_POLYGON);
        };

        /**
         * Indicates whether this WKT geometry is
         * [WKTConstants.TYPE_MULTI_POLYGON]
         *
         * @return {Boolean} True if the geometry is a MultiPolygon type.
         */
        WKTGeometry.prototype.isMultiPolygonType = function () {
            return (this.type === WKTConstants.TYPE_MULTI_POLYGON);
        };

        return WKTGeometry;
    }
);