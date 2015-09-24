/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSONCRS
 */
define(['../../error/ArgumentError',
        './GeoJSONConstants',
        '../../util/Logger'
    ],
    function (ArgumentError,
              GeoJSONConstants,
              Logger){
        "use strict";

        /**
         * Constructs a GeoJSON CRS object. Applications typically do not call this constructor. It is called by
         * {@link GeoJSONGeometry}, {@link GeoJSONGeometryCollection}, {@link GeoJSONFeature} or
         * {@link GeoJSONFeatureCollection}.
         * @alias GeoJSONCRS
         * @constructor
         * @classdesc Contains the data associated with a GeoJSON Coordinate Reference System object.
         * The coordinate reference system (CRS) of a GeoJSON object is determined by its "crs" member (referred to as
         * the CRS object below).
         * If an object has no crs member, then its parent or grandparent object's crs member may be acquired.
         * If no crs member can be so acquired, the default CRS shall apply to the GeoJSON object.
         * The default CRS is a geographic coordinate reference system, using the WGS84 datum, and with longitude and
         * latitude units of decimal degrees.
         * <p>
         * There are two types of CRS objects:
         * <ul>
         *     <li>Named CRS</li>
         *     <li>Linked CRS</li>
         * </ul>
         * In this implementation we consider only named CRS. In this case, the value of its "type" member must be
         * the string "name". The value of its "properties" member must be an object containing a "name" member.
         * The value of that "name" member must be a string identifying a coordinate reference system.
         * OGC CRS URNs such as "urn:ogc:def:crs:OGC:1.3:CRS84" shall be preferred over legacy identifiers
         * such as "EPSG:4326".
         * <p>
         * At the moment is implemented only "urn:ogc:def:crs:OGC:1.3:CRS84".
         * @param {String} type A string, indicating the type of CRS object.
         * @param {Object} properties An object containing the properties of CRS object.
         * @throws {ArgumentError} If the specified type or properties are null or undefined.
         */
        var GeoJSONCRS = function (type, properties) {
            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONCRS", "constructor",
                        "missingType"));
            }

            if (!properties) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONCRS", "constructor",
                        "missingProperties"));
            }

            // Documented in defineProperties below.
            this._type = type;

            // Documented in defineProperties below.
            this._properties = properties;
        };

        Object.defineProperties(GeoJSONCRS.prototype, {
            /**
             * The GeoJSON CRS object type as specified to this GeoJSON CRS's constructor.
             * @memberof GeoJSONCRS.prototype
             * @type {String}
             * @readonly
             */
            type: {
                get: function () {
                    return this._type;
                }
            },
            /**
             * The GeoJSON CRS object properties as specified to this GeoJSON CRS's constructor.
             * @memberof GeoJSONCRS.prototype
             * @type {Object}
             * @readonly
             */
            properties: {
                get: function () {
                    return this._properties;
                }
            }
        });

        return GeoJSONCRS;
    }
);