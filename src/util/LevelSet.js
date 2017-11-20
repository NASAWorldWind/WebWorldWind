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
 * @exports LevelSet
 */
define([
        '../error/ArgumentError',
        '../util/Level',
        '../geom/Location',
        '../util/Logger'
    ],
    function (ArgumentError,
              Level,
              Location,
              Logger) {
        "use strict";

        /**
         * Constructs a level set.
         * @alias Level
         * @constructor
         * @classdesc Represents a multi-resolution, hierarchical collection of tiles. Applications typically do not
         * interact with this class.
         * @param {Sector} sector The sector spanned by this level set.
         * @param {Location} levelZeroDelta The geographic size of tiles in the lowest resolution level of this level set.
         * @param {Number} numLevels The number of levels in the level set.
         * @param {Number} tileWidth The height in pixels of images associated with tiles in this level set, or the number of sample
         * points in the longitudinal direction of elevation tiles associate with this level set.
         * @param {Number} tileHeight The height in pixels of images associated with tiles in this level set, or the number of sample
         * points in the latitudinal direction of elevation tiles associate with this level set.
         * @throws {ArgumentError} If the specified sector or level-zero-delta is null or undefined, the level zero
         * delta values are less than or equal to zero, or any of the number-of-levels, tile-width or tile-height
         * arguments are less than 1.
         */
        var LevelSet = function (sector, levelZeroDelta, numLevels, tileWidth, tileHeight) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LevelSet", "constructor", "missingSector"));
            }

            if (!levelZeroDelta) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LevelSet", "constructor",
                        "The specified level zero delta is null or undefined"));
            }

            if (levelZeroDelta.latitude <= 0 || levelZeroDelta.longitude <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LevelSet", "constructor",
                        "The specified level zero delta is less than or equal to zero."));
            }

            if (numLevels < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LevelSet", "constructor",
                        "The specified number of levels is less than one."));
            }

            if (tileWidth < 1 || tileHeight < 1) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LevelSet", "constructor",
                        "The specified tile width or tile height is less than one."));
            }

            /**
             * The sector spanned by this level set.
             * @type {Sector}
             * @readonly
             */
            this.sector = sector;

            /**
             * The geographic size of the lowest resolution (level 0) tiles in this level set.
             * @type {Location}
             * @readonly
             */
            this.levelZeroDelta = levelZeroDelta;

            /**
             * The number of levels in this level set.
             * @type {Number}
             * @readonly
             */
            this.numLevels = numLevels;

            /**
             *  The width in pixels of images associated with tiles in this level set, or the number of sample points
             *  in the longitudinal direction of elevation tiles associated with this level set.
             * @type {Number}
             * @readonly
             */
            this.tileWidth = tileWidth;

            /**
             *  The height in pixels of images associated with tiles in this level set, or the number of sample points
             *  in the latitudinal direction of elevation tiles associated with this level set.
             * @type {Number}
             * @readonly
             */
            this.tileHeight = tileHeight;

            this.levels = [];

            for (var i = 0; i < numLevels; i += 1) {
                var n = Math.pow(2, i),
                    latDelta = levelZeroDelta.latitude / n,
                    lonDelta = levelZeroDelta.longitude / n,
                    tileDelta = new Location(latDelta, lonDelta),
                    level = new Level(i, tileDelta, this);

                this.levels[i] = level;
            }
        };

        /**
         * Returns the {@link Level} for a specified level number.
         * @param {Number} levelNumber The number of the desired level.
         * @returns {Level} The requested level, or null if the level does not exist.
         */
        LevelSet.prototype.level = function(levelNumber) {
            if (levelNumber < 0 || levelNumber >= this.levels.length) {
                return null;
            } else {
                return this.levels[levelNumber];
            }
        };

        /**
         * Returns the level with a specified texel size.
         * This function returns the first level if the specified texel size is greater than the first level's texel
         * size, and returns the last level if the delta is less than the last level's texel size.
         * @param {Number} texelSize The size of pixels or elevation cells in the level, in radians per pixel or cell.
         */
        LevelSet.prototype.levelForTexelSize = function(texelSize) {
            // TODO: Replace this loop with a computation.
            var lastLevel = this.lastLevel();

            if (lastLevel.texelSize >= texelSize) {
                return lastLevel; // Can't do any better than the last level.
            }

            for (var index = 0, length = this.levels.length; index < length; index += 1) {
                var level = this.levels[index];
                if (level.texelSize <= texelSize) {
                    return level;
                }
            }

            return lastLevel;
        };

        /**
         * Returns the first (lowest resolution) level of this level set.
         * @returns {Level} The first level of this level set.
         */
        LevelSet.prototype.firstLevel = function() {
            return this.levels[0];
        };

        /**
         * Returns the last (highest resolution) level of this level set.
         * @returns {Level} The last level of this level set.
         */
        LevelSet.prototype.lastLevel = function() {
            return this.levels[this.levels.length - 1];
        };

        return LevelSet;
    });