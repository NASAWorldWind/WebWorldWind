/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSONFeatureCollection
 */

define([
    '../../error/ArgumentError',
    './GeoJSONConstants',
    './GeoJSONCRS',
    '../../util/Logger'
], function(
    ArgumentError,
    GeoJSONConstants,
    GeoJSONCRS,
    Logger
){
    "use strict";

    /**
     * Constructs a GeoJSON FeatureCollection object. Applications typically do not call this constructor. It is called by
     * {@link GeoJSON} as GeoJSON is read.
     * @alias GeoJSONFeatureCollection
     * @constructor
     * @classdesc Contains the data associated with a GeoJSON Feature Collection Object.
     * An object of type "FeatureCollection" must have a member with the name "features".
     * The value corresponding to "features" is an array. Each element in the array is a feature object as defined in {@link GeoJSONFeature}.
     * @param {Array} features An array containing the data associated with the GeoJSON FeatureCollection features.
     * @param {Object} crs An object containing the value of GeoJSON FeatureCollection crs member.
     * @throws {ArgumentError} If the specified mandatory features parameter is null or undefined.
     */
    var GeoJSONFeatureCollection = function (features, crs) {

        if (!features) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeatureCollection", "constructor",
                    "missingFeatures"));
        }

        if (Object.prototype.toString.call(features) !== '[object Array]') {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeatureCollection", "constructor", "invalidFeatures"));
        }

        // Documented in defineProperties below.
        this._features = features;

        // Documented in defineProperties below.
        this._crs = crs ? new GeoJSONCRS(crs[GeoJSONConstants.FIELD_TYPE], crs[GeoJSONConstants.FIELD_PROPERTIES]) : null;
    };

    Object.defineProperties(GeoJSONFeatureCollection.prototype, {
        /**
         * The GeoJSON Feature Collection features as specified to this GeoJSONFeatureCollection's constructor.
         * @memberof GeoJSONFeatureCollection.prototype
         * @type {Array}
         * @readonly
         */
        features: {
            get: function () {
                return this._features;
            }
        },
        /**
         * The GeoJSON Feature Collection crs object.
         * @memberof GeoJSONFeatureCollection.prototype
         * @type {GeoJSONCRS}
         * @readonly
         */
        crs: {
            get: function () {
                return this._crs;
            }
        }
    });

    return GeoJSONFeatureCollection;
});
