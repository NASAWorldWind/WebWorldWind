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
 * @exports WWMessage
 */
define([],
    function () {
        "use strict";

        /**
         * Create a WWMessage instance.
         * @classdesc Defines a class to hold message information.
         * @param {String} type The message type.
         * @param {{}} source The source of the message.
         * @constructor
         */
        var WWMessage = function(type, source) {

            /**
             * This object's message type.
             * @type {String}
             * @readonly
             */
            this.type = type;

            /**
             * The source object of this message.
             * @type {{}}
             * @readonly
             */
            this.source = source;
        };

        return WWMessage;
    }
);