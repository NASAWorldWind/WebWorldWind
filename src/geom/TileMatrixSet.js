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
 * @exports TileMatrixSet
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../geom/Sector',
        '../geom/TileMatrix'
    ],
    function (ArgumentError,
              Logger,
              Sector,
              TileMatrix) {
        "use strict";

        var TileMatrixSet = function(sector, tileMatrixList) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "constructor", "missingSector"));
            }

            if (!tileMatrixList) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "constructor",
                        "The specified TileMatrix list is null or undefined."));
            }

            this.sector = new Sector(sector.minLatitude, sector.maxLatitude, sector.minLongitude, sector.maxLongitude);

            this.entries = [];
            for (var i = 0, len = tileMatrixList.length; i < len; i++) {
                entries.push(tileMatrixList[i]);
            }
        };

        TileMatrixSet.createQuadTreeTileMatrixSet = function (sector, matrixWidth, matrixHeight, tileWidth, numLevels) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "createQuadTreeTileMatrixSet",
                        "missingSector"));
            }

            if (matrixWidth <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "createQuadTreeTileMatrixSet",
                        "The specified matrix width is invalid"));
            }

            if (matrixHeight <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "createQuadTreeTileMatrixSet",
                        "The specified matrix height is invalid"));
            }

            if (tileWidth <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "createQuadTreeTileMatrixSet",
                        "The specified tile width is invalid"));
            }

            if (numLevels <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrixSet", "createQuadTreeTileMatrixSet",
                        "The specified number of levels is invalid"));
            }

            var tileMatrices = [], matrix, idx;

            for (idx = 0; idx < numLevels; idx++) {
                matrix = new TileMatrix();
                matrix.sector.copy(sector);
                matrix.ordinal = idx;
                matrix.matrixWidth = matrixWidth;
                matrix.matrixHeight = matrixHeight;
                matrix.tileWidth = tileWidth;
                matrix.tileHeight = tileHeight;
                tileMatrices.push(matrix);

                matrixWidth *= 2;
                matrixHeight *= 2;
            }

            return new TileMatrixSet(sector, tileMatrices);
        };

        TileMatrixSet.prototype.count = function () {
            return this.entries.length;
        };

        TileMatrixSet.prototype.matrix = function (index) {
            if (index < 0 || index >= this.entries.length) {
                return null;
            } else {
                return this.entries[index];
            }
        };

        return TileMatrixSet;
    });
