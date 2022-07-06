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
 * @exports AbstractError
 */
define(function () {
    "use strict";

    /**
     * Constructs an error with a specified name and message.
     * @alias AbstractError
     * @constructor
     * @abstract
     * @classdesc Provides an abstract base class for error classes. This class is not meant to be instantiated
     * directly but used only by subclasses.
     * @param {String} name The error's name.
     * @param {String} message The message.
     */
    var AbstractError = function (name, message) {
        this.name = name;
        this.message = message;
    };

    /**
     * Returns the message and stack trace associated with this error.
     * @returns {String} The message and stack trace associated with this error.
     */
    AbstractError.prototype.toString = function () {
        var str = this.name + ': ' + this.message;

        if (this.stack) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    return AbstractError;

});