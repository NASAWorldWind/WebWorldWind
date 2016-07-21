/**
 * @exports TmsLayer
 */
define([
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../geom/Sector',
        '../render/Texture',
        '../layer/TiledImageLayer',
        '../util/WWMath',
        '../util/WWUtil'
    ],
    function (ArgumentError,
              Location,
              Logger,
              Sector,
              Texture,
              TiledImageLayer,
              WWMath,
              WWUtil
    ) {
        "use strict";


        /**
         * Constructs a TMS image layer.
         * @alias TmsLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Displays a TMS image layer.
         * @param {{}} config Specifies configuration information for the layer. Must contain the following
         * properties:
         * <ul>
         *     <li>extent: {Array} The extent of this layer.</li>
         *     <li>resolutions: {Array} The resolutions array to use for this layer.</li>
         *     <li>origin: {Array} The coordinates of the origin.</li>
         *     <li>format: {String} The mime type of the image format to request, e.g., image/png.</li>
         *     <li>size: {Number} The size in pixels of tiles for this layer.</li>
         *     <li>coordinateSystem : {String} The coordinate system to use for this layer, e.g., EPSG:4326.</li>
         *     <li>matrixSet : {String} The matrix name to use for this layer.</li>
         *     <li>layerName : {String} The layer name (identifier).</li>
         *     <li>service: {String} The URL of the TMS server.</li>
         *     <li>title (optional): {String} The layer name to display.</li>
         * </ul>
         * The function [TmsLayer.formLayerConfiguration]{@link TmsLayer#formLayerConfiguration} will create an
         * appropriate configuration object given a {@link TmsLayerCapabilities} object.
         * @param {String} displayName The name to display for this layer, may be null.
         * @throws {ArgumentError} If the specified configuration is null or undefined.
         */
        var TmsLayer = function (config, displayName) {

            if (!config) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "constructor",
                        "No layer configuration specified."));
            }

            var cachePath =  config.service+config.layerName+"@"+config.matrixSet;

            // Determine image format
            var format = WWUtil.suffixForMimeType(config.format);

            if (!format) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "constructor",
                        "No image format supported."));
            }

            TiledImageLayer.call(
                this,
                new Sector(config.extent[1], config.extent[3], config.extent[0], config.extent[2]),
                new Location(36, 36), // TODO: How to determine best delta
                18,
                format,
                cachePath,
                config.size,
                config.size
            );

            this.displayName = displayName || config.title ||"TMS Layer";



            this.projection = config.coordinateSystem;

            this.urlBuilder = {
                urlForTile: function (tile, imageFormat) {
                    return config.service + config.layerName + "@" + config.matrixSet + "/" +
                        (tile.level.levelNumber) + "/" + tile.column + "/" + (tile.row) + "." + format;
                }
            };

            this.detailControl = 0.5;

            this.imageSize = config.size;
            this.origin = config.origin;
            this.sector = new Sector(config.extent[1], config.extent[3], config.extent[0], config.extent[2]);

            // Compute the matrix width / height
            this.nbTilesWidth = [];
            this.nbTilesHeight = [];
            for (var i = 0; i < config.resolutions.length ; i++) {
                var unitWidth = config.size * config.resolutions[i];
                var unitHeight = config.size * config.resolutions[i];
                this.nbTilesWidth.push(Math.ceil((config.extent[2]-config.extent[0]-0.01*unitWidth)/unitWidth));
                this.nbTilesHeight.push(Math.ceil((config.extent[3]-config.extent[1]-0.01*unitHeight)/unitHeight));
            }
        };


        /**
         * Forms a configuration object for a specified {@link TmsLayerCapabilities layer description. The
         * configuration object created and returned is suitable for passing to the TmsLayer constructor.
         * @param tmsLayerCapabilities {TmsLayerCapabilities} The TMS layer capabilities to create a configuration for.
         * @returns {{}} A configuration object.
         * @throws {ArgumentError} If the specified TMS layer capabilities is null or undefined.
         */
        TmsLayer.formLayerConfiguration = function (tmsLayerCapabilities) {

            var config = {};

            // Define the extent / bounding box
            if (!tmsLayerCapabilities.extent) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No extent provided in the capabilities."));
            }
            config.extent = tmsLayerCapabilities.extent;

            // Resolutions array
            if (!tmsLayerCapabilities.resolutions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No resolutions provided in the capabilities."));
            }
            config.resolutions = tmsLayerCapabilities.resolutions;

            // Origin
            if (!tmsLayerCapabilities.origin) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No origin provided in the capabilities."));
            }
            config.origin = tmsLayerCapabilities.origin;

            // Image format
            if (!tmsLayerCapabilities.imageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No image format provided in the capabilities."));
            }
            config.format = tmsLayerCapabilities.imageFormat;

            // Projection
            if (!tmsLayerCapabilities.projection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No coordinate system provided in the capabilities."));
            }
            config.coordinateSystem = tmsLayerCapabilities.projection;

            // Tile size
            if (!tmsLayerCapabilities.tileSize) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No tile size provided in the capabilities."));
            }
            config.size = tmsLayerCapabilities.tileSize;

            // Matrix set
            if (!tmsLayerCapabilities.matrixSet) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No matrixSet provided in the capabilities."));
            }
            config.matrixSet = tmsLayerCapabilities.matrixSet;

            // Layer name
            if (!tmsLayerCapabilities.layerName) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No layer name provided in the capabilities."));
            }
            config.layerName = tmsLayerCapabilities.layerName;

            // Url
            if (!tmsLayerCapabilities.url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayer", "formLayerConfiguration",
                        "No url provided in the capabilities."));
            }
            config.service = tmsLayerCapabilities.url;

            // Title
            config.title = tmsLayerCapabilities.title;

            // Profile
            config.profile = tmsLayerCapabilities.profile;

            // Abstract
            config.abstract = tmsLayerCapabilities.abstract;

            return config;
        };



        TmsLayer.prototype = Object.create(TiledImageLayer.prototype);

        TmsLayer.prototype.doRender = function (dc) {
            TiledImageLayer.prototype.doRender.call(this, dc);
        };


        // Overridden from TiledImageLayer.
        TmsLayer.prototype.createTopLevelTiles = function (dc, projection) {

            this.topLevelTiles = [];

            for (var j = 0; j < this.nbTilesHeight[0]; j++) {
                for (var i = 0; i < this.nbTilesWidth[0]; i++) {
                    this.topLevelTiles.push(this.createTile(this.sector, this.levels.firstLevel(), j, i));
                }
            }
        };

        TmsLayer.isEpsg4326Crs = function (crs) {
            return ((crs.indexOf("EPSG") >= 0) && (crs.indexOf("4326") >= 0));
        };

        TmsLayer.isEpsg3857Crs = function (crs) {
            return (crs.indexOf("EPSG") >= 0)
                && ((crs.indexOf("3857") >= 0) || (crs.indexOf("900913") >= 0)); // 900913 is google's 3857 alias
        };

        TmsLayer.isOGCCrs84 = function (crs) {
            return (crs.indexOf("OGC") >= 0) && (crs.indexOf("CRS84") >= 0);
        };


        TmsLayer.prototype.createTexture = function (dc, tile, image) {

            if (TmsLayer.isEpsg4326Crs(this.projection)) {

                return new Texture(dc.currentGlContext, image);
            } else if (TmsLayer.isEpsg3857Crs(this.projection)) {
                return this.createTexture3857(dc, tile, image);
            }
            else if (TmsLayer.isOGCCrs84(this.projection)) {
                return new Texture(dc.currentGlContext, image);
            }
        };

        TmsLayer.prototype.createTile = function (sector, level, row, column) {
            if (TmsLayer.isEpsg4326Crs(this.projection)) {
                return this.createTile4326(sector, level, row, column);
            } else if (TmsLayer.isEpsg3857Crs(this.projection)) {
                return this.createTile3857(sector, level, row, column);
            }
            else if (TmsLayer.isOGCCrs84(this.projection)) {
                return TiledImageLayer.prototype.createTile.call(this, sector, level, row, column);
            }
        };

        TmsLayer.prototype.createTile4326 = function (sector, level, row, column) {
            var tileDeltaLat = this.sector.deltaLatitude() / this.nbTilesHeight[level.levelNumber],
                tileDeltaLon = this.sector.deltaLongitude() / this.nbTilesWidth[level.levelNumber],

                //Todo
                maxLat = this.sector.maxLatitude - (this.nbTilesHeight[level.levelNumber]-row-1) * tileDeltaLat, // Origin bottom left
                // maxLat = this.sector.maxLatitude - row * tileDeltaLat, // Origin top left
                minLat = maxLat - tileDeltaLat,
                minLon = this.origin[0] + tileDeltaLon * column,
                maxLon = minLon + tileDeltaLon;

            sector = new Sector(minLat, maxLat, minLon, maxLon);

            return TiledImageLayer.prototype.createTile.call(this, sector, level, row, column);
        };


        TmsLayer.prototype.createTile3857 = function (sector, level, row, column) {

            var mapSize = this.mapSizeForLevel(level.levelNumber),
                swX = WWMath.clamp(column * this.imageSize, 0, mapSize),
                //Todo
                // neY = WWMath.clamp(row * this.imageSize, 0, mapSize), //Origin top left
                neY = WWMath.clamp(mapSize - (row+1) * this.imageSize, 0, mapSize), //Origin bottom left
                neX = WWMath.clamp(swX + (this.imageSize), 0, mapSize),
                swY = WWMath.clamp(neY + (this.imageSize), 0, mapSize),
                x, y, swLat, swLon, neLat, neLon;

            x = (swX / mapSize) - 0.5;
            y = 0.5 - (swY / mapSize);
            swLat = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
            swLon = 360 * x;

            x = (neX / mapSize) - 0.5;
            y = 0.5 - (neY / mapSize);
            neLat = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
            neLon = 360 * x;

            sector = new Sector(swLat, neLat, swLon, neLon);

            return TiledImageLayer.prototype.createTile.call(this, sector, level, row, column);
        };

        TmsLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return this.imageSize * this.nbTilesHeight[levelNumber];
        };



        TmsLayer.prototype.createTexture3857 = function (dc, tile, image) {
            if (!this.destCanvas) {
                // Create a canvas we can use when unprojecting retrieved images.
                this.destCanvas = document.createElement("canvas");
                this.destContext = this.destCanvas.getContext("2d");
            }

            var srcCanvas = dc.canvas2D,
                srcContext = dc.ctx2D,
                srcImageData,
                destCanvas = this.destCanvas,
                destContext = this.destContext,
                destImageData = destContext.createImageData(image.width, image.height),
                sector = tile.sector,
                tMin = WWMath.gudermannianInverse(sector.minLatitude),
                tMax = WWMath.gudermannianInverse(sector.maxLatitude),
                lat, g, srcRow, kSrc, kDest, sy, dy;


            srcCanvas.width = image.width;
            srcCanvas.height = image.height;
            destCanvas.width = image.width;
            destCanvas.height = image.height;

            // Draw the original image to a canvas so image data can be had for it.
            srcContext.drawImage(image, 0, 0, image.width, image.height);
            srcImageData = srcContext.getImageData(0, 0, image.width, image.height);

            // Unproject the retrieved image.
            for (var n = 0; n < 1; n++) {
                for (var y = 0; y < image.height; y++) {
                    sy = 1 - y / (image.height - 1);
                    lat = sy * sector.deltaLatitude() + sector.minLatitude;
                    g = WWMath.gudermannianInverse(lat);
                    dy = 1 - (g - tMin) / (tMax - tMin);
                    dy = WWMath.clamp(dy, 0, 1);
                    srcRow = Math.floor(dy * (image.height - 1));
                    for (var x = 0; x < image.width; x++) {
                        kSrc = 4 * (x + srcRow * image.width);
                        kDest = 4 * (x + y * image.width);

                        destImageData.data[kDest] = srcImageData.data[kSrc];
                        destImageData.data[kDest + 1] = srcImageData.data[kSrc + 1];
                        destImageData.data[kDest + 2] = srcImageData.data[kSrc + 2];
                        destImageData.data[kDest + 3] = srcImageData.data[kSrc + 3];
                    }
                }
            }

            destContext.putImageData(destImageData, 0, 0);

            return new Texture(dc.currentGlContext, destCanvas);
        };



        return TmsLayer;
    }
);