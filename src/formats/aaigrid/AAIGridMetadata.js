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

define([],
    function () {
        'use strict';

        /**
         * Creates a new container for AAIGrid metadata.
         * @alias AAIGridMetadata
         * @constructor
         * @classdesc Contains all metadata for an AAIGrid file.
         */
        var AAIGridMetadata = function () {
            // Documented in defineProperties below.
            this._ncols = null;

            // Documented in defineProperties below.
            this._nrows = null;

            // Documented in defineProperties below.
            this._xllcorner = null;

            // Documented in defineProperties below.
            this._yllcorner = null;

            // Documented in defineProperties below.
            this._cellsize = null;

            // Documented in defineProperties below.
            this._NODATA_value = undefined;
        };

        Object.defineProperties(AAIGridMetadata.prototype, {

            /**
             * Number of columns in the grid.
             * @memberof AAIGridMetadata.prototype
             * @type {Number}
             */
            ncols: {
                get: function () {
                    return this._ncols;
                },
                set: function (value) {
                    this._ncols = value;
                }
            },

            /**
             * Number of rows in the grid.
             * @memberof AAIGridMetadata.prototype
             * @type {Number}
             */
            nrows: {
                get: function () {
                    return this._nrows;
                },
                set: function (value) {
                    this._nrows = value;
                }
            },

            /**
             * The western edge (left), x-coordinate
             * @memberof AAIGridMetadata.prototype
             * @type {Number}
             */
            xllcorner: {
                get: function () {
                    return this._xllcorner;
                },
                set: function (value) {
                    this._xllcorner = value;
                }
            },

            /**
             * The southern edge (bottom), y-coordinate
             * @memberof AAIGridMetadata.prototype
             * @type {Number}
             */
            yllcorner: {
                get: function () {
                    return this._yllcorner;
                },
                set: function (value) {
                    this._yllcorner = value;
                }
            },

            /**
             * The length of one side of a square cell (resolution of the grid).
             * @memberof AAIGridMetadata.prototype
             * @type {Number}
             */
            cellsize: {
                get: function () {
                    return this._cellsize;
                },
                set: function (value) {
                    this._cellsize = value;
                }
            },

            /**
             * The value that is regarded as "missing" or "not applicable".
             * This value is optional and if not present it's value will be undefined.
             * @memberof AAIGridMetadata.prototype
             * @type {Number|undefined}
             */
            NODATA_value: {
                get: function () {
                    return this._NODATA_value;
                },
                set: function (value) {
                    this._NODATA_value = value;
                }
            }
        });

        return AAIGridMetadata;
    });