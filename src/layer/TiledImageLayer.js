/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TiledImageLayer
 * @version $Id: TiledImageLayer.js 3132 2015-06-01 22:42:45Z dcollins $
 */
define([
        '../util/AbsentResourceList',
        '../error/ArgumentError',
        '../render/ImageTile',
        '../layer/Layer',
        '../util/LevelSet',
        '../util/Logger',
        '../cache/MemoryCache',
        '../render/Texture',
        '../util/Tile',
        '../util/WWUtil'
    ],
    function (AbsentResourceList,
              ArgumentError,
              ImageTile,
              Layer,
              LevelSet,
              Logger,
              MemoryCache,
              Texture,
              Tile,
              WWUtil) {
        "use strict";

        /**
         * Constructs a tiled image layer.
         * @alias TiledImageLayer
         * @constructor
         * @classdesc
         * Provides a layer that displays multi-resolution imagery arranged as adjacent tiles in a pyramid.
         * This is the primary World Wind base class for displaying imagery of this type. While it may be used as a
         * stand-alone class, it is typically subclassed by classes that identify the remote image server.
         * <p>
         * While the image tiles for this class are typically drawn from a remote server such as a WMS server. The actual
         * retrieval protocol is independent of this class and encapsulated by a class implementing the {@link UrlBuilder}
         * interface and associated with instances of this class as a property.
         * <p>
         * There is no requirement that image tiles of this class be remote, they may be local or procedurally generated. For
         * such cases the subclass overrides this class' [retrieveTileImage]{@link TiledImageLayer#retrieveTileImage} method.
         * <p>
         * Layers of this type are by default not pickable. Their pick-enabled flag is initialized to false.
         *
         * @augments Layer
         * @param {Sector} sector The sector this layer covers.
         * @param {Location} levelZeroDelta The size in latitude and longitude of level zero (lowest resolution) tiles.
         * @param {Number} numLevels The number of levels to define for the layer. Each level is successively one power
         * of two higher resolution than the next lower-numbered level. (0 is the lowest resolution level, 1 is twice
         * that resolution, etc.)
         * Each level contains four times as many tiles as the next lower-numbered level, each 1/4 the geographic size.
         * @param {String} imageFormat The mime type of the image format for the layer's tiles, e.g., <em>image/png</em>.
         * @param {String} cachePath A string uniquely identifying this layer relative to other layers.
         * @param {Number} tileWidth The horizontal size of image tiles in pixels.
         * @param {Number} tileHeight The vertical size of image tiles in pixels.
         * @throws {ArgumentError} If any of the specified sector, level-zero delta, cache path or image format arguments are
         * null or undefined, or if the specified number of levels, tile width or tile height is less than 1.
         *
         */
        var TiledImageLayer = function (sector, levelZeroDelta, numLevels, imageFormat, cachePath, tileWidth, tileHeight) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor", "missingSector"));
            }

            if (!levelZeroDelta) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                        "The specified level-zero delta is null or undefined."));
            }

            if (!imageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                        "The specified image format is null or undefined."));
            }

            if (!cachePath) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                        "The specified cache path is null or undefined."));
            }

            if (!numLevels || numLevels < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                        "The specified number of levels is less than one."));
            }

            if (!tileWidth || !tileHeight || tileWidth < 1 || tileHeight < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledImageLayer", "constructor",
                        "The specified tile width or height is less than one."));
            }

            Layer.call(this, "Tiled Image Layer");

            this.retrievalImageFormat = imageFormat;
            this.cachePath = cachePath;

            this.levels = new LevelSet(sector, levelZeroDelta, numLevels, tileWidth, tileHeight);

            this.currentTiles = [];
            this.currentTilesInvalid = true;
            this.tileCache = new MemoryCache(500000, 400000);
            this.detailHintOrigin = 2.4;
            this.detailHint = 0;
            this.currentRetrievals = [];
            this.absentResourceList = new AbsentResourceList(3, 50e3);
            this.mapAncestorToTile = true;

            this.pickEnabled = false;
        };

        TiledImageLayer.prototype = Object.create(Layer.prototype);

        // Intentionally not documented.
        TiledImageLayer.prototype.createTile = function (sector, level, row, column) {
            var path = this.cachePath + "-layer/" + level.levelNumber + "/" + row + "/" + row + "_" + column + "."
                + WWUtil.suffixForMimeType(this.retrievalImageFormat);

            return new ImageTile(sector, level, row, column, path);
        };

        // Documented in superclass.
        TiledImageLayer.prototype.doRender = function (dc) {
            if (!dc.terrain)
                return;

            if (this.expiration && (new Date().getTime() > this.expiration.getTime()))
                this.currentTilesInvalid = true;

            if (this.currentTilesInvalid
                || !this.lasTtMVP || !dc.navigatorState.modelviewProjection.equals(this.lasTtMVP)
                || dc.globeStateKey != this.lastGlobeStateKey) {
                this.currentTilesInvalid = false;
                this.assembleTiles(dc);
            }

            this.lasTtMVP = dc.navigatorState.modelviewProjection;
            this.lastGlobeStateKey = dc.globeStateKey;

            if (this.currentTiles.length > 0) {
                dc.surfaceTileRenderer.renderTiles(dc, this.currentTiles, this.opacity);
                dc.frameStatistics.incrementImageTileCount(this.currentTiles.length);
                this.inCurrentFrame = true;
            }
        };

        // Documented in superclass.
        TiledImageLayer.prototype.isLayerInView = function (dc) {
            return dc.terrain && dc.terrain.sector && dc.terrain.sector.intersects(this.levels.sector);
        };

        // Documented in superclass.
        TiledImageLayer.prototype.createTopLevelTiles = function (dc) {
            this.topLevelTiles = [];
            Tile.createTilesForLevel(this.levels.firstLevel(), this, this.topLevelTiles);
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.assembleTiles = function (dc) {
            this.currentTiles = [];

            if (!this.topLevelTiles || (this.topLevelTiles.length === 0)) {
                this.createTopLevelTiles(dc);
            }

            for (var i = 0, len = this.topLevelTiles.length; i < len; i++) {
                var tile = this.topLevelTiles[i];

                tile.update(dc);

                this.currentAncestorTile = null;

                if (this.isTileVisible(dc, tile)) {
                    this.addTileOrDescendants(dc, tile);
                }
            }
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.addTileOrDescendants = function (dc, tile) {
            if (this.tileMeetsRenderingCriteria(dc, tile)) {
                this.addTile(dc, tile);
                return;
            }

            var ancestorTile = null;

            try {
                if (this.isTileTextureInMemory(dc, tile) || tile.level.levelNumber === 0) {
                    ancestorTile = this.currentAncestorTile;
                    this.currentAncestorTile = tile;
                }

                var nextLevel = this.levels.level(tile.level.levelNumber + 1),
                    subTiles = tile.subdivideToCache(nextLevel, this, this.tileCache);

                for (var i = 0, len = subTiles.length; i < len; i++) {
                    var child = subTiles[i];

                    child.update(dc);

                    if (this.levels.sector.intersects(child.sector) && this.isTileVisible(dc, child)) {
                        this.addTileOrDescendants(dc, child);
                    }
                }
            } finally {
                if (ancestorTile) {
                    this.currentAncestorTile = ancestorTile;
                }
            }
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.addTile = function (dc, tile) {
            tile.fallbackTile = null;

            var texture = dc.gpuResourceCache.resourceForKey(tile.imagePath);
            if (texture) {
                this.currentTiles.push(tile);

                // If the tile's texture has expired, cause it to be re-retrieved. Note that the current,
                // expired texture is still used until the updated one arrives.
                if (this.expiration && this.isTextureExpired(texture)) {
                    this.retrieveTileImage(dc, tile);
                }

                return;
            }

            this.retrieveTileImage(dc, tile);

            if (this.currentAncestorTile) {
                if (this.isTileTextureInMemory(dc, this.currentAncestorTile)) {
                    if (this.mapAncestorToTile) {
                        // Set up to map the ancestor tile into the current one.
                        tile.fallbackTile = this.currentAncestorTile;
                        this.currentTiles.push(tile);
                    } else {
                        // Just enque the ancestor tile and don't enque the current one. This is necessary when the
                        // texture coordinate mapping from the current tile to its ancestor is not straightforward,
                        // as is the case for Mercator tiles.
                        this.currentTiles.push(this.currentAncestorTile);
                    }
                }
            }
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.isTileVisible = function (dc, tile) {
            if (dc.globe.projectionLimits && !tile.sector.overlaps(dc.globe.projectionLimits)) {
                return false;
            }

            return tile.extent.intersectsFrustum(dc.navigatorState.frustumInModelCoordinates);
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.tileMeetsRenderingCriteria = function (dc, tile) {
            var s = this.detailHintOrigin + this.detailHint;
            if (tile.sector.minLatitude >= 75 || tile.sector.maxLatitude <= -75) {
                s *= 0.9;
            }
            return tile.level.isLastLevel() || !tile.mustSubdivide(dc, s);
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.isTileTextureInMemory = function (dc, tile) {
            return dc.gpuResourceCache.containsResource(tile.imagePath);
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.isTextureExpired = function (texture) {
            return this.expiration && this.expiration < new Date().getTime;
        };

        /**
         * Retrieves the image for the specified tile. Subclasses should override this method in order to retrieve,
         * compute or otherwise create the image.
         * @param {DrawContext} dc The current draw context.
         * @param {ImageTile} tile The tile for which to retrieve the resource.
         * @protected
         */
        TiledImageLayer.prototype.retrieveTileImage = function (dc, tile) {
            if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
                if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
                    return;
                }

                var url = this.resourceUrlForTile(tile, this.retrievalImageFormat),
                    image = new Image(),
                    imagePath = tile.imagePath,
                    cache = dc.gpuResourceCache,
                    canvas = dc.currentGlContext.canvas,
                    layer = this;

                if (!url) {
                    this.currentTilesInvalid = true;
                    return;
                }

                image.onload = function () {
                    Logger.log(Logger.LEVEL_INFO, "Image retrieval succeeded: " + url);
                    var texture = layer.createTexture(dc, tile, image);
                    layer.removeFromCurrentRetrievals(imagePath);

                    if (texture) {
                        cache.putResource(imagePath, texture, texture.size);

                        layer.currentTilesInvalid = true;
                        layer.absentResourceList.unmarkResourceAbsent(imagePath);

                        // Send an event to request a redraw.
                        var e = document.createEvent('Event');
                        e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                        canvas.dispatchEvent(e);
                    }
                };

                image.onerror = function () {
                    layer.removeFromCurrentRetrievals(imagePath);
                    layer.absentResourceList.markResourceAbsent(imagePath);
                    Logger.log(Logger.LEVEL_WARNING, "Image retrieval failed: " + url);
                };

                this.currentRetrievals.push(imagePath);
                image.crossOrigin = 'anonymous';
                image.src = url;
            }
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.createTexture = function (dc, tile, image) {
            return  new Texture(dc.currentGlContext, image);
        };

        // Intentionally not documented.
        TiledImageLayer.prototype.removeFromCurrentRetrievals = function (imagePath) {
            var index = this.currentRetrievals.indexOf(imagePath);
            if (index > -1) {
                this.currentRetrievals.splice(index, 1);
            }
        };

        /**
         * Returns the URL string for the resource.
         * @param {ImageTile} tile The tile whose image is returned
         * @param {String} imageFormat The mime type of the image format desired.
         * @returns {String} The URL string, or null if the string can not be formed.
         * @protected
         */
        TiledImageLayer.prototype.resourceUrlForTile = function (tile, imageFormat) {
            if (this.urlBuilder) {
                return this.urlBuilder.urlForTile(tile, imageFormat);
            } else {
                return null;
            }
        };

        return TiledImageLayer;
    });