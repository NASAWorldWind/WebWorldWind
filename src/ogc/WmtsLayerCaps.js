/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmtsLayerCaps
 */
define(['../error/ArgumentError',
        '../util/Logger',
        '../layer/WmtsLayer'],
    function (ArgumentError,
              Logger,
              WmtsLayer) {
        "use strict";

        /**
         * Constructs a WMTS layer capabilities on the fly.
         * @alias WmtsLayerCaps
         * @constructor
         * @augments Layer capabilities
         * @classdesc Create a WMTS layer capabilities.
         * @param {String} layerName The WMTS layer name to get.
         * @param {String} title The layer name to display. May be null, in which case the layerName is used.
         * @param {String} format The tile picture format.
         * @param {String} url The url to reach the server.
         * @param {String} style The style to use for this layer. Must be one of those listed in the accompanying
         * layer capabilities. May be null, in which case the WMTS server's default style is used.
         * @param {String} matrixSet The name of the matrix to use for this layer.
         * @param {Boolean} prefix It represents if the identifier of the matrix must be prefixed by the matrix name.
         * @param {String} projection The projection used for this layer.
         * @param {{}} options The options to create the tileMatrixSet : must contain the topLeftCorner, the extent, a
         * resolution array and the tileSize
         * @throws {ArgumentError} If the specified layerName is null or undefined.
         * @throws {ArgumentError} If the specified format is null or undefined.
         * @throws {ArgumentError} If the specified url is null or undefined.
         * @throws {ArgumentError} If the specified matrixSet is null or undefined.
         * @throws {ArgumentError} If the specified prefix is null or undefined.
         * @throws {ArgumentError} If the specified projection is null or undefined.
         * @throws {ArgumentError} If the specified options.extent is null or undefined.
         * @throws {ArgumentError} If the specified options.resolutions is null or undefined.
         * @throws {ArgumentError} If the specified options.tileSize is null or undefined.
         * @throws {ArgumentError} If the specified options.topLeftCorner is null or undefined.
         */
        var WmtsLayerCaps = function (layerName, title, format, url, style, matrixSet, prefix, projection, options) {

            // Layer name & title
            this.identifier = layerName;
            this.title = title ? [{value : title}] : [{value : layerName}];
            if (!this.identifier) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No layer name provided."));
            }

            // Format
            this.format = [format];
            if (!this.format) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No image format provided."));
            }

            // URL
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No url provided."));
            }
            this.capabilities = {
                operationsMetadata : {
                    operation : [{
                        name : "GetTile",
                        dcp : [{
                            http : {
                                get : [{
                                    href : url
                                }]
                            }
                        }]
                    }]
                }
            };

            // Style
            var styleName = (!style) ? "default" : style;
            this.style = (!style) ? [] : [{identifier:styleName, isDefault:"true"}];

            // TileMatrixSet
            if (!matrixSet) { // matrixSet
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No matrixSet provided."));
            }
            if (!projection) { // projection
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No projection provided."));
            }
            if (!options.extent || options.extent.length != 4) { // extent
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No extent provided."));
            }

            // Define the boundingBox
            var boundingBox = {
                lowerCorner : [options.extent[0], options.extent[1]],
                upperCorner : [options.extent[2], options.extent[3]]
            };

            // Resolutions
            if (!options.resolutions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No resolutions provided."));
            }

            // Tile size
            if (!options.tileSize) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No tile size provided."));
            }

            // Top left corner
            if (!options.topLeftCorner || options.topLeftCorner.length != 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No extent provided."));
            }

            // Prefix
            if (prefix == undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "Prefix not provided."));
            }

            // Check if the projection is supported
            if (!(WmtsLayer.isEpsg4326Crs(projection) || WmtsLayer.isOGCCrs84(projection) || WmtsLayer.isEpsg3857Crs(projection))) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "Projection provided not supported."));
            }

            var tileMatrixSet = [],
                scale;

            // Construct the tileMatrixSet
            for (var i = 0; i < options.resolutions.length; i++) {
                // Compute the scaleDenominator
                if (WmtsLayer.isEpsg4326Crs(projection) || WmtsLayer.isOGCCrs84(projection)) {
                    scale = options.resolutions[i] * 6378137.0 * 2.0 * Math.PI / 360 / 0.00028;
                } else if (WmtsLayer.isEpsg3857Crs(projection)) {
                    scale = options.resolutions[i] / 0.00028;
                }

                // Compute the matrix width / height
                var unitWidth = options.tileSize * options.resolutions[i];
                var unitHeight = options.tileSize * options.resolutions[i];
                var matrixWidth = Math.ceil((options.extent[2]-options.extent[0]-0.01*unitWidth)/unitWidth);
                var matrixHeight = Math.ceil((options.extent[3]-options.extent[1]-0.01*unitHeight)/unitHeight);

                // Define the tile matrix
                var tileMatrix = {
                    identifier : prefix ? matrixSet+":"+i : i,
                    levelNumber : i,
                    matrixHeight : matrixHeight,
                    matrixWidth : matrixWidth,
                    tileHeight : options.tileSize,
                    tileWidth : options.tileSize,
                    topLeftCorner : options.topLeftCorner,
                    scaleDenominator : scale
                };
                
                tileMatrixSet.push(tileMatrix);
            }

            // Define the tileMatrixSetRef
            var tileMatrixSetRef = {
                identifier:matrixSet,
                supportedCRS:projection,
                boundingBox : boundingBox,
                tileMatrix : tileMatrixSet
            };

            // Define the tileMatrixSetLink
            this.tileMatrixSetLink = [{
                tileMatrixSet : matrixSet,
                tileMatrixSetRef:tileMatrixSetRef
            }];
        };

        return WmtsLayerCaps;

    });