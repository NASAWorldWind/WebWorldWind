/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports TiledElevationCoverage
 */
define(['../util/AbsentResourceList',
        '../geom/Angle',
        '../error/ArgumentError',
        '../globe/ElevationCoverage',
        '../globe/ElevationImage',
        '../globe/ElevationTile',
        '../util/LevelSet',
        '../util/Logger',
        '../cache/MemoryCache',
        '../geom/Sector',
        '../util/Tile',
        '../util/WWMath'],
    function (AbsentResourceList,
              Angle,
              ArgumentError,
              ElevationCoverage,
              ElevationImage,
              ElevationTile,
              LevelSet,
              Logger,
              MemoryCache,
              Sector,
              Tile,
              WWMath) {
        "use strict";

        /**
         * Constructs a TiledElevationCoverage
         * @alias TiledElevationCoverage
         * @constructor
         * @classdesc Represents the elevations for an area, often but not necessarily the whole globe.
         * <p>
         *     This class is intended to be a base class for more concrete elevation
         *     coverages, such as {@link EarthElevationCoverage}.
         * @param {Sector} coverageSector The sector this coverage spans.
         * @param {Location} levelZeroDelta The size of top-level tiles, in degrees.
         * @param {Number} numLevels The number of levels used to represent this coverage's resolution pyramid.
         * @param {String} retrievalImageFormat The mime type of the elevation data retrieved by this coverage.
         * @param {String} cachePath A string unique to this coverage relative to other coverages used by
         * the application.
         * @param {Number} tileWidth The number of intervals (cells) in the longitudinal direction of this elevation
         * model's elevation tiles.
         * @param {Number} tileHeight The number of intervals (cells) in the latitudinal direction of this elevation
         * model's elevation tiles.
         * @throws {ArgumentError} If any argument is null or undefined, if the number of levels specified is less
         * than one, or if either the tile width or tile height are less than one.
         */
        var TiledElevationCoverage = function (coverageSector, levelZeroDelta, numLevels, retrievalImageFormat, cachePath,
                                               tileWidth, tileHeight) {
            ElevationCoverage.call(this);

            if (!coverageSector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor", "missingSector"));
            }

            if (!levelZeroDelta) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor",
                        "The specified level-zero delta is null or undefined."));
            }

            if (!retrievalImageFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor",
                        "The specified image format is null or undefined."));
            }

            if (!cachePath) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor",
                        "The specified cache path is null or undefined."));
            }

            if (!numLevels || numLevels < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor",
                        "The specified number of levels is not greater than zero."));
            }

            if (!tileWidth || !tileHeight || tileWidth < 1 || tileHeight < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor",
                        "The specified tile width or height is not greater than zero."));
            }

            /**
             * The sector this coverage spans.
             * @type {Sector}
             * @readonly
             */
            this.coverageSector = coverageSector;

            /**
             * The mime type to use when retrieving elevations.
             * @type {String}
             * @readonly
             */
            this.retrievalImageFormat = retrievalImageFormat;

            /** A unique string identifying this coverage relative to other coverages in use.
             * @type {String}
             * @readonly
             */
            this.cachePath = cachePath;

            /**
             * This coverage's minimum elevation in meters.
             * @type {Number}
             * @default 0
             */
            this.minElevation = 0;

            /**
             * This coverage's maximum elevation in meters.
             * @type {Number}
             */
            this.maxElevation = 0;

            /**
             * Indicates whether the data associated with this coverage is point data. A value of false
             * indicates that the data is area data (pixel is area).
             * @type {Boolean}
             * @default true
             */
            this.pixelIsPoint = true;

            /**
             * The {@link LevelSet} created during construction of this coverage.
             * @type {LevelSet}
             * @readonly
             */
            this.levels = new LevelSet(this.coverageSector, levelZeroDelta, numLevels, tileWidth, tileHeight);

            /**
             * Internal use only
             * The list of assembled tiles.
             * @type {Array}
             * @ignore
             */
            this.currentTiles = [];

            /**
             * Internal use only
             * A scratch sector for use in computations.
             * @type {Sector}
             * @ignore
             */
            this.currentSector = new Sector(0, 0, 0, 0);

            /**
             * Internal use only
             * A cache of elevation tiles.
             * @type {MemoryCache}
             * @ignore
             */
            this.tileCache = new MemoryCache(1000000, 800000);

            /**
             * Internal use only
             * A cache of elevations.
             * @type {MemoryCache}
             * @ignore
             */
            this.imageCache = new MemoryCache(10000000, 8000000);

            /**
             * Internal use only
             * The list of elevation retrievals in progress.
             * @type {Array}
             * @ignore
             */
            this.currentRetrievals = [];

            /**
             * Internal use only
             * The list of resources pending acquisition.
             * @type {Array}
             * @ignore
             */
            this.absentResourceList = new AbsentResourceList(3, 5e3);

            /**
             * Internal use only
             * The factory to create URLs for data requests. This property is typically set in the constructor of child classes.
             * See {@link WcsTileUrlBuilder} and {@link WmsUrlBuilder} for concrete examples.
             * @type {Object}
             * @ignore
             */
            this.urlBuilder = null;
        };

        TiledElevationCoverage.prototype = Object.create(ElevationCoverage.prototype);

        // Documented in super class
        TiledElevationCoverage.prototype.minAndMaxElevationsForSector = function (sector) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "minAndMaxElevationsForSector", "missingSector"));
            }

            var level = this.levels.levelForTexelSize(sector.deltaLatitude() * Angle.DEGREES_TO_RADIANS / 64);
            this.assembleTiles(level, sector, false);

            if (this.currentTiles.length === 0) {
                return null; // Sector is outside the coverage's coverage area. Do not modify the result array.
            }

            // Assign the output extreme elevations to the largest and smallest double values, respectively. This has the effect
            // of expanding the extremes with each subsequent tile as needed. If we initialized this array with zeros then the
            // output extreme elevations would always contain zero, even when the range of the image's extreme elevations in the
            // sector does not contain zero.
            var min = Number.MAX_VALUE,
                max = -min,
                image,
                imageMin,
                imageMax,
                result = [];

            for (var i = 0, len = this.currentTiles.length; i < len; i++) {
                image = this.currentTiles[i].image();
                if (image) {
                    imageMin = image.minElevation;
                    if (min > imageMin) {
                        min = imageMin;
                    }

                    imageMax = image.maxElevation;
                    if (max < imageMax) {
                        max = imageMax;
                    }
                } else {
                    result[0] = this.minElevation;
                    result[1] = this.maxElevation;
                    return result; // At least one tile image is not in memory; return the model's extreme elevations.
                }
            }

            result[0] = min;
            result[1] = max;

            return result;
        };

        // Documented in super class
        TiledElevationCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
            if (!this.coverageSector.containsLocation(latitude, longitude)) {
                return 0; // location is outside the coverage's coverage
            }

            return this.pointElevationForLocation(latitude, longitude);
        };

        // Documented in super class
        TiledElevationCoverage.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "elevationsForSector", "missingSector"));
            }

            if (!result) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "elevationsForSector", "missingResult"));
            }

            if (!numLat || !numLon || numLat < 1 || numLon < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiledElevationCoverage", "constructor",
                        "The specified number of latitudinal or longitudinal positions is less than one."));
            }

            var level = this.levels.levelForTexelSize(targetResolution);
            if (this.pixelIsPoint) {
                return this.pointElevationsForGrid(sector, numLat, numLon, level, result);
            } else {
                return this.areaElevationsForGrid(sector, numLat, numLon, level, result);
            }
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.pointElevationForLocation = function (latitude, longitude) {
            var level = this.levels.lastLevel(),
                deltaLat = level.tileDelta.latitude,
                deltaLon = level.tileDelta.longitude,
                r = Tile.computeRow(deltaLat, latitude),
                c = Tile.computeColumn(deltaLon, longitude),
                tile,
                image = null;

            for (var i = level.levelNumber; i >= 0; i--) {
                tile = this.tileCache.entryForKey(i + "." + r + "." + c);
                if (tile) {
                    image = tile.image();
                    if (image) {
                        return image.elevationAtLocation(latitude, longitude);
                    }
                }

                r = Math.floor(r / 2);
                c = Math.floor(c / 2);
            }

            return 0; // did not find a tile with an image
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.pointElevationsForGrid = function (sector, numLat, numLon, level, result) {
            var maxResolution = 0,
                resolution;

            this.assembleTiles(level, sector, true);
            if (this.currentTiles.length === 0) {
                return 0; // Sector is outside the coverage's coverage area. Do not modify the results array.
            }

            // Sort from lowest resolution to highest so that higher resolutions override lower resolutions in the
            // loop below.
            this.currentTiles.sort(function (tileA, tileB) {
                return tileA.level.levelNumber - tileB.level.levelNumber;
            });

            for (var i = 0, len = this.currentTiles.length; i < len; i++) {
                var tile = this.currentTiles[i],
                    image = tile.image();

                if (image) {
                    image.elevationsForGrid(sector, numLat, numLon, result);
                    resolution = tile.level.texelSize;

                    if (maxResolution < resolution) {
                        maxResolution = resolution;
                    }
                } else {
                    maxResolution = Number.MAX_VALUE;
                }
            }

            return maxResolution;
        };

        // Internal. Returns elevations for a grid assuming pixel-is-area.
        TiledElevationCoverage.prototype.areaElevationsForGrid = function (sector, numLat, numLon, level, result) {
            var minLat = sector.minLatitude,
                maxLat = sector.maxLatitude,
                minLon = sector.minLongitude,
                maxLon = sector.maxLongitude,
                deltaLat = sector.deltaLatitude() / (numLat > 1 ? numLat - 1 : 1),
                deltaLon = sector.deltaLongitude() / (numLon > 1 ? numLon - 1 : 1),
                lat, lon, s, t,
                latIndex, lonIndex, resultIndex = 0;

            for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex += 1, lat += deltaLat) {
                if (latIndex === numLat - 1) {
                    lat = maxLat; // explicitly set the last lat to the max latitude ensure alignment
                }

                for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex += 1, lon += deltaLon) {
                    if (lonIndex === numLon - 1) {
                        lon = maxLon; // explicitly set the last lon to the max longitude ensure alignment
                    }

                    if (this.coverageSector.containsLocation(lat, lon)) { // ignore locations outside of the model
                        s = (lon + 180) / 360;
                        t = (lat + 90) / 180;
                        this.areaElevationForCoord(s, t, level.levelNumber, result, resultIndex);
                    }

                    resultIndex++;
                }
            }

            return level.texelSize; // TODO: return the actual achieved
        };

        // Internal. Returns an elevation for a location assuming pixel-is-area.
        TiledElevationCoverage.prototype.areaElevationForCoord = function (s, t, levelNumber, result, resultIndex) {
            var level, levelWidth, levelHeight,
                tMin, tMax,
                vMin, vMax,
                u, v,
                x0, x1, y0, y1,
                xf, yf,
                retrieveTiles,
                pixels = new Float64Array(4);

            for (var i = levelNumber; i >= 0; i--) {
                level = this.levels.level(i);
                levelWidth = Math.round(level.tileWidth * 360 / level.tileDelta.longitude);
                levelHeight = Math.round(level.tileHeight * 180 / level.tileDelta.latitude);
                tMin = 1 / (2 * levelHeight);
                tMax = 1 - tMin;
                vMin = 0;
                vMax = levelHeight - 1;
                u = levelWidth * WWMath.fract(s); // wrap the horizontal coordinate
                v = levelHeight * WWMath.clamp(t, tMin, tMax); // clamp the vertical coordinate to the level edge
                x0 = WWMath.mod(Math.floor(u - 0.5), levelWidth);
                x1 = WWMath.mod((x0 + 1), levelWidth);
                y0 = WWMath.clamp(Math.floor(v - 0.5), vMin, vMax);
                y1 = WWMath.clamp(y0 + 1, vMin, vMax);
                xf = WWMath.fract(u - 0.5);
                yf = WWMath.fract(v - 0.5);
                retrieveTiles = (i == levelNumber) || (i == 0);

                if (this.lookupPixels(x0, x1, y0, y1, level, retrieveTiles, pixels)) {
                    result[resultIndex] = (1 - xf) * (1 - yf) * pixels[0] +
                        xf * (1 - yf) * pixels[1] +
                        (1 - xf) * yf * pixels[2] +
                        xf * yf * pixels[3];
                    return;
                }
            }
        };

        // Internal. Bilinearly interpolates tile-image elevations.
        TiledElevationCoverage.prototype.lookupPixels = function (x0, x1, y0, y1, level, retrieveTiles, result) {
            var levelNumber = level.levelNumber,
                tileWidth = level.tileWidth,
                tileHeight = level.tileHeight,
                row0 = Math.floor(y0 / tileHeight),
                row1 = Math.floor(y1 / tileHeight),
                col0 = Math.floor(x0 / tileWidth),
                col1 = Math.floor(x1 / tileWidth),
                r0c0, r0c1, r1c0, r1c1;

            if (row0 == row1 && row0 == this.cachedRow && col0 == col1 && col0 == this.cachedCol) {
                r0c0 = r0c1 = r1c0 = r1c1 = this.cachedImage; // use results from previous lookup
            } else if (row0 == row1 && col0 == col1) {
                r0c0 = this.lookupImage(levelNumber, row0, col0, retrieveTiles); // only need to lookup one image
                r0c1 = r1c0 = r1c1 = r0c0; // re-use the single image
                this.cachedRow = row0;
                this.cachedCol = col0;
                this.cachedImage = r0c0; // note the results for subsequent lookups
            } else {
                r0c0 = this.lookupImage(levelNumber, row0, col0, retrieveTiles);
                r0c1 = this.lookupImage(levelNumber, row0, col1, retrieveTiles);
                r1c0 = this.lookupImage(levelNumber, row1, col0, retrieveTiles);
                r1c1 = this.lookupImage(levelNumber, row1, col1, retrieveTiles);
            }

            if (r0c0 && r0c1 && r1c0 && r1c1) {
                result[0] = r0c0.pixel(x0 % tileWidth, y0 % tileHeight);
                result[1] = r0c1.pixel(x1 % tileWidth, y0 % tileHeight);
                result[2] = r1c0.pixel(x0 % tileWidth, y1 % tileHeight);
                result[3] = r1c1.pixel(x1 % tileWidth, y1 % tileHeight);
                return true;
            }

            return false;
        };

        // Internal. Intentionally not documented.
        TiledElevationCoverage.prototype.lookupImage = function (levelNumber, row, column, retrieveTiles) {
            var tile = this.tileForLevel(levelNumber, row, column),
                image = tile.image();

            // If the tile's elevations have expired, cause it to be re-retrieved. Note that the current,
            // expired elevations are still used until the updated ones arrive.
            if (image == null && retrieveTiles) {
                this.retrieveTileImage(tile);
            }

            return image;
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.createTile = function (sector, level, row, column) {
            var imagePath = this.cachePath + "/" + level.levelNumber + "/" + row + "/" + row + "_" + column + ".bil";

            return new ElevationTile(sector, level, row, column, imagePath, this.imageCache);
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.assembleTiles = function (level, sector, retrieveTiles) {
            this.currentTiles = [];

            // Intersect the requested sector with the coverage's coverage area. This avoids attempting to assemble tiles
            // that are outside the coverage area.
            this.currentSector.copy(sector);
            this.currentSector.intersection(this.coverageSector);

            if (this.currentSector.isEmpty())
                return; // sector is outside the coverage's coverage area

            var deltaLat = level.tileDelta.latitude,
                deltaLon = level.tileDelta.longitude,
                firstRow = Tile.computeRow(deltaLat, this.currentSector.minLatitude),
                lastRow = Tile.computeLastRow(deltaLat, this.currentSector.maxLatitude),
                firstCol = Tile.computeColumn(deltaLon, this.currentSector.minLongitude),
                lastCol = Tile.computeLastColumn(deltaLon, this.currentSector.maxLongitude);

            for (var row = firstRow; row <= lastRow; row++) {
                for (var col = firstCol; col <= lastCol; col++) {
                    this.addTileOrAncestor(level, row, col, retrieveTiles);
                }
            }
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.addTileOrAncestor = function (level, row, column, retrieveTiles) {
            var tile = this.tileForLevel(level.levelNumber, row, column);

            if (this.isTileImageInMemory(tile)) {
                this.addToCurrentTiles(tile);
            } else {
                if (retrieveTiles) {
                    this.retrieveTileImage(tile);
                }

                if (level.isFirstLevel()) {
                    this.currentTiles.push(tile); // no ancestor tile to add
                } else {
                    this.addAncestor(level, row, column, retrieveTiles);
                }
            }
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.addAncestor = function (level, row, column, retrieveTiles) {
            var tile = null,
                r = Math.floor(row / 2),
                c = Math.floor(column / 2);

            for (var i = level.levelNumber - 1; i >= 0; i--) {
                tile = this.tileForLevel(i, r, c);
                if (this.isTileImageInMemory(tile)) {
                    this.addToCurrentTiles(tile);
                    return;
                }

                r = Math.floor(r / 2);
                c = Math.floor(c / 2);
            }

            // No ancestor tiles have an in-memory image. Retrieve the ancestor tile corresponding for the first level, and
            // add it. We add the necessary tiles to provide coverage over the requested sector in order to accurately return
            // whether or not this coverage has data for the entire sector.
            this.addToCurrentTiles(tile);

            if (retrieveTiles) {
                this.retrieveTileImage(tile);
            }
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.addToCurrentTiles = function (tile) {
            this.currentTiles.push(tile);
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.tileForLevel = function (levelNumber, row, column) {
            var tileKey = levelNumber + "." + row + "." + column,
                tile = this.tileCache.entryForKey(tileKey);

            if (tile) {
                return tile;
            }

            var level = this.levels.level(levelNumber),
                sector = Tile.computeSector(level, row, column);

            tile = this.createTile(sector, level, row, column);
            this.tileCache.putEntry(tileKey, tile, tile.size());

            return tile;
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.isTileImageInMemory = function (tile) {
            return this.imageCache.containsKey(tile.imagePath);
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.resourceUrlForTile = function (tile) {
            return this.urlBuilder.urlForTile(tile, this.retrievalImageFormat);
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.retrieveTileImage = function (tile) {
            if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
                var url = this.resourceUrlForTile(tile, this.retrievalImageFormat),
                    xhr = new XMLHttpRequest(),
                    elevationModel = this;

                if (!url)
                    return;

                xhr.open("GET", url, true);
                xhr.responseType = 'arraybuffer';
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        elevationModel.removeFromCurrentRetrievals(tile.imagePath);

                        var contentType = xhr.getResponseHeader("content-type");

                        if (xhr.status === 200) {
                            if (contentType === elevationModel.retrievalImageFormat
                                || contentType === "text/plain"
                                || contentType === "application/octet-stream") {
                                Logger.log(Logger.LEVEL_INFO, "Elevations retrieval succeeded: " + url);
                                elevationModel.loadElevationImage(tile, xhr);
                                elevationModel.absentResourceList.unmarkResourceAbsent(tile.imagePath);

                                // Send an event to request a redraw.
                                var e = document.createEvent('Event');
                                e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                                window.dispatchEvent(e);
                            } else if (contentType === "text/xml") {
                                elevationModel.absentResourceList.markResourceAbsent(tile.imagePath);
                                Logger.log(Logger.LEVEL_WARNING,
                                    "Elevations retrieval failed (" + xhr.statusText + "): " + url + ".\n "
                                    + String.fromCharCode.apply(null, new Uint8Array(xhr.response)));
                            } else {
                                elevationModel.absentResourceList.markResourceAbsent(tile.imagePath);
                                Logger.log(Logger.LEVEL_WARNING,
                                    "Elevations retrieval failed: " + url + ". " + "Unexpected content type "
                                    + contentType);
                            }
                        } else {
                            elevationModel.absentResourceList.markResourceAbsent(tile.imagePath);
                            Logger.log(Logger.LEVEL_WARNING,
                                "Elevations retrieval failed (" + xhr.statusText + "): " + url);
                        }
                    }
                };

                xhr.onerror = function () {
                    elevationModel.removeFromCurrentRetrievals(tile.imagePath);
                    elevationModel.absentResourceList.markResourceAbsent(tile.imagePath);
                    Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval failed: " + url);
                };

                xhr.ontimeout = function () {
                    elevationModel.removeFromCurrentRetrievals(tile.imagePath);
                    elevationModel.absentResourceList.markResourceAbsent(tile.imagePath);
                    Logger.log(Logger.LEVEL_WARNING, "Elevations retrieval timed out: " + url);
                };

                xhr.send(null);

                this.currentRetrievals.push(tile.imagePath);
            }
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.removeFromCurrentRetrievals = function (imagePath) {
            var index = this.currentRetrievals.indexOf(imagePath);
            if (index > -1) {
                this.currentRetrievals.splice(index, 1);
            }
        };

        // Intentionally not documented.
        TiledElevationCoverage.prototype.loadElevationImage = function (tile, xhr) {
            var elevationImage = new ElevationImage(tile.imagePath, tile.sector, tile.tileWidth, tile.tileHeight);

            if (this.retrievalImageFormat == "application/bil16") {
                elevationImage.imageData = new Int16Array(xhr.response);
                elevationImage.size = elevationImage.imageData.length * 2;
            } else if (this.retrievalImageFormat == "application/bil32") {
                elevationImage.imageData = new Float32Array(xhr.response);
                elevationImage.size = elevationImage.imageData.length * 4;
            }

            if (elevationImage.imageData) {
                elevationImage.findMinAndMaxElevation();
                this.imageCache.putEntry(tile.imagePath, elevationImage, elevationImage.size);
                this.timestamp = Date.now();
            }
        };

        // Documented in super class
        TiledElevationCoverage.prototype.getBestResolution = function (sector) {
            if (!sector)
                return this.levels.lastLevel().texelSize;

            var level = this.levels.lastLevel();
            return level.sector.intersection(sector) ? level.texelSize : Number.MAX_VALUE;
        };

        return TiledElevationCoverage;
    });