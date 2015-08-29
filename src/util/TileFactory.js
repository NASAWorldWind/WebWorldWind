/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TileFactory
 * @version $Id: TileFactory.js 2664 2015-01-21 02:16:16Z tgaskins $
 */
define(['../util/Logger',
        '../error/UnsupportedOperationError'
    ],
    function (Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * Applications must not call this constructor. It is an interface class and is not meant to be instantiated
         * directly.
         * @alias TileFactory
         * @constructor
         * @classdesc
         * Represents a tile factory.
         * This is an interface class and is not meant to be instantiated directly.
         */
        var TileFactory = function () {};

        /**
         * Creates a tile for a specified sector, level and row and column within that level.
         * Implementers of this interface must implement this function.
         * @param {Sector} sector The sector the tile spans.
         * @param {Level} level The level the tile is a member of.
         * @param {Number} row The tile's row within the specified level.
         * @param {Number} column The tile's column within the specified level.
         * @throws {ArgumentError} If the specified sector is null or undefined.
         */
        TileFactory.prototype.createTile = function (sector, level, row, column) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "TileFactory", "createTile", "abstractInvocation"));
        };

        return TileFactory;
    })
;