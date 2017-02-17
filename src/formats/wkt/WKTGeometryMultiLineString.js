/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTGeometryMultiLineString
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
         * Constructs a WKT geometry for a MultiLineString. Applications typically do not call this constructor.
         * It is called by {@link WKTParser} as WKT geometries are read.
         * @alias WKTGeometryMultiLineString
         * @constructor
         * @classdesc Contains the data associated with a WKT MultiLineString geometry.
         * @augments WKTGeometry
         * @param {Number[]} coordinates The array containing MultiLineString coordinates.
         * @param {String} type A string containing type of geometry.
         * @param {Object} bbox An object containing WKT bbox information.
         * @throws {ArgumentError} If the specified coordinates or type are null or undefined or if the coordinates
         * parameter is not an array of LineString coordinates array.
         */
        var WKTGeometryMultiLineString = function (coordinates, type, bbox) {

            if (!coordinates) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryMultiLineString", "constructor",
                        "missingCoordinates"));
            }

            if (coordinates[0].length < 2 || coordinates[0][0].length < 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryMultiLineString", "constructor",
                        "invalidNumberOfCoordinates"));
            }

            if (Object.prototype.toString.call(coordinates[0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0][0]) !== '[object Number]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryMultiLineString", "constructor",
                        "invalidCoordinatesType"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryLineString", "constructor",
                        "missingType"));
            }

            WKTGeometry.call(this, coordinates, type, bbox);
        };

        WKTGeometryMultiLineString.prototype = Object.create(WKTGeometry.prototype);

        return WKTGeometryMultiLineString;
    }
);
