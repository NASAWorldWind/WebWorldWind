/*
 * Copyright 2015-2017 WorldWind Contributors
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
 * @exports ElevationTile
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../util/Tile'
    ],
    function (ArgumentError,
              Logger,
              Tile) {
        "use strict";

        /**
         * Constructs an elevation tile.
         * @alias ElevationTile
         * @constructor
         * @augments Tile
         * @classdesc Represents a region of elevations. Applications typically do not interact directly with this class.
         * @param {Sector} sector The sector this tile covers.
         * @param {Level} level The level this tile is associated with.
         * @param {Number} row This tile's row in the associated level.
         * @param {Number} column This tile's column in the associated level.
         * @param {String} imagePath The full path to the image.
         * @param {MemoryCache} cache The cache to use for caching this elevation tile.
         * @throws {ArgumentError} If the specified sector or level is null or undefined, the row or column arguments
         * are less than zero, or the specified image path is null, undefined or empty.
         *
         */
        var ElevationTile = function (sector, level, row, column, imagePath, cache) {
            if (!imagePath || (imagePath.length < 1)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationTile", "constructor",
                        "The specified image path is null, undefined or zero length."));
            }

            if (!cache) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ElevationTile", "constructor",
                        "The specified cache is null or undefined."));
            }

            Tile.call(this, sector, level, row, column); // args are checked in the superclass' constructor

            /**
             * This tile's image path.
             * @type {String}
             */
            this.imagePath = imagePath;

            this.memoryCache = cache;
        };

        ElevationTile.prototype = Object.create(Tile.prototype);

        /**
         * Returns the size of the this tile in bytes.
         * @returns {Number} The size of this tile in bytes, not including the associated elevations image size.
         */
        ElevationTile.prototype.size = function () {
            return Tile.prototype.size.call(this) + this.imagePath.length + 8;
        };

        /**
         * Returns the {@link ElevationImage} associated with this tile.
         * @returns {ElevationImage} The elevation image associated with this tile, or null if that image is
         * currently not in the elevation image cache.
         */
        ElevationTile.prototype.image = function () {
            return this.memoryCache.entryForKey(this.imagePath);
        };

        return ElevationTile;
    });