/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports GeoJSONGeometryCollection
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
         * Constructs a GeoJSON geometry for a GeometryCollection. Applications typically do not call this constructor.
         * It is called by {@link GeoJSON} as GeoJSON geometries are read.
         * @alias GeoJSONGeometryCollection
         * @constructor
         * @classdesc Contains the data associated with a GeoJSON GeometryCollection geometry.
         * A geometry collection must have a member with the name "geometries".
         * The value corresponding to "geometries" is an array. Each element in this array is a GeoJSON
         * geometry object. To include information on the coordinate range for features, a GeoJSON object may have a
         * member named "bbox".
         * @param {Object} geometries An array containing GeoJSONGeometry objects.
         * @param {Object} bbox An object containing the value of GeoJSON GeometryCollection bbox member.
         * @throws {ArgumentError} If the specified mandatory geometries is null or undefined or if the geometries
         * parameter is not an array of GeoJSONGeometry.
         */
        var GeoJSONGeometryCollection = function (geometries, bbox) {
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
            this._bbox = bbox;
        };

        Object.defineProperties(GeoJSONGeometryCollection.prototype, {
            /**
             * The GeoJSON GeometryCollection geometries as specified to this GeoJSON GeometryCollection's constructor.
             * @memberof GeoJSONGeometryCollection.prototype
             * @type {Object}
             * @readonly
             */
            geometries: {
                get: function () {
                    return this._geometries;
                }
            },

            /**
             * The GeoJSON GeometryCollection bbox member as specified to this GeoJSONGeometryCollection's constructor.
             * @memberof GeoJSONGeometryCollection.prototype
             * @type {Object}
             * @readonly
             */
            bbox: {
                get: function () {
                    return this._bbox;
                }
            }
        });

        return GeoJSONGeometryCollection;
    }
);