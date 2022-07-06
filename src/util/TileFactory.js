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
 * @exports TileFactory
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