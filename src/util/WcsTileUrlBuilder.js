/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WcsTileUrlBuilder
 */
define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs a WCS tile URL builder.
         * @alias WcsTileUrlBuilder
         * @constructor
         * @classdesc Provides a factory to create URLs for WCS Get Coverage requests.
         * @param {String} serviceAddress The address of the WCS server.
         * @param {String} coverageName The name of the coverage to retrieve.
         * @param {String} wcsVersion The version of the WCS server. May be null, in which case version 1.0.0 is
         * assumed.
         * @constructor
         */
        var WcsTileUrlBuilder = function (serviceAddress, coverageName, wcsVersion) {
            if (!serviceAddress || (serviceAddress.length === 0)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsTileUrlBuilder", "constructor",
                        "The WCS service address is missing."));
            }

            if (!coverageName || (coverageName.length === 0)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsTileUrlBuilder", "constructor",
                        "The WCS coverage name is missing."));
            }

            /**
             * The address of the WCS server.
             * @type {String}
             */
            this.serviceAddress = serviceAddress;

            /**
             * The name of the coverage to retrieve.
             * @type {String}
             */
            this.coverageName = coverageName;

            /**
             * The WCS version to specify when requesting resources.
             * @type {String}
             * @default 1.0.0
             */
            this.wcsVersion = (wcsVersion && wcsVersion.length > 0) ? wcsVersion : "1.0.0";

            /**
             * The coordinate reference system to use when requesting coverages.
             * @type {String}
             * @default EPSG:4326
             */
            this.crs = "EPSG:4326";
        };

        /**
         * Creates the URL string for a WCS Get Coverage request.
         * @param {Tile} tile The tile for which to create the URL.
         * @param {String} coverageFormat The coverage format to request.
         * @throws {ArgumentError} If the specified tile or coverage format are null or undefined.
         */
        WcsTileUrlBuilder.prototype.urlForTile = function (tile, coverageFormat) {

            if (!tile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "urlForTile", "missingTile"));
            }

            if (!coverageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsUrlBuilder", "urlForTile",
                        "The coverage format is null or undefined."));
            }

            var sector = tile.sector;

            var sb = WcsTileUrlBuilder.fixGetCoverageString(this.serviceAddress);

            if (sb.search(/service=wcs/i) < 0) {
                sb = sb + "service=WCS";
            }

            sb = sb + "&request=GetCoverage";
            sb = sb + "&version=" + this.wcsVersion;
            sb = sb + "&coverage=" + this.coverageName;
            sb = sb + "&format=" + coverageFormat;
            sb = sb + "&width=" + tile.tileWidth;
            sb = sb + "&height=" + tile.tileHeight;

            sb = sb + "&crs=" + this.crs;
            sb = sb + "&bbox=";
            sb = sb + sector.minLongitude + "," + sector.minLatitude + ",";
            sb = sb + sector.maxLongitude + "," +sector. maxLatitude;

            sb = sb.replace(" ", "%20");

            return sb;
        };

        // Intentionally not documented.
        WcsTileUrlBuilder.fixGetCoverageString = function (serviceAddress) {
            if (!serviceAddress) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WcsTileUrlBuilder", "fixGetCoverageString",
                        "The specified service address is null or undefined."));
            }

            var index = serviceAddress.indexOf("?");

            if (index < 0) { // if string contains no question mark
                serviceAddress = serviceAddress + "?"; // add one
            } else if (index !== serviceAddress.length - 1) { // else if question mark not at end of string
                index = serviceAddress.search(/&$/);
                if (index < 0) {
                    serviceAddress = serviceAddress + "&"; // add a parameter separator
                }
            }

            return serviceAddress;
        };

        return WcsTileUrlBuilder;
    });
