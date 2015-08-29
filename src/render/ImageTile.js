/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ImageTile
 * @version $Id: ImageTile.js 2941 2015-03-30 21:11:43Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../render/TextureTile',
        '../util/Tile'
    ],
    function (ArgumentError,
              Logger,
              TextureTile,
              Tile) {
        "use strict";

        /**
         * Constructs an image tile.
         * @alias ImageTile
         * @constructor
         * @classdesc Represents an image applied to a portion of a globe's terrain. Applications typically do not
         * interact with this class.
         * @augments Tile
         * @param {Sector} sector The sector this tile covers.
         * @param {Level} level The level this tile is associated with.
         * @param {Number} row This tile's row in the associated level.
         * @param {Number} column This tile's column in the associated level.
         * @param {String} imagePath The full path to the image.
         * @throws {ArgumentError} If the specified sector or level is null or undefined, the row or column arguments
         * are less than zero, or the specified image path is null, undefined or empty.
         *
         */
        var ImageTile = function (sector, level, row, column, imagePath) {
            if (!imagePath || (imagePath.length < 1)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ImageTile", "constructor",
                        "The specified image path is null, undefined or zero length."));
            }

            TextureTile.call(this, sector, level, row, column); // args are checked in the superclass' constructor

            /**
             * This tile's image path.
             * @type {String}
             */
            this.imagePath = imagePath;

            /**
             * The tile whose texture to use when this tile's texture is not available.
             * @type {Matrix}
             */
            this.fallbackTile = null;

            // Assign imagePath to gpuCacheKey (inherited from TextureTile).
            this.gpuCacheKey = imagePath;
        };

        ImageTile.prototype = Object.create(TextureTile.prototype);

        /**
         * Returns the size of the this tile in bytes.
         * @returns {Number} The size of this tile in bytes, not including the associated texture size.
         */
        ImageTile.prototype.size = function () {
            return this.__proto__.__proto__.size.call(this) + this.imagePath.length + 8;
        };

        /**
         * Causes this tile's texture to be active. Implements [SurfaceTile.bind]{@link SurfaceTile#bind}.
         * @param {DrawContext} dc The current draw context.
         * @returns {Boolean} true if the texture was bound successfully, otherwise false.
         */
        ImageTile.prototype.bind = function (dc) {
            // Attempt to bind in TextureTile first.
            var isBound = this.__proto__.__proto__.bind.call(this, dc);
            if (isBound) {
                return true;
            }

            if (this.fallbackTile) {
                return this.fallbackTile.bind(dc);
            }

            return false;
        };

        /**
         * If this tile's fallback texture is used, applies the appropriate texture transform to a specified matrix.
         * @param {DrawContext} dc The current draw context.
         * @param {Matrix} matrix The matrix to apply the transform to.
         */
        ImageTile.prototype.applyInternalTransform = function (dc, matrix) {
            if (this.fallbackTile && !(dc.gpuResourceCache.resourceForKey(this.imagePath))) {
                // Must apply a texture transform to map the tile's sector into its fallback's image.
                this.applyFallbackTransform(matrix);
            }
        };

        // Intentionally not documented.
        ImageTile.prototype.applyFallbackTransform = function (matrix) {
            var deltaLevel = this.level.levelNumber - this.fallbackTile.level.levelNumber;
            if (deltaLevel <= 0)
                return;

            var twoN = 2 << (deltaLevel - 1),
                sxy = 1 / twoN,
                tx = sxy * (this.column % twoN),
                ty = sxy * (this.row % twoN);

            // Apply a transform to the matrix that maps texture coordinates for this tile to texture coordinates for the
            // fallback tile. Rather than perform the full set of matrix operations, a single multiply is performed with the
            // precomputed non-zero values:
            //
            // Matrix trans = Matrix.fromTranslation(tx, ty, 0);
            // Matrix scale = Matrix.fromScale(sxy, sxy, 1);
            // matrix.multiply(trans);
            // matrix.multiply(scale);

            matrix.multiply(
                sxy, 0, 0, tx,
                0, sxy, 0, ty,
                0, 0, 1, 0,
                0, 0, 0, 1);
        };

        return ImageTile;
    });