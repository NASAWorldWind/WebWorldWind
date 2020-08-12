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
 * Defines an interface for {@link MemoryCache} listeners.
 * @exports MemoryCacheListener
 * @interface MemoryCacheListener
 */
define([
        '../util/Logger',
        '../error/UnsupportedOperationError'
    ],
    function (Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * @alias MemoryCacheListener
         * @constructor
         */
        var MemoryCacheListener = function () {};

        /**
         * Called when an entry is removed from the cache.
         * Implementers of this interface must implement this function.
         * @param {String} key The key of the entry removed.
         * @param {Object} entry The entry removed.
         */
        MemoryCacheListener.prototype.entryRemoved = function (key, entry) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "MemoryCacheListener", "entryRemoved", "abstractInvocation"));
        };

        /**
         * Called when an error occurs during entry removal.
         * Implementers of this interface must implement this function.
         * @param {Object} error The error object describing the error that occurred.
         * @param {String} key The key of the entry being removed.
         * @param {Object} entry The entry being removed.
         */
        MemoryCacheListener.prototype.removalError = function (error, key, entry) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "MemoryCacheListener", "removalError", "abstractInvocation"));
        };

        return MemoryCacheListener;
    });