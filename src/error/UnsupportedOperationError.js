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
 * @exports UnsupportedOperationError
 */
define(['../error/AbstractError'],
    function (AbstractError) {
        "use strict";

        /**
         * Constructs an unsupported-operation error with a specified message.
         * @alias UnsupportedOperationError
         * @constructor
         * @classdesc Represents an error associated with an operation that is not available or should not be invoked.
         * Typically raised when an abstract function of an abstract base class is called because a subclass has not
         * implemented the function.
         * @augments AbstractError
         * @param {String} message The message.
         */
        var UnsupportedOperationError = function (message) {
            AbstractError.call(this, "UnsupportedOperationError", message);

            var stack;
            try {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            } catch (e) {
                stack = e.stack;
            }
            this.stack = stack;
        };

        UnsupportedOperationError.prototype = Object.create(AbstractError.prototype);

        return UnsupportedOperationError;
    });