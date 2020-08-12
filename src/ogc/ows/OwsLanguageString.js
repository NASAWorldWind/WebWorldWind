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
 * @exports OwsLanguageString
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs an OWS Constraint instance from an XML DOM.
         * @alias OwsLanguageString
         * @constructor
         * @classdesc Represents an OWS LanguageString element of an OGC document.
         * This object holds as properties all the fields specified in the OWS LanguageString definition.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "value".
         * @param {Element} element An XML DOM element representing the OWS LanguageString element.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsLanguageString = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "LanguageString", "constructor", "missingDomElement"));
            }

            /**
             * The text content of the element.
             * @type {string}
             */
            this.value = element.textContent;

            /**
             * Identifier of a language used by the data(set) contents. This language identifier shall be as specified
             * in IETF RFC 4646. When this element is omitted, the language used is not identified.
             * @type {string}
             */
            this.lang;

            var lang = element.getAttribute("lang");
            if (lang) {
                this.lang = lang;
            }
        };

        return OwsLanguageString;
    });