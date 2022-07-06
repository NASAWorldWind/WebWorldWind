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
 * @exports SurfaceTileRenderer
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../geom/Matrix',
        '../shapes/SurfaceShapeTile',
        '../shaders/SurfaceTileRendererProgram'
    ],
    function (ArgumentError,
              Logger,
              Matrix,
              SurfaceShapeTile,
              SurfaceTileRendererProgram) {
        "use strict";

        /**
         * Constructs a new surface tile renderer.
         * @alias SurfaceTileRenderer
         * @constructor
         * @classdesc This class is responsible for rendering imagery onto the terrain.
         * It is meant to be used internally. Applications typically do not interact with this class.
         */
        var SurfaceTileRenderer = function () {

            // Scratch values to avoid constantly recreating these matrices.
            this.texMaskMatrix = Matrix.fromIdentity();
            this.texSamplerMatrix = Matrix.fromIdentity();

            // Internal. Intentionally not documented.
            this.isSurfaceShapeTileRendering = false;
        };

        /**
         * Render a specified collection of surface tiles.
         * @param {DrawContext} dc The current draw context.
         * @param {SurfaceTile[]} surfaceTiles The surface tiles to render.
         * @param {Number} opacity The opacity at which to draw the surface tiles.
         * @param {Boolean} tilesHaveOpacity If true, incoming tiles each have their own opacity property and
         * it's value is applied when the tile is drawn.
         * @throws {ArgumentError} If the specified surface tiles array is null or undefined.
         */
        SurfaceTileRenderer.prototype.renderTiles = function (dc, surfaceTiles, opacity, tilesHaveOpacity) {
            if (!surfaceTiles) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTileRenderer", "renderTiles",
                        "Specified surface tiles array is null or undefined."));
            }

            if (surfaceTiles.length < 1)
                return;

            var terrain = dc.terrain,
                gl = dc.currentGlContext,
                tileCount = 0,// for frame statistics,
                program,
                terrainTile,
                terrainTileSector,
                surfaceTile,
                currentTileOpacity = 1;

            if (!terrain)
                return;

            this.isSurfaceShapeTileRendering = surfaceTiles[0] instanceof SurfaceShapeTile;

            opacity *= dc.surfaceOpacity;

            // For each terrain tile, render it for each overlapping surface tile.
            program = this.beginRendering(dc, opacity);
            terrain.beginRendering(dc);
            try {
                for (var i = 0, ttLen = terrain.surfaceGeometry.length; i < ttLen; i++) {
                    terrainTile = terrain.surfaceGeometry[i];
                    terrainTileSector = terrainTile.sector;

                    terrain.beginRenderingTile(dc, terrainTile);
                    try {
                        // Render the terrain tile for each overlapping surface tile.
                        for (var j = 0, stLen = surfaceTiles.length; j < stLen; j++) {
                            surfaceTile = surfaceTiles[j];
                            if (surfaceTile.sector.overlaps(terrainTileSector)) {
                                if (surfaceTile.bind(dc)) {
                                    if (dc.pickingMode) {
                                        if (surfaceTile.pickColor) {
                                            program.loadColor(gl, surfaceTile.pickColor);
                                        } else {
                                            // Surface shape tiles don't use a pick color. Pick colors are encoded into
                                            // the colors of the individual shapes drawn into the tile.
                                        }
                                    } else {
                                        if (tilesHaveOpacity && surfaceTile.opacity != currentTileOpacity) {
                                            program.loadOpacity(gl, opacity * surfaceTile.opacity);
                                            currentTileOpacity = surfaceTile.opacity;
                                        }
                                    }

                                    this.applyTileState(dc, terrainTile, surfaceTile);
                                    terrain.renderTile(dc, terrainTile);
                                    ++tileCount;
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    finally {
                        terrain.endRenderingTile(dc, terrainTile);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
            finally {
                terrain.endRendering(dc);
                this.endRendering(dc);
                dc.frameStatistics.incrementRenderedTileCount(tileCount);
            }
        };

        // Intentionally not documented.
        SurfaceTileRenderer.prototype.beginRendering = function (dc, opacity) {
            var gl = dc.currentGlContext,
                program = dc.findAndBindProgram(SurfaceTileRendererProgram);
            program.loadTexSampler(gl, gl.TEXTURE0);

            if (dc.pickingMode && !this.isSurfaceShapeTileRendering) {
                program.loadModulateColor(gl, true);
            } else {
                program.loadModulateColor(gl, false);
                program.loadOpacity(gl, opacity);
            }

            return program;
        };

        // Intentionally not documented.
        SurfaceTileRenderer.prototype.endRendering = function (dc) {
            var gl = dc.currentGlContext;
            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        // Intentionally not documented.
        SurfaceTileRenderer.prototype.applyTileState = function (dc, terrainTile, surfaceTile) {
            // Sets up the texture transform and mask that applies the texture tile to the terrain tile.
            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                terrainSector = terrainTile.sector,
                terrainDeltaLat = terrainSector.deltaLatitude(),
                terrainDeltaLon = terrainSector.deltaLongitude(),
                surfaceSector = surfaceTile.sector,
                rawSurfaceDeltaLat = surfaceSector.deltaLatitude(),
                rawSurfaceDeltaLon = surfaceSector.deltaLongitude(),
                surfaceDeltaLat = rawSurfaceDeltaLat > 0 ? rawSurfaceDeltaLat : 1,
                surfaceDeltaLon = rawSurfaceDeltaLon > 0 ? rawSurfaceDeltaLon : 1,
                sScale = terrainDeltaLon / surfaceDeltaLon,
                tScale = terrainDeltaLat / surfaceDeltaLat,
                sTrans = -(surfaceSector.minLongitude - terrainSector.minLongitude) / surfaceDeltaLon,
                tTrans = -(surfaceSector.minLatitude - terrainSector.minLatitude) / surfaceDeltaLat;

            this.texMaskMatrix.set(
                sScale, 0, 0, sTrans,
                0, tScale, 0, tTrans,
                0, 0, 1, 0,
                0, 0, 0, 1
            );

            this.texSamplerMatrix.setToUnitYFlip();
            surfaceTile.applyInternalTransform(dc, this.texSamplerMatrix);
            this.texSamplerMatrix.multiplyMatrix(this.texMaskMatrix);

            program.loadTexSamplerMatrix(gl, this.texSamplerMatrix);
            program.loadTexMaskMatrix(gl, this.texMaskMatrix);
        };

        return SurfaceTileRenderer;
    }
);