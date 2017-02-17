/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTGeometryMultiPoint
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
         * Constructs a WKT geometry for a MultiPoint. Applications typically do not call this constructor.
         * It is called by {@link WKTParser} as WKT geometries are read.
         * @alias WKTGeometryMultiPoint
         * @constructor
         * @classdesc Contains the data associated with a WKT MultiPoint geometry.
         * @augments WKTGeometry
         * @param {Number[]} coordinates The array containing MultiPoint coordinates.
         * @param {String} type A string containing type of geometry.
         * @param {Object} bbox An object containing WKT bbox information.
         * @throws {ArgumentError} If the specified coordinates or type are null or undefined or if the coordinates
         * parameter is not an array of positions.
         */
        var WKTGeometryMultiPoint = function (coordinates, type, bbox) {

            if (!coordinates) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryMultiPoint", "constructor",
                        "missingCoordinates"));
            }

            if (coordinates[0].length < 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryMultiPoint", "constructor",
                        "invalidNumberOfCoordinates"));
            }

            if (Object.prototype.toString.call(coordinates[0]) !== '[object Array]' ||
                Object.prototype.toString.call(coordinates[0][0]) !== '[object Number]') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryMultiPoint", "constructor",
                        "invalidCoordinatesType"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKTGeometryPoint", "constructor",
                        "missingType"));
            }

            WKTGeometry.call(this, coordinates, type, bbox);
        };

        WKTGeometryMultiPoint.prototype = Object.create(WKTGeometry.prototype);

        return WKTGeometryMultiPoint;
    }
);
