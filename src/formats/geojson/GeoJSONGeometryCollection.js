/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSONGeometryCollection
 */
define([
        '../../error/ArgumentError',
        './GeoJSONConstants',
        '../../util/Logger'
    ],
    function(
    ArgumentError,
    GeoJSONConstants,
    Logger
){
    "use strict";

    /**
     * Constructs a GeoJSON geometry for a GeometryCollection. Applications typically do not call this constructor. It is called by
     * {@link GeoJSON} as GeoJSON geometries are read.
     * @alias GeoJSONGeometryCollection
     * @constructor
     * @classdesc Contains the data associated with a GeoJSON GeometryCollection geometry.
     * A geometry collection must have a member with the name "geometries".
     * The value corresponding to "geometries" is an array. Each element in this array is a GeoJSON geometry object.
     * @param {Array} geometries The array containing GeoJSONGeometry objects.
     * @param {Object} crs An object containing GeoJSON CRS information.
     * @throws {ArgumentError} If the specified mandatory geometries is null or undefined or if the geometries parameter is not an array of GeoJSONGeometry.
     */
     var GeoJSONGeometryCollection = function (geometries, crs) {
        if (!geometries) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryCollection", "constructor",
                    "missingGeometries"));
        }

        if (Object.prototype.toString.call(geometries) !== '[object Array]') {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryCollection", "constructor",
                    "invalidGeometries"));
        }

        // Documented in defineProperties below.
        this._geometries = geometries;

        // Documented in defineProperties below.
        this._crs = crs ? crs : null;
    };

    Object.defineProperties(GeoJSONGeometryCollection.prototype, {
        /**
         * The GeoJSON GeometryCollection geometries as specified to this GeoJSON GeometryCollection's constructor.
         * @memberof GeoJSONGeometryCollection.prototype
         * @type {Array}
         * @readonly
         */
        geometries: {
            get: function () {
                return this._geometries;
            }
        },
        /**
         * The GeoJSON GeometryCollection CRS as specified to this GeoJSON GeometryCollection's constructor.
         * @memberof GeoJSONGeometryCollection.prototype
         * @type {Object}
         * @readonly
         */
        crs: {
            get: function () {
                return this._crs;
            }
        }
    });

    return GeoJSONGeometryCollection;
});