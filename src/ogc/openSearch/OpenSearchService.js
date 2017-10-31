/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchService
 */

define([
        '../../error/ArgumentError',
        '../../util/Logger',
        './responseFormats/atomParser/OpenSearchAtomParser',
        './OpenSearchConstants',
        './descriptionDocument/OpenSearchDescriptionDocument',
        './responseFormats/OpenSearchParserRegistry',
        './OpenSearchRequest',
        './OpenSearchUtils',
        '../../util/Promise'
    ],
    function (ArgumentError,
              Logger,
              OpenSearchAtomParser,
              OpenSearchConstants,
              OpenSearchDescriptionDocument,
              OpenSearchParserRegistry,
              OpenSearchRequest,
              OpenSearchUtils,
              Promise) {
        'use strict';

        /**
         * Constructs a service for open search queries.
         *
         * The service exposes two methods:
         *  - discover used to get the description document
         *  - search used for querying the search engine
         *
         * By default this service can handle Atom for EO and geoJSON responses.
         * Other types of response formats can by added with the registerParser method.
         *
         * @alias OpenSearchService
         * @constructor
         * @classdesc Provides a search service for working with open search queries.
         * @param {String} url The url for the description document.
         */
        var OpenSearchService = function (url) {
            this._url = url;
            this._descriptionDocument = null;
            this._parserRegistry = new OpenSearchParserRegistry();

            this.registerDefaultParsers();
        };

        Object.defineProperties(OpenSearchService.prototype, {
            /**
             * Url for the description document.
             * @memberof OpenSearchService.prototype
             * @type {String}
             */
            url: {
                get: function () {
                    return this._url;
                },
                set: function (value) {
                    if (!value || typeof value !== 'string') {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchService", "setUrl",
                                "The specified url is missing or is not a string."));
                    }
                    this._url = value;
                }
            },

            /**
             * The parsed description document.
             * @memberof OpenSearchService.prototype
             * @type {OpenSearchDescriptionDocument}
             */
            descriptionDocument: {
                get: function () {
                    return this._descriptionDocument;
                }
            },

            /**
             * A registry of parsers (Atom, geoJSON) to be used with this service.
             * @memberof OpenSearchService.prototype
             * @type {OpenSearchParserRegistry}
             */
            parserRegistry: {
                get: function () {
                    return this._parserRegistry;
                },
                set: function (value) {
                    this._parserRegistry = value;
                }
            }
        });

        /**
         * Fetches and parses an open search description document.
         * @param {OpenSearchRequest|null} options See {@link OpenSearchRequest} for possible options.
         * @return {Promise} A promise which when resolved returns this service, or an error when rejected
         * @example openSearchService
         *                      .discover({url: 'http://example.com/opensearch'})
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchService.prototype.discover = function (options) {
            var self = this;
            var requestOptions = new OpenSearchRequest(options);
            requestOptions.url = requestOptions.url || this._url;
            requestOptions.method = requestOptions.method || 'GET';
            if (!requestOptions.url) {
                return Promise.reject(new Error('OpenSearchService discover - no url provided'));
            }
            return OpenSearchUtils.fetch(requestOptions)
                .then(function (responseText) {
                    var xmlRoot = OpenSearchUtils.parseXml(responseText);
                    self._descriptionDocument = new OpenSearchDescriptionDocument(xmlRoot);
                    return self;
                });
        };

        /**
         * Performs a search query.
         * @param {Array|null} searchParams A list of objects, each object must have a name and value property.
         * @param {OpenSearchRequest|null} options See {@link OpenSearchRequest} for possible options.
         * @return {Promise} A promise which when resolved returns a geoJSON collection, or an error when rejected.
         * @example openSearchService
         *                      .search([
         *                          {name: 'count', value: 10}, {name: 'lat', value: 50}, {name: 'lon', value: 20}
         *                      ])
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchService.prototype.search = function (searchParams, options) {
            if (!this._descriptionDocument) {
                return Promise.reject(new Error('OpenSearchService search - no descriptionDocument, run discover first'));
            }

            var self = this;
            var requestOptions = new OpenSearchRequest(options);
            var supportedFormats = this.getSupportedFormats();
            var openSearchUrl = this._descriptionDocument.findCompatibleUrl(searchParams, requestOptions, supportedFormats);

            if (!openSearchUrl) {
                return Promise.reject(new Error('OpenSearchService - no suitable Url found'));
            }

            requestOptions.method = openSearchUrl.method;
            requestOptions.encType = openSearchUrl.encType;

            if (openSearchUrl.method === 'GET') {
                requestOptions.url = openSearchUrl.createRequestUrl(searchParams);
            }
            else if (openSearchUrl.encType === 'application/x-www-form-urlencoded' ||
                openSearchUrl.encType === 'multipart/form-data') {
                requestOptions.url = openSearchUrl._baseUrl;
                requestOptions.body = openSearchUrl.createRequestBody(searchParams);
                requestOptions.addHeader('Content-Type', openSearchUrl.encType);
            }
            else {
                return Promise.reject(new Error('OpenSearchService search - unsupported encoding'));
            }

            return OpenSearchUtils.fetch(requestOptions)
                .then(function (response) {
                    var responseParser = self.getResponseParser(openSearchUrl.type, requestOptions.relation);
                    if (!responseParser) {
                        throw new Error('OpenSearchService search - no suitable response parser found');
                    }
                    return responseParser.parse(response, requestOptions.relation);
                });
        };

        /**
         * Registers a parser to be used for the specified mime type and relation
         *
         * @param {String} type Mime type for the registered parser
         * @param {String} rel Open search Url relation for the registered parser
         * @param {Object} parser An object with a parse method.
         * The parse method will be called with the response of the server.
         */
        OpenSearchService.prototype.registerParser = function (type, rel, parser) {
            this.parserRegistry.registerParser(type, rel, parser);
        };

        /**
         * Returns a list with the supported mime types.
         * @return {[String]} a list of the supported mime types
         */
        OpenSearchService.prototype.getSupportedFormats = function () {
            return this.parserRegistry.getFormats();
        };

        /**
         * Gets the response parser for the specified mime type and relation.
         *
         * @param {String} type Mime type for parser
         * @param {String} rel Open search Url relation for the parser
         *
         * @return {Object|undefined} the parser
         */
        OpenSearchService.prototype.getResponseParser = function (type, rel) {
            return this.parserRegistry.getParser(type, rel);
        };

        /**
         * Removes a parser for the specified mime type and relation.
         *
         * @param {String} type Mime type for the registered parser
         * @param {String} rel Open search Url relation for the registered parser
         */
        OpenSearchService.prototype.removeParser = function (type, rel) {
            this.parserRegistry.removeParser(type, rel);
        };

        /**
         * Internal. applications should not call this function.
         * Registers the default parsers for an OpenSearchService.
         */
        OpenSearchService.prototype.registerDefaultParsers = function () {
            this.registerParser('application/atom+xml', OpenSearchConstants.RESULTS, OpenSearchAtomParser);
            this.registerParser('application/atom+xml', OpenSearchConstants.COLLECTION, OpenSearchAtomParser);

            /** There can be 3 mimeTypes for geoJSON **/
            this.registerParser('application/vnd.geo+json', OpenSearchConstants.RESULTS, window.JSON);
            this.registerParser('application/vnd.geo+json', OpenSearchConstants.COLLECTION, window.JSON);

            this.registerParser('application/geo+json', OpenSearchConstants.RESULTS, window.JSON);
            this.registerParser('application/geo+json', OpenSearchConstants.COLLECTION, window.JSON);

            this.registerParser('application/json', OpenSearchConstants.RESULTS, window.JSON);
            this.registerParser('application/json', OpenSearchConstants.COLLECTION, window.JSON);
        };

        return OpenSearchService;
    });