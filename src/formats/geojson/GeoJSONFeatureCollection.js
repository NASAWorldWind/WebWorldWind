/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSONFeatureCollection
 */
define(['../../error/ArgumentError',
        './GeoJSONConstants',
        '../../util/Logger'
    ],
    function (ArgumentError,
              GeoJSONConstants,
              Logger) {
        "use strict";

        /**
         * Constructs a GeoJSON FeatureCollection object. Applications typically do not call this constructor.
         * It is called by {@link GeoJSON} as GeoJSON is read.
         * @alias GeoJSONFeatureCollection
         * @constructor
         * @classdesc Contains the data associated with a GeoJSON Feature Collection Object.
         * An object of type "FeatureCollection" must have a member with the name "features".
         * The value corresponding to "features" is an array. Each element in the array is a feature object as
         * defined in {@link GeoJSONFeature}.
         * To include information on the coordinate range for feature collections, a GeoJSON object may have a member
         * named "bbox".
         * @param {Object} features An object containing the data associated with the GeoJSON FeatureCollection
         * features.
         * @param {Object} bbox An object containing the value of GeoJSON FeatureCollection bbox member.
         * @throws {ArgumentError} If the specified mandatory features parameter is null or undefined.
         */
        var GeoJSONFeatureCollection = function (features,  bbox) {

            if (!features) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeatureCollection", "constructor",
                        "missingFeatures"));
            }

            if (Object.prototype.toString.call(features) !== '[object Array]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONFeatureCollection", "constructor",
                        "invalidFeatures"));
            }

            // Documented in defineProperties below.
            this._features = features;

            // Documented in defineProperties below.
            this._bbox = bbox;
        };

        Object.defineProperties(GeoJSONFeatureCollection.prototype, {
            /**
             * The GeoJSON Feature Collection features as specified to this GeoJSONFeatureCollection's constructor.
             * @memberof GeoJSONFeatureCollection.prototype
             * @type {Object}
             * @readonly
             */
            features: {
                get: function () {
                    return this._features;
                }
            },
            /**
             * The GeoJSON Collection bbox member as specified to this GeoJSONFeatureCollection's constructor.
             * @memberof GeoJSONFeatureCollection.prototype
             * @type {Object}
             * @readonly
             */
            bbox: {
                get: function () {
                    return this._bbox;
                }
            }
        });

        return GeoJSONFeatureCollection;
    }
);
