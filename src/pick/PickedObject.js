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