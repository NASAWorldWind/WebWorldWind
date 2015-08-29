/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TerrainTileList
 * @version $Id: TerrainTileList.js 2758 2015-02-09 00:20:46Z tgaskins $
 */
define(['../error/ArgumentError',
        '../util/Logger',
        '../geom/Sector'
    ],
    function (ArgumentError,
              Logger,
              Sector) {
        "use strict";

        /**
         * Constructs a terrain tile list, a container for terrain tiles that also has a tessellator and a sector
         * associated with it.
         * @alias TerrainTileList
         * @constructor
         * @classdesc Represents a portion of a globe's terrain.
         * @param {Tessellator} tessellator The tessellator that created this terrain tile list.
         *
         */
        var TerrainTileList = function TerrainTileList(tessellator) {
            if (!tessellator) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TerrainTileList", "TerrainTileList", "missingTessellator"));
            }
            this.tessellator = tessellator;
            this.sector = null;
            this.tileArray = [];
        };

        Object.defineProperties(TerrainTileList.prototype, {
            /**
             * The number of terrain tiles in this terrain tile list.
             * @memberof TerrainTileList.prototype
             * @readonly
             * @type {Number}
             */
            length: {
                get: function () {
                    return this.tileArray.length
                }
            }
        });

        TerrainTileList.prototype.addTile = function (tile) {
            if (!tile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TerrainTileList", "addTile", "missingTile"));
            }

            if (this.tileArray.indexOf(tile) == -1) {
                this.tileArray.push(tile);

                if (!this.sector) {
                    this.sector = new Sector(0, 0, 0, 0);
                    this.sector.copy(tile.sector);
                } else {
                    this.sector.union(tile.sector);
                }
            }
        };

        TerrainTileList.prototype.removeAllTiles = function () {
            this.tileArray = [];
            this.sector = null;
        };

        return TerrainTileList;
    });