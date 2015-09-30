/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSONCRS
 */
define(['../../error/ArgumentError',
        './GeoJSONConstants',
        '../../util/Logger',
        '../../util/proj4-src'
    ],
    function (ArgumentError,
              GeoJSONConstants,
              Logger,
              Proj4){
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
         * For reprojecton is used Proj4js JavaScript library.
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

        /**
         * Indicates whether this CRS is the default GeoJSON one, respectively a geographic coordinate
         * reference system, using the WGS84 datum, and with longitude and latitude units of decimal degrees.
         *
         * @return {Boolean} True if the CRS is the default GeoJSON CRS
         */
        GeoJSONCRS.prototype.isDefault = function () {
            if (this.isNamed()){
                if (this._properties.name && (this._properties.name === GeoJSONConstants.EPSG4326_CRS ||
                    this._properties.name === GeoJSONConstants.WGS84_CRS))
                {
                    return true;
                }
            }
            //else if (this.isLinked()){
            //    //TODO Linked CRS
            //}
            return false;
        };

        /**
         * Indicates whether the type of this CRS object is named CRS.
         *
         * @return {Boolean} True if the type of CRS object is named CRS
         */
        GeoJSONCRS.prototype.isNamed = function () {
            return (this._type === GeoJSONConstants.FIELD_CRS_NAME);
        };

        /**
         * Indicates whether the type of this CRS object is linked CRS.
         *
         * @return {Boolean} True if the type of CRS object is linked CRS
         */
        GeoJSONCRS.prototype.isLinked = function () {
            return (this._type === GeoJSONConstants.FIELD_CRS_LINK);
        };

        /**
         * Indicates whether the CRS is supported by proj4js.
         *
         * @return {Boolean} True if the CRS is supported by proj4js
         */
        GeoJSONCRS.prototype.isCRSSupported = function () {
            var crsString;
            if (this.isNamed()){
                crsString = this._properties.name;
            }
            else if (this.isLinked()){
                //TODO Linked CRS
            }

            try{
                Proj4(crsString, GeoJSONConstants.EPSG4326_CRS);
            }
            catch(e){
                Logger.log(Logger.LEVEL_WARNING,
                    "Unknown GeoJSON coordinate reference system (" + e + "): " + this._properties.name);
                return false;
            }
            return true;
        };

        // Get GeoJSON Linked CRS string using XMLHttpRequest. Internal use only.
        GeoJSONCRS.prototype.getLinkedCRSString = function (url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'text';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.response);
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "GeoJSON Linked CRS retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoJSON Linked CRS retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoJSON Linked CRS retrieval timed out: " + url);
            };

            xhr.send(null);
        };

        return GeoJSONCRS;
    }
);