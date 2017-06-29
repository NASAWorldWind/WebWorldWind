/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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