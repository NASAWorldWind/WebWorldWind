/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
define([
    'test/CustomMatchers.test',
    'src/geom/Sector',
    'src/geom/TileMatrix',
    'src/geom/TileMatrixSet'

], function (CustomMatchers, Sector, TileMatrix, TileMatrixSet) {
    "use strict";

    beforeEach(function () {
        jasmine.addMatchers(CustomMatchers);
    });

    describe("TileMatrixSet fromTilePyramid for global coverage", function () {
        var sector = Sector.FULL_SPHERE;
        var matrixWidth = 4;
        var matrixHeight = 2;
        var tileWidth = 256;
        var tileHeight = 256;
        var numLevels = 10;

        it("should create 10 levels", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            expect(tileMatrixSet.entries.length).toBe(10);
        });

        it("should divide subsequent tile matrices", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            var previousWidth = matrixWidth, previousHeight = matrixHeight;
            for (var idx = 1; idx < tileMatrixSet.entries.length; idx++) {
                expect(tileMatrixSet.entries[idx].matrixWidth).toBe(previousWidth * 2);
                expect(tileMatrixSet.entries[idx].matrixHeight).toBe(previousHeight * 2);
                previousWidth = tileMatrixSet.entries[idx].matrixWidth;
                previousHeight = tileMatrixSet.entries[idx].matrixHeight;
            }
        });

        it("should maintain the same geographic region for each TileMatrix", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            for (var idx = 1; idx < tileMatrixSet.entries.length; idx++) {
                expect(tileMatrixSet.entries[idx].sector).toBeSector(sector);
            }
        });

        it("should always keep the tileWidth and tileHeight consistent", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            for (var idx = 1; idx < tileMatrixSet.entries.length; idx++) {
                expect(tileMatrixSet.entries[idx].tileWidth).toBeSector(tileWidth);
                expect(tileMatrixSet.entries[idx].tileHeight).toBeSector(tileHeight);
            }
        });
    });

    describe("TileMatrixSet fromTilePyramid for regional coverage", function () {
        var sector = new Sector(0, 90, 0, 90);
        var matrixWidth = 2;
        var matrixHeight = 2;
        var tileWidth = 256;
        var tileHeight = 256;
        var numLevels = 10;

        it("should create 10 levels", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            expect(tileMatrixSet.entries.length).toBe(10);
        });

        it("should divide subsequent tile matrices", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            var previousWidth = matrixWidth, previousHeight = matrixHeight;
            for (var idx = 1; idx < tileMatrixSet.entries.length; idx++) {
                expect(tileMatrixSet.entries[idx].matrixWidth).toBe(previousWidth * 2);
                expect(tileMatrixSet.entries[idx].matrixHeight).toBe(previousHeight * 2);
                previousWidth = tileMatrixSet.entries[idx].matrixWidth;
                previousHeight = tileMatrixSet.entries[idx].matrixHeight;
            }
        });

        it("should maintain the same geographic region for each TileMatrix", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            for (var idx = 1; idx < tileMatrixSet.entries.length; idx++) {
                expect(tileMatrixSet.entries[idx].sector).toBeSector(sector);
            }
        });

        it("should always keep the tileWidth and tileHeight consistent", function () {
            var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

            for (var idx = 1; idx < tileMatrixSet.entries.length; idx++) {
                expect(tileMatrixSet.entries[idx].tileWidth).toBeSector(tileWidth);
                expect(tileMatrixSet.entries[idx].tileHeight).toBeSector(tileHeight);
            }
        });
    });

    describe("TileMatrixSet indexOfMatrixNearest global coverage", function () {
        var sector = Sector.FULL_SPHERE;
        var matrixWidth = 4;
        var matrixHeight = 2;
        var tileWidth = 256;
        var tileHeight = 256;
        var numLevels = 10;
        var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

        it("should find the nearest resolution for level 5", function () {
            var expectedLevel = 5;
            var calculatedResolutionLevel5 = sector.deltaLatitude() / (tileHeight * Math.pow(matrixHeight, expectedLevel + 1));

            var actualLevel = tileMatrixSet.indexOfMatrixNearest(calculatedResolutionLevel5);

            expect(actualLevel).toBe(expectedLevel);
        });
    });

    describe("TileMatrixSet indexOfMatrixNearest global coverage", function () {
        var sector = new Sector(0, 90, 0, 90);
        var matrixWidth = 4;
        var matrixHeight = 2;
        var tileWidth = 256;
        var tileHeight = 256;
        var numLevels = 10;
        var tileMatrixSet = TileMatrixSet.fromTilePyramid(sector, matrixWidth, matrixHeight, tileWidth, tileHeight, numLevels);

        it("should find the nearest resolution for level 5", function () {
            var expectedLevel = 5;
            var calculatedResolutionLevel5 = sector.deltaLatitude() / (tileHeight * Math.pow(matrixHeight, expectedLevel + 1));

            var actualLevel = tileMatrixSet.indexOfMatrixNearest(calculatedResolutionLevel5);

            expect(actualLevel).toBe(expectedLevel);
        });
    });
});
