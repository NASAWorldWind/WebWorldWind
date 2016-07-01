/**
 * @exports TmsLayerCaps
 */
define(['../error/ArgumentError',
        '../util/Logger'],
    function (ArgumentError,
              Logger) {
        "use strict";


        /**
         * Constructs a TMS layer capabilities on the fly.
         * @alias TmsLayerCaps
         * @constructor
         * @augments Layer capabilities
         * @classdesc Create a TMS layer capabilities.
         * @param {{}} layerCaps The information to create the configuration : must contain the global extent,
         * the resolutions array, the origin, the image format, the projection, the tile size, the matrix set, the
         * layer name and the server url
         * @throws {ArgumentError} If the layerCaps is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.extent is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.resolutions is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.origin is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.imageFormat is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.projection is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.tileSize is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.matrixSet is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.layerName is null or undefined.
         * @throws {ArgumentError} If the specified layerCaps.url is null or undefined.
         */
        var TmsLayerCaps = function (layerCaps) {

            if (!layerCaps) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No layer configuration specified."));
            }

            // Define the extent / bounding box
            if (!layerCaps.extent) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No extent provided in the configuration."));
            }
            this.extent = layerCaps.extent;

            // Resolutions array
            if (!layerCaps.resolutions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No resolutions provided in the configuration."));
            }
            this.resolutions = layerCaps.resolutions;

            // Origin
            if (!layerCaps.origin) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No origin provided in the configuration."));
            }
            this.origin = layerCaps.origin;

            // Image format
            if (!layerCaps.imageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No image format provided in the configuration."));
            }
            this.imageFormat = layerCaps.imageFormat;

            // Projection
            if (!layerCaps.projection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No projection provided in the configuration."));
            }
            this.projection = layerCaps.projection;

            // Tile size
            if (!layerCaps.tileSize) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No tile size provided in the configuration."));
            }
            this.tileSize = layerCaps.tileSize;

            // Matrix set
            if (!layerCaps.matrixSet) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No matrixSet provided in the configuration."));
            }
            this.matrixSet = layerCaps.matrixSet;

            // Layer name
            if (!layerCaps.layerName) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No layer name provided in the configuration."));
            }
            this.layerName = layerCaps.layerName;

            // Url
            if (!layerCaps.url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCaps", "constructor",
                        "No url provided."));
            }
            this.url = layerCaps.url;

            // Cache path
            this.cachePath =  layerCaps.url+layerCaps.layerName+"@"+layerCaps.matrixSet;
        };


        return TmsLayerCaps;

    });