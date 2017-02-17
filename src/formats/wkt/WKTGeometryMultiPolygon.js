/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTGeometryMultiPolygon
 */
define(['../../error/ArgumentError',
        '../../util/Logger',
        './WKTGeometry'
    ],
    function (ArgumentError,
              Logger,
              WKTGeometry) {
        "use strict";

        /**
         * Constructs a WKT geometry for a MultiPolygon. Applications typically do not call this constructor.
         * It is called by {@link WKTParser} as WKT geometries are read.
         * @alias WKTGeometryMultiPolygon
         * @constructor
         * @classdesc Contains the data associated with a WKT MultiPolygon geometry.
         * @augments WKTGeometry
         * @param {Number[]} coordinates The array containing MultiPolygon coordinates.
         * @param {String} type A string containing type of geometry.
         * @param {Object} bbox An object containing WKT bbox information.
         * @throws {ArgumentError} If the specified coordinates or type are null or undefined or if the coordinates
         * parameter is not an array of Polygon coordinate arrays.
         */
        var WKTGeometryMultiPolygon = function (coordinates, type, bbox) {

            if (!coordinates) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryMultiPolygon", "constructor",
                        "missingCoordinates"));
            }

            if (Object.prototype.toString.call(coordinates[0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0][0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0][0][0]) !== '[object Number]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryPolygon", "constructor",
                        "invalidCoordinatesType"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryPolygon", "constructor",
                        "missingType"));
            }

            WKTGeometry.call(this, coordinates, type, bbox);
        };

        WKTGeometryMultiPolygon.prototype = Object.create(WKTGeometry.prototype);

        return WKTGeometryMultiPolygon;
    }
);
