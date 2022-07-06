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
 * @exports PickedObject
 */
define([],
    function () {
        "use strict";

        /**
         * Constructs a picked object.
         * @alias PickedObject
         * @constructor
         * @classdesc Represents a picked object.
         * @param {Color} color The pick color identifying the object.
         * @param {Object} userObject An object to associate with this picked object, usually the picked shape.
         * @param {Position} position The picked object's geographic position. May be null if unknown.
         * @param {Layer} parentLayer The layer containing the picked object.
         * @param {Boolean} isTerrain true if the picked object is terrain, otherwise false.
         */
        var PickedObject = function (color, userObject, position, parentLayer, isTerrain) {

            /**
             * This picked object's pick color.
             * @type {Color}
             * @readonly
             */
            this.color = color;

            /**
             * The picked shape.
             * @type {Object}
             * @readonly
             */
            this.userObject = userObject;

            /**
             * This picked object's geographic position.
             * @type {Position}
             * @readonly
             */
            this.position = position;

            /**
             * The layer containing this picked object.
             * @type {Layer}
             * @readonly
             */
            this.parentLayer = parentLayer;

            /**
             * Indicates whether this picked object is terrain.
             * @type {Boolean}
             * @readonly
             */
            this.isTerrain = isTerrain;

            /**
             * Indicates whether this picked object is the top object.
             * @type {boolean}
             */
            this.isOnTop = false;
        };

        return PickedObject;
    });