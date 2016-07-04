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
         * @param {{}} layerCaps The layerCaps to create the tileMatrixSet : must contain the topLeftCorner, the extent, a
         * resolution array and the tileSize
         * @throws {ArgumentError} If the specified layerCaps.layerName is null or undefined. It is the WMTS layer name to get
         * @throws {ArgumentError} If the specified layerCaps.format is null or undefined. It is the tile picture format
         * @throws {ArgumentError} If the specified layerCaps.url is null or undefined. The server url.
         * @throws {ArgumentError} If the specified layerCaps.matrixSet is null or undefined. The name of the matrix to
         * use for this layer.
         * @throws {ArgumentError} If the specified layerCaps.prefix is null or undefined. It represents if the
         * identifier of the matrix must be prefixed by the matrix name
         * @throws {ArgumentError} If the specified layerCaps.projection is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.extent is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.resolutions is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.tileSize is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.topLeftCorner is null or undefined.
         */
        var WmtsLayerCaps = function (layerCaps) {

            if (!layerCaps) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No layer configuration specified."));
            }

            // Layer name & title to display
            // Title may be null, in which case the layerName is used.
            this.identifier = layerCaps.layerName;
            this.title = layerCaps.title ? [{value : layerCaps.title}] : [{value : layerCaps.layerName}];
            if (!this.identifier) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No layer name provided."));
            }

            // Format
            this.format = [layerCaps.format];
            if (!this.format) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No image format provided."));
            }

            // URL
            if (!layerCaps.url) {
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
                                    href : layerCaps.url
                                }]
                            }
                        }]
                    }]
                }
            };

            // Style : The style to use for this layer. Must be one of those listed in the accompanying
            // layer capabilities. May be null, in which case the WMTS server's default style is used.
            var styleName = (!layerCaps.style) ? "default" : layerCaps.style;
            this.style = (!layerCaps.style) ? [] : [{identifier:styleName, isDefault:"true"}];

            // TileMatrixSet
            if (!layerCaps.matrixSet) { // matrixSet
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No matrixSet provided."));
            }
            if (!layerCaps.projection) { // projection
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No projection provided."));
            }
            if (!layerCaps.extent || layerCaps.extent.length != 4) { // extent
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No extent provided."));
            }

            // Define the boundingBox
            var boundingBox = {
                lowerCorner : [layerCaps.extent[0], layerCaps.extent[1]],
                upperCorner : [layerCaps.extent[2], layerCaps.extent[3]]
            };

            // Resolutions
            if (!layerCaps.resolutions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No resolutions provided."));
            }

            // Tile size
            if (!layerCaps.tileSize) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No tile size provided."));
            }

            // Top left corner
            if (!layerCaps.topLeftCorner || layerCaps.topLeftCorner.length != 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "No extent provided."));
            }

            // Prefix
            if (layerCaps.prefix == undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "Prefix not provided."));
            }

            // Check if the projection is supported
            if (!(WmtsLayer.isEpsg4326Crs(layerCaps.projection) || WmtsLayer.isOGCCrs84(layerCaps.projection) || WmtsLayer.isEpsg3857Crs(layerCaps.projection))) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCaps", "constructor",
                        "Projection provided not supported."));
            }

            var tileMatrixSet = [],
                scale;

            // Construct the tileMatrixSet
            for (var i = 0; i < layerCaps.resolutions.length; i++) {
                // Compute the scaleDenominator
                if (WmtsLayer.isEpsg4326Crs(layerCaps.projection) || WmtsLayer.isOGCCrs84(layerCaps.projection)) {
                    scale = layerCaps.resolutions[i] * 6378137.0 * 2.0 * Math.PI / 360 / 0.00028;
                } else if (WmtsLayer.isEpsg3857Crs(layerCaps.projection)) {
                    scale = layerCaps.resolutions[i] / 0.00028;
                }

                // Compute the matrix width / height
                var unitWidth = layerCaps.tileSize * layerCaps.resolutions[i];
                var unitHeight = layerCaps.tileSize * layerCaps.resolutions[i];
                var matrixWidth = Math.ceil((layerCaps.extent[2]-layerCaps.extent[0]-0.01*unitWidth)/unitWidth);
                var matrixHeight = Math.ceil((layerCaps.extent[3]-layerCaps.extent[1]-0.01*unitHeight)/unitHeight);

                // Define the tile matrix
                var tileMatrix = {
                    identifier : layerCaps.prefix ? layerCaps.matrixSet+":"+i : i,
                    levelNumber : i,
                    matrixHeight : matrixHeight,
                    matrixWidth : matrixWidth,
                    tileHeight : layerCaps.tileSize,
                    tileWidth : layerCaps.tileSize,
                    topLeftCorner : layerCaps.topLeftCorner,
                    scaleDenominator : scale
                };
                
                tileMatrixSet.push(tileMatrix);
            }

            // Define the tileMatrixSetRef
            var tileMatrixSetRef = {
                identifier:layerCaps.matrixSet,
                supportedCRS:layerCaps.projection,
                boundingBox : boundingBox,
                tileMatrix : tileMatrixSet
            };

            // Define the tileMatrixSetLink
            this.tileMatrixSetLink = [{
                tileMatrixSet : layerCaps.matrixSet,
                tileMatrixSetRef:tileMatrixSetRef
            }];
        };

        return WmtsLayerCaps;

    });