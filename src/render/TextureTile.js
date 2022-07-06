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
 * @exports TextureTile
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
         * Constructs a texture tile.
         * @alias TextureTile
         * @constructor
         * @augments Tile
         * @classdesc Represents an image applied to a portion of a globe's terrain. Applications typically do not
         * interact with this class.
         * @param {Sector} sector The sector this tile covers.
         * @param {Level} level The level this tile is associated with.
         * @param {Number} row This tile's row in the associated level.
         * @param {Number} column This tile's column in the associated level.
         * @throws {ArgumentError} If the specified sector or level is null or undefined, the row or column arguments
         * are less than zero, or the specified image path is null, undefined or empty.
         *
         */
        var TextureTile = function (sector, level, row, column) {
            Tile.call(this, sector, level, row, column); // args are checked in the superclass' constructor

            /**
             * GPU cache key
             * @type {string}
             */
            this.gpuCacheKey = null;
        };

        TextureTile.prototype = Object.create(Tile.prototype);

        /**
         * Returns the size of the this tile in bytes.
         * @returns {Number} The size of this tile in bytes, not including the associated texture size.
         */
        TextureTile.prototype.size = function () {
            return Tile.prototype.size.call(this);
        };

        /**
         * Causes this tile's texture to be active. Implements [SurfaceTile.bind]{@link SurfaceTile#bind}.
         * @param {DrawContext} dc The current draw context.
         * @returns {Boolean} true if the texture was bound successfully, otherwise false.
         */
        TextureTile.prototype.bind = function (dc) {
            var texture = dc.gpuResourceCache.resourceForKey(this.gpuCacheKey);
            if (texture) {
                return texture.bind(dc);
            }

            return false;
        };

        /**
         * If this tile's fallback texture is used, applies the appropriate texture transform to a specified matrix.
         * Otherwise, this is a no-op.
         * @param {DrawContext} dc The current draw context.
         * @param {Matrix} matrix The matrix to apply the transform to.
         */
        TextureTile.prototype.applyInternalTransform = function (dc, matrix) {
            // Override this method if the tile has a fallback texture.
        };

        return TextureTile;
    });