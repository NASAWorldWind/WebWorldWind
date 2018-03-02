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
 * @exports TileMatrix
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../geom/Sector'
    ],
    function (ArgumentError,
              Logger,
              Sector) {
        "use strict";

        var TileMatrix = function(sector, ordinal, matrixWidth, matrixHeight) {

            this.sector = sector || new Sector();

            this.ordinal = ordinal;

            this.matrixWidth = matrixWidth;

            this.matrixHeight = matrixHeight;
        };

        TileMatrix.prototype.tileSector = function (row, column) {
            if (row < 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "tileSector",
                        "The specified row is invalid."));
            }

            if (column < 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "tileSector",
                        "The specified column is invalid."));
            }

            if (this.matrixHeight <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "tileSector",
                        "The specified matrix height is invalid."));
            }

            if (this.matrixWidth <= 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TileMatrix", "tileSector",
                        "The specified matrix width is invalid."));
            }

            var deltaLat = this.sector.deltaLatitude() / this.matrixHeight;
            var deltaLon = this.sector.deltaLongitude() / this.matrixWidth;
            var minLat = this.sector.maxLatitude() - deltaLat * (row + 1);
            var minLon = this.sector.minLongitude() + deltaLon * column;

            return new Sector(minLat, minLat + deltaLat, minLon, minLon + deltaLon);
        };

        return TileMatrix;
    });
