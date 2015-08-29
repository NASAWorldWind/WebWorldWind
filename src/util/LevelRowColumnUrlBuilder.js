/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports LevelRowColumnUrlBuilder
 * @version $Id: LevelRowColumnUrlBuilder.js 2643 2015-01-09 20:37:58Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../util/WWUtil'
    ],
    function (ArgumentError,
              Logger,
              WWUtil) {
        "use strict";

        /**
         * Constructs a URL builder for level/row/column tiles.
         * @alias LevelRowColumnUrlBuilder
         * @constructor
         * @classdesc Provides a factory to create URLs for level/row/column tile REST requests.
         * <p>
         * URLs are formed by appending the specified server address with the specified path and appending
         * a path of the form <em>/level/row/row_column.image-format</em>, where image-format is the corresponding
         * suffix to the image mime type specified when a URL is requested. For example, if the specified server
         * address is <em>http://worldwindserver.net/webworldwind</em> and the specified path-to-data is
         * <em>../data/Earth/BMNG256</em>, and the requested tile's level, row and column are 0, 5 and 9 respectively,
         * and the image format is <em>image/jpeg</em>, the composed URL is
         * <em>http://worldwindserver.net/webworldwind/../data/Earth/BMNG256/0/5/5_9.jpg.
         *
         * @param {String} serverAddress The server address. May be null, in which case the address is assumed to be
         * the current location (see <code>window.location</code>) minus the last path component.
         * @param {String} pathToData The path to the dataset on the server. May be null or empty to indicate that
         * the data is directly relative to the specified server address.
         *
         */
        var LevelRowColumnUrlBuilder = function (serverAddress, pathToData) {
            /**
             * The server address.
             * @type {String}
             */
            this.serverAddress = serverAddress;
            if (!serverAddress || serverAddress.length === 0) {
                this.serverAddress = WWUtil.currentUrlSansFilePart();
            }

            /**
             * The server-side path to the dataset.
             * @type {String}
             */
            this.pathToData = pathToData;
        };

        /**
         * Creates the URL string for a WMS Get Map request.
         * @param {Tile} tile The tile for which to create the URL.
         * @param {String} imageFormat The image format to request.
         * @throws {ArgumentError} If the specified tile or image format are null or undefined.
         */
        LevelRowColumnUrlBuilder.prototype.urlForTile = function (tile, imageFormat) {
            if (!tile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile", "missingTile"));
            }

            if (!imageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsUrlBuilder", "urlForTile",
                        "The image format is null or undefined."));
            }

            var sb = this.serverAddress;

            if (this.pathToData) {
                sb = sb + "/" + this.pathToData;
            }

            sb = sb + "/" + tile.level.levelNumber.toString();
            sb = sb + "/" + tile.row.toString();
            sb = sb + "/" + tile.row.toString() + "_" + tile.column.toString();
            sb = sb + "." + WWUtil.suffixForMimeType(imageFormat);

            sb = sb.replace(" ", "%20");

            return sb;
        };

        return LevelRowColumnUrlBuilder;
    });