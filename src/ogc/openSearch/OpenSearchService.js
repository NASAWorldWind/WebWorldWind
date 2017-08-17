/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchService
 */

define([
        './responseFormats/atomParser/AtomToGeoJSON',
        './descriptionDocument/DescriptionDocument',
        './OpenSearchRequest',
        './OpenSearchUtils',
        './responseFormats/OpenSearchParserRegistry'
    ],
    function (AtomToGeoJSONNormalized,
              DescriptionDocument,
              OpenSearchRequest,
              OpenSearchUtils,
              OpenSearchParserRegistry) {
        'use strict';

        /**
         * Constructs a service for open search queries.
         * @alias OpenSearchService
         * @constructor
         * @classdesc Provides a search service for working with open search queries.
         * @param {String} url The URL for the description document.
         */
        var OpenSearchService = function (url) {
            this._url = url;
            this._descriptionDocument = null;
            this._parserRegistry = new OpenSearchParserRegistry();

            this.registerParsers();
        };

        Object.defineProperties(OpenSearchService.prototype, {
            /**
             * URL for the description document.
             * @memberof OpenSearchService.prototype
             * @type {String}
             */
            url: {
                get: function () {
                    return this._url;
                },
                set: function (value) {
                    if (!value) {
                        throw '';
                    }
                    if (typeof value !== 'string') {
                        throw '';
                    }
                    this._url = value;
                }
            },

            /**
             * The parsed description document.
             * @memberof OpenSearchService.prototype
             * @type {DescriptionDocument}
             */
            descriptionDocument: {
                get: function () {
                    return this._descriptionDocument;
                },
                set: function (value) {
                    this._descriptionDocument = value;
                }
            },

            /**
             * A registry of parsers (xml, geoJSON) to be used with this service.
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
         * @param {OpenSearchRequest|null} options See OpenSearchRequest for possible options.
         * @return {Promise} A promise which when resolved return this service, or an error when rejected
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
            return OpenSearchUtils.fetch(requestOptions)
                .then(function (responseText) {
                    var xmlRoot = OpenSearchUtils.parseXml(responseText);
                    self.descriptionDocument = new DescriptionDocument(xmlRoot);
                    return self;
                })
                .catch(function (err) {
                    return Promise.reject(err);
                });
        };

        /**
         * Performs a search query.
         * @param {Array|null} searchParams A list of objects, each object must have a name and value property.
         * @param {OpenSearchRequest|null} options See OpenSearchRequest for possible options.
         * @return {Promise} A promise which when resolved returns a geoJSON collection, or an error when rejected.
         * @example openSearchService
         *                      .search([
         *                          {name: 'count', value: 50}, {name: 'lat', value: 50}, {name: 'lon', value: 20}
         *                      ])
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchService.prototype.search = function (searchParams, options) {
            if (!this.descriptionDocument) {
                return Promise.reject(new Error('OpenSearch search - no descriptionDocument, run discover first'));
            }
            return this.searchRequest(searchParams, options);
        };

        OpenSearchService.prototype.searchRequest = function (searchParams, options) {
            var self = this;

            var requestOptions = new OpenSearchRequest(options);
            var supportedFormats = this.getSupportedFormats();
            var openSearchUrl = this.descriptionDocument.findCompatibleUrl(searchParams, requestOptions, supportedFormats);

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
                return Promise.reject(new Error('OpenSearch - encoding parse error'));
            }

            return OpenSearchUtils.fetch(requestOptions)
                .then(function (response) {
                    var responseParser = self.getResponseParser(openSearchUrl.type, requestOptions.relation);
                    if (!responseParser) {
                        throw new Error('OpenSearch - no suitable response parser found');
                    }
                    return responseParser.parse(response);
                })
                .catch(function (err) {
                    return Promise.reject(err);
                });
        };

        OpenSearchService.prototype.registerParser = function (options) {
            this.parserRegistry.registerParser(options);
        };

        OpenSearchService.prototype.getSupportedFormats = function () {
            return this.parserRegistry.getFormats();
        };

        OpenSearchService.prototype.getResponseParser = function (type, rel) {
            return this.parserRegistry.getParser(type, rel);
        };

        OpenSearchService.prototype.removeParser = function (type) {
            this.parserRegistry.removeParser(type);
        };

        OpenSearchService.prototype.registerParsers = function () {
            this.registerParser({
                mimeType: 'application/atom+xml',
                rel: 'results',
                parser: AtomToGeoJSONNormalized
            });
            this.registerParser({
                mimeType: 'application/atom+xml',
                rel: 'collection',
                parser: AtomToGeoJSONNormalized
            });

            /** There can be 3 mimeTypes for geoJSON **/

            this.registerParser({
                mimeType: 'application/vnd.geo+json',
                rel: 'results',
                parser: window.JSON
            });
            this.registerParser({
                mimeType: 'application/vnd.geo+json',
                rel: 'collection',
                parser: window.JSON
            });

            this.registerParser({
                mimeType: 'application/geo+json',
                rel: 'results',
                parser: window.JSON
            });
            this.registerParser({
                mimeType: 'application/geo+json',
                rel: 'collection',
                parser: window.JSON
            });

            this.registerParser({
                mimeType: 'application/json',
                rel: 'results',
                parser: window.JSON
            });
            this.registerParser({
                mimeType: 'application/json',
                rel: 'collection',
                parser: window.JSON
            });
        };

        return OpenSearchService;
    });