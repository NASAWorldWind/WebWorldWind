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
 * @exports GeoJSONGeometryLineString
 */
define(['../../error/ArgumentError',
        './GeoJSONGeometry',
        '../../util/Logger'
    ],
    function (ArgumentError,
              GeoJSONGeometry,
              Logger) {
        "use strict";

        /**
         * Constructs a GeoJSON geometry for a LineString. Applications typically do not call this constructor.
         * It is called by {@link GeoJSON} as GeoJSON geometries are read.
         * @alias GeoJSONGeometryLineString
         * @constructor
         * @classdesc Contains the data associated with a GeoJSON LineString geometry.
         * @augments GeoJSONGeometry
         * @param {Number[]} coordinates The array containing LineString coordinates.
         * @param {String} type A string containing type of geometry.
         * @param {Object} bbox An object containing GeoJSON bbox information.
         * @throws {ArgumentError} If the specified coordinates or type are null or undefined or if the coordinates
         * parameter is not an array of two or more positions.
         */
        var GeoJSONGeometryLineString = function (coordinates, type, bbox) {

            if (!coordinates) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryLineString", "constructor",
                        "missingCoordinates"));
            }

            if (coordinates.length < 2 || coordinates[0].length < 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryLineString", "constructor",
                        "invalidNumberOfCoordinates"));
            }

            if (Object.prototype.toString.call(coordinates[0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0]) !== '[object Number]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryLineString", "constructor",
                        "invalidCoordinatesType"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONGeometryLineString", "constructor",
                        "missingType"));
            }

            GeoJSONGeometry.call(this, coordinates, type, bbox);
        };

        GeoJSONGeometryLineString.prototype = Object.create(GeoJSONGeometry.prototype);

        return GeoJSONGeometryLineString;
    }
);
