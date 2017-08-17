/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchParserRegistry
 */

define([],
    function () {
        'use strict';

        var OpenSearchParserRegistry = function () {
            this._entries = Object.create(null);
        };

        OpenSearchParserRegistry.prototype.registerParser = function (options) {
            if (!options || typeof options !== 'object') {
                throw ''
            }

            var mimeType = options.mimeType;
            var rel = options.rel || 'results';
            var parser = options.parser;

            if (!this._entries[mimeType]) {
                this._entries[mimeType] = Object.create(null);
            }
            this._entries[mimeType][rel] = parser;
        };

        OpenSearchParserRegistry.prototype.getParser = function (type, rel) {
            rel = rel || 'results';
            return this._entries[type][rel];
        };

        OpenSearchParserRegistry.prototype.getFormats = function () {
            return Object.keys(this._entries);
        };

        OpenSearchParserRegistry.prototype.removeParser = function (type, rel) {
            delete this._entries[type][rel];
        };

        return OpenSearchParserRegistry;
    });