/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSONGeometry
 */
define(['./GeoJSONConstants',
        './GeoJSONCRS'
    ],
    function (GeoJSONConstants,
              GeoJSONCRS) {
        "use strict";

        /**
         * Constructs a GeoJSON Geometry object. Applications typically do not call this constructor. It is called by
         * {@link GeoJSON} as GeoJSON is read.
         * @alias GeoJSONGeometry
         * @constructor
         * @classdesc A geometry is a GeoJSON object where the type member's value is one of the following strings:
         * "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", or "GeometryCollection".
         * A GeoJSON geometry object of any type other than "GeometryCollection" must have a member with the name "coordinates".
         * The value of the coordinates member is always an array. The structure for the elements in this array is determined by the type of geometry.
         * @param {Array} coordinates he array containing geometry coordinates.
         * @param {String} type A string containing type of geometry.
         * @param {Object} crs An object containing the value of GeoJSON crs member.
         * @throws {ArgumentError} If the specified mandatory coordinates or type are null or undefined.
         */
        var GeoJSONGeometry = function (coordinates, type, crs) {

            if (!coordinates) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometry", "constructor",
                        "missingCoordinates"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometry", "constructor",
                        "missingType"));
            }

            // Documented in defineProperties below.
            this._coordinates = coordinates;

            // Documented in defineProperties below.
            this._type =  type;

            // Documented in defineProperties below.
            this._crs = crs ? new GeoJSONCRS(crs[GeoJSONConstants.FIELD_TYPE], crs[GeoJSONConstants.FIELD_PROPERTIES]) : null;
        };

        Object.defineProperties(GeoJSONGeometry.prototype, {
            /**
             * The GeoJSON geometry coordinates as specified to this GeoJSONGeometry's constructor.
             * @memberof GeoJSONGeometry.prototype
             * @type {Array}
             * @readonly
             */
            coordinates: {
                get: function () {
                    return this._coordinates;
                }
            },
            /**
             * The GeoJSON crs object.
             * @memberof GeoJSONGeometry.prototype
             * @type {Object}
             * @readonly
             */
            crs: {
                get: function () {
                    return this._crs;
                }
            },
            /**
             * The GeoJSON geometry type as specified to this GeoJSONGeometry's constructor.
             * @memberof GeoJSONGeometry.prototype
             * @type {String}
             * @readonly
             */
            type: {
                get: function () {
                    return this._type;
                }
            }
        });

        /**
         * Indicates whether this GeoJSON geometry is
         * [GeoJSONConstants.TYPE_POINT]
         *
         * @return {Boolean} True if the geometry is a Point type.
         */
        GeoJSONGeometry.prototype.isPointType = function () {
            return (this.type === GeoJSONConstants.TYPE_POINT);
        };

        /**
         * Indicates whether this GeoJSON geometry is
         * [GeoJSONConstants.TYPE_MULTI_POINT]
         *
         * @return {Boolean} True if the geometry is a MultiPoint type.
         */
        GeoJSONGeometry.prototype.isMultiPointType = function () {
            return (this.type === GeoJSONConstants.TYPE_MULTI_POINT);
        };

        /**
         * Indicates whether this GeoJSON geometry is
         * [GeoJSONConstants.TYPE_LINE_STRING]
         *
         * @return {Boolean} True if the geometry is a LineString type.
         */
        GeoJSONGeometry.prototype.isLineStringType = function () {
            return (this.type === GeoJSONConstants.TYPE_LINE_STRING);
        };

        /**
         * Indicates whether this GeoJSON geometry is
         * [GeoJSONConstants.TYPE_MULTI_LINE_STRING]
         *
         * @return {Boolean} True if the geometry is a MultiLineString type.
         */
        GeoJSONGeometry.prototype.isMultiLineStringType = function () {
            return (this.type === GeoJSONConstants.TYPE_MULTI_LINE_STRING);
        };

        /**
         * Indicates whether this GeoJSON geometry is
         * [GeoJSONConstants.TYPE_POLYGON]
         *
         * @return {Boolean} True if the geometry is a Polygon type.
         */
        GeoJSONGeometry.prototype.isPolygonType = function () {
            return (this.type === GeoJSONConstants.TYPE_POLYGON);
        };

        /**
         * Indicates whether this GeoJSON geometry is
         * [GeoJSONConstants.TYPE_MULTI_POLYGON]
         *
         * @return {Boolean} True if the geometry is a MultiPolygon type.
         */
        GeoJSONGeometry.prototype.isMultiPolygonType = function () {
            return (this.type === GeoJSONConstants.TYPE_MULTI_POLYGON);
        };

        return GeoJSONGeometry;
    }
);