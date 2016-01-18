/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoTiffMetadata
 */
define([
    ],
    function () {
        "use strict";

        /**
         * Provides GeoTIFF metadata.
         * @alias GeoTiffMetadata
         * @constructor
         * @classdesc Contains all of the TIFF and GeoTIFF metadata for a geotiff image file.
         */
        var GeoTiffMetadata = function () {
            // Documented in defineProperties below.
            this._tiff = {};

            // Documented in defineProperties below.
            this._geotiff = { geoKeys:{}, bbox: {} };
        };

        Object.defineProperties(GeoTiffMetadata.prototype, {

            /**
             * The tiff specific metadata.
             * @memberof GeoTiffMetadata.prototype
             * @type {Object}
             */
            tiff: {
                get: function () {
                    return this._tiff;
                },

                set: function(value){
                    this._tiff = value;
                }
            },

            /**
             * The geotiff specific metadata.
             * @memberof GeoTiffMetadata.prototype
             * @type {Object}
             */
            geotiff: {
                get: function () {
                    return this._geotiff;
                },

                set: function(value){
                    this._geotiff = value;
                }
            }
        });

        return GeoTiffMetadata;
    }
);