/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchParserRegistry
 */

define([
        '../../../error/ArgumentError',
        '../../../util/Logger',
        '../OpenSearchConstants'
    ],
    function (ArgumentError,
              Logger,
              OpenSearchConstants) {
        'use strict';

        /**
         * Constructs a parser registry.
         * Parses are stored by the provided mime type and relation.
         * The mime type indicates the file format that the parser should expect.
         * The relation specifies the role of the resource being described in relation to the description document
         * Services can register or retrieve a parser by specifying the mime type and relation.
         * @alias OpenSearchParserRegistry
         * @constructor
         * @classdesc Provides a parser registry.
         */
        var OpenSearchParserRegistry = function () {
            this._entries = Object.create(null);
        };

        /**
         * Registers a parser to be used for the specified mime type and relation
         *
         * @param {String} type Mime type for the registered parser
         * @param {String} rel Open search Url relation for the registered parser
         * @param {Object} parser An object with a parse method.
         * The parse method will be called with the response of the server and must return a geoJSON object
         */
        OpenSearchParserRegistry.prototype.registerParser = function (type, rel, parser) {
            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchParserRegistry", "registerParser",
                        "The specified type is missing."));
            }
            if (typeof type !== 'string') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchParserRegistry", "registerParser",
                        "The specified type is not a string."));
            }
            if (!rel) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchParserRegistry", "registerParser",
                        "The specified rel is missing."));
            }
            if (typeof rel !== 'string') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchParserRegistry", "registerParser",
                        "The specified rel is not a string"));
            }
            if (!parser) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchParserRegistry", "registerParser",
                        "The specified parser is missing."));
            }
            if (typeof parser !== 'object') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchParserRegistry", "registerParser",
                        "The specified parser is not an object."));
            }
            if (typeof parser.parse !== 'function') {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchParserRegistry", "registerParser",
                        "The specified parser does not have a parse method."));
            }

            if (!this._entries[type]) {
                this._entries[type] = Object.create(null);
            }
            this._entries[type][rel] = parser;
        };

        /**
         * Gets the parser for the specified mime type and relation.
         *
         * @param {String} type Mime type for parser
         * @param {String} rel Open search Url relation for the parser
         *
         * @return {Object|undefined} the parser
         */
        OpenSearchParserRegistry.prototype.getParser = function (type, rel) {
            if (!type || typeof type !== 'string') {
                return;
            }
            if (typeof rel !== 'string') {
                return;
            }

            rel = rel || OpenSearchConstants.RESULTS;
            if (!this._entries[type]) {
                return;
            }
            return this._entries[type][rel];
        };

        /**
         * Returns a list with the supported mime types.
         * @return {[String]} a list of the supported mime types
         */
        OpenSearchParserRegistry.prototype.getFormats = function () {
            return Object.keys(this._entries);
        };

        /**
         * Removes a parser for the specified mime type and relation.
         *
         * @param {String} type Mime type for the registered parser
         * @param {String} rel Open search Url relation for the registered parser
         */
        OpenSearchParserRegistry.prototype.removeParser = function (type, rel) {
            if (!this._entries[type]) {
                return;
            }
            if (!rel) {
                delete this._entries[type];
            }
            delete this._entries[type][rel];
        };

        return OpenSearchParserRegistry;
    });