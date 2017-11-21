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
 * @exports UrlBuilder
 */
define(['../util/Logger',
        '../error/UnsupportedOperationError'
    ],
    function (Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * Applications must not call this constructor. It is an interface class and is not meant to be instantiated.
         * @alias UrlBuilder
         * @constructor
         * @classdesc
         * Defines an interface for tile URL builders. This is an interface class and not meant to be instantiated.
         */
        var UrlBuilder = function () {};

        /**
         * Creates the URL string for a resource.
         * @param {Tile} tile The tile for which to create the URL.
         * @param {String} format The format to request.
         * @returns {String} A string identifying the URL for the specified tile's resource.
         * @throws {ArgumentError} If either the specified tile or format is null or undefined.
         */
        UrlBuilder.prototype.urlForTile = function (tile, format) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "UrlBuilder", "urlForTile", "abstractInvocation"));
        };

        return UrlBuilder;
    })
;