/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports MercatorTiledImageLayer
 */
define([
        '../util/Color',
        '../geom/Sector',
        '../geom/Location',
        '../layer/TiledImageLayer',
        '../geom/Vec2',
        '../util/WWMath'
    ],
    function (Color,
              Sector,
              Location,
              TiledImageLayer,
              Vec2,
              WWMath) {
        "use strict";

        /**
         * Constructs a layer supporting Mercator imagery.
         * @alias MercatorTiledImageLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Provides an abstract layer to support Mercator layers.
         *
         * @param {String} displayName This layer's display name.
         * @param {Number} numLevels The number of levels to define for the layer. Each level is successively one power
         * of two higher resolution than the next lower-numbered level. (0 is the lowest resolution level, 1 is twice
         * that resolution, etc.)
         * Each level contains four times as many tiles as the next lower-numbered level, each 1/4 the geographic size.
         * @param {String} imageFormat The mime type of the image format for the layer's tiles, e.g., <em>image/png</em>.
         * @param {String} cachePath A string uniquely identifying this layer relative to other layers.
         * @param {Number} imageSize The horizontal and vertical size of image tiles in pixels.
         * @param {Number} firstLevelOffset The level offset to skip applying one tile over whole globe and start from e.g. 8x8 tiles.
         * @throws {ArgumentError} If any of the specified cache path or image format arguments are
         * null or undefined, or if the specified number of levels or tile size is less than 1.
         */
        var MercatorTiledImageLayer = function (displayName, numLevels, imageFormat, cachePath, imageSize, firstLevelOffset) {

            function gudermannian(percent) {
                var x = percent * Math.PI;
                // var sinh = (Math.exp(x) - Math.exp(-x)) / 2;
                var y = Math.exp(x);
                var sinh = (y - 1 / y) / 2;
                return Math.atan(sinh) * 180 / Math.PI;
            }

            function levelZeroDelta(firstLevelOffset) {
                var levelZeroDelta = 360 / (1 << firstLevelOffset);
                return new Location(levelZeroDelta / 2, levelZeroDelta);
            }

            var sector = new Sector(
                gudermannian(-1), gudermannian(1), -180, 180
            );

            TiledImageLayer.call(this, displayName,
                sector, levelZeroDelta(firstLevelOffset), numLevels - firstLevelOffset, imageFormat, cachePath, imageSize, imageSize);

            this.detectBlankImages = false;
            this.imageSize = imageSize;
            this.firstLevelOffset = firstLevelOffset;

            // These pixels are tested in retrieved images to determine whether the image is blank.
            this.testPixels = [
                new Vec2(20, 20),
                new Vec2(235, 20),
                new Vec2(20, 235),
                new Vec2(235, 235)
            ];

            // Create a canvas we can use when unprojecting retrieved images.
            this.destCanvas = document.createElement("canvas");
            this.destContext = this.destCanvas.getContext("2d");
        };

        MercatorTiledImageLayer.prototype = Object.create(TiledImageLayer.prototype);

        // Overridden from TiledImageLayer. Computes a tile's sector and creates the tile.
        // Unlike typical tiles, Tiles at the same level do not have the same sector size.
        MercatorTiledImageLayer.prototype.createTile = function (sector, level, row, column) {
            var mapSize = this.mapSizeForLevel(level.levelNumber),
                swX = WWMath.clamp(column * this.imageSize, 0, mapSize),
                neY = WWMath.clamp(row * this.imageSize, 0, mapSize),
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

        // Overridden from TiledImageLayer to unproject the retrieved image prior to creating a texture for it.
        MercatorTiledImageLayer.prototype.createTexture = function (dc, tile, image) {
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

            // If it's a blank image, mark it as permanently absent.
            if (this.detectBlankImages && this.isBlankImage(image, srcImageData)) {
                this.absentResourceList.markResourceAbsentPermanently(tile.imagePath);
                return null;
            }

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

            return TiledImageLayer.prototype.createTexture.call(this, dc, tile, destCanvas);
        };

        // Determines whether a retrieved image is blank.
        MercatorTiledImageLayer.prototype.isBlankImage = function (image, srcImageData) {
            var pixel, k, pixelValue = null;

            for (var i = 0, len = this.testPixels.length; i < len; i++) {
                pixel = this.testPixels[i];
                k = 4 * (pixel[0] + pixel[1] * image.width);

                if (!pixelValue) {
                    pixelValue = [
                        srcImageData.data[k],
                        srcImageData.data[k + 1],
                        srcImageData.data[k + 2]
                    ];
                } else {
                    if (srcImageData.data[k] != pixelValue[0]
                        || srcImageData.data[k + 1] != pixelValue[1]
                        || srcImageData.data[k + 2] != pixelValue[2]) {
                        return false;
                    }
                }
            }

            return true;
        };

        /**
         * Calculates map size in pixels for specified level.
         *
         * @param {Number} levelNumber The number of level to calculate map size for.
         */
        MercatorTiledImageLayer.prototype.mapSizeForLevel = function(levelNumber) {
            return this.imageSize << (levelNumber + this.firstLevelOffset);
        };

        // Overridden from TiledImageLayer to add possibility to create simple child layers with URL builder built-in.
        MercatorTiledImageLayer.prototype.resourceUrlForTile = function(tile, imageFormat) {
            if (this.urlBuilder) {
                return this.urlBuilder.urlForTile(tile, imageFormat);
            } else {
                return this.getImageSourceUrl(tile.column, tile.row, tile.level.levelNumber + this.firstLevelOffset);
            }
        };

        /**
         * Simple version of URL builder based on commonly used by online maps input parameters x, y and z.
         *
         * @param {Number} x The X coordinate of tile.
         * @param {Number} y The Y coordinate of tile.
         * @param {Number} z The zoom level of tile.
         */
        MercatorTiledImageLayer.prototype.getImageSourceUrl = function(x, y, z) {
            // Intentionally empty. Can be override in child layer and return URL for specified tile instead of builder
            return null;
        };

        return MercatorTiledImageLayer;
    }
);