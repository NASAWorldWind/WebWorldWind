/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
         * Constructs a service for interacting with OpenSearch servers.
         *
         * @alias OpenSearchService
         * @constructor
         * @classdesc Provides a service for interacting with OpenSearch servers.
         *
         * The service exposes two methods:
         *  - discover used to get the description document;
         *  - search used for querying the search engine.
         *
         * By default, this service can handle Atom for EO and GeoJSON responses.
         * Other types of response formats can by added using the registerParser method.
         */
        var OpenSearchService = function () {
            this._url = '';
            this._descriptionDocument = null;
            this._rawDescriptionDocument = null;
            this._parserRegistry = new OpenSearchParserRegistry();

            this.registerDefaultParsers();
        };

        Object.defineProperties(OpenSearchService.prototype, {
            /**
             * URL of the OpenSearch description document.
             * @memberof OpenSearchService.prototype
             * @type {String}
             */
            url: {
                get: function () {
                    return this._url;
                }
            },

            /**
             * The latest parsed OpenSearch description document.
             * @memberof OpenSearchService.prototype
             * @type {OpenSearchDescriptionDocument}
             */
            descriptionDocument: {
                get: function () {
                    return this._descriptionDocument;
                }
            },

            /**
             * The latest OpenSearch description document in the raw xml form.
             * @memberof OpenSearchService.prototype
             * @type {XmlDocument}
             */
            rawDescriptionDocument: {
                get: function() {
                    return this._rawDescriptionDocument;
                }
            },

            /**
             * A registry of parsers (Atom, GeoJSON) to be used by this service.
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
         * Fetches and parses an OpenSearch description document.
         * @param {OpenSearchRequest} options See {@link OpenSearchRequest} for possible options. A url is required.
         * @return {Promise} A promise which when resolved returns this service, or an error when rejected
         * @example openSearchService
         *                      .discover({url: 'http://example.com/opensearch'})
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchService.create = function(options){
            var service = new OpenSearchService();
            var requestOptions = new OpenSearchRequest(options);
            requestOptions.method = requestOptions.method || 'GET';
            if (!requestOptions.url) {
                return Promise.reject(new Error('OpenSearchService discover - no url provided'));
            }
            this._url = requestOptions.url;
            return OpenSearchUtils.fetch(requestOptions)
                .then(function (responseText) {
                    var xmlRoot = OpenSearchUtils.parseXml(responseText);
                    service._rawDescriptionDocument = xmlRoot;
                    service._descriptionDocument = new OpenSearchDescriptionDocument(xmlRoot);
                    return service;
                });
        };

        /**
         * Performs a search query.
         *
         * @param {Array|null} searchParams A list of objects, each object must have a name and value property.
         * @param {OpenSearchRequest|null} options See {@link OpenSearchRequest} for possible options.
         * @return {Promise} A promise which when resolved returns a GeoJSON collection, or an error when rejected.
         * @example openSearchService
         *                      .search([
         *                          {name: 'count', value: 10}, {name: 'lat', value: 50}, {name: 'lon', value: 20}
         *                      ])
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchService.prototype.search = function (searchParams, options) {
            if (!this._descriptionDocument) {
                return Promise.reject(new Error('OpenSearchService search - no descriptionDocument, create the service via create first'));
            }

            var self = this;
            var requestOptions = new OpenSearchRequest(options);
            var supportedFormats = this.getSupportedFormats();
            var openSearchUrl = this._descriptionDocument.findFirstSearchUrl({
                searchParams: searchParams,
                requestOptions: requestOptions,
                supportedFormats: supportedFormats
            });

            if (!openSearchUrl) {
                return Promise.reject(new Error('OpenSearchService - no suitable Url found'));
            }

            requestOptions.method = openSearchUrl.method;
            requestOptions.encType = openSearchUrl.encType;

            if (openSearchUrl.method === 'GET') {
                requestOptions.url = openSearchUrl.createRequestUrl(searchParams);
            } else if (openSearchUrl.encType === 'application/x-www-form-urlencoded' ||
                openSearchUrl.encType === 'multipart/form-data') {
                requestOptions.url = openSearchUrl._baseUrl;
                requestOptions.body = openSearchUrl.createRequestBody(searchParams);
                requestOptions.addHeader('Content-Type', openSearchUrl.encType);
            } else {
                return Promise.reject(new Error('OpenSearchService search - unsupported encoding'));
            }

            // Get Metadata for the products.
            // Get available collections.
              // Collection has parameters, metadata and all the information as part of the source.
            return OpenSearchUtils.fetch(requestOptions)
                .then(function (response) {
                    var responseParser = self.getParser(openSearchUrl.type, requestOptions.relation);
                    if (!responseParser) {
                        throw new Error('OpenSearchService search - no suitable response parser found');
                    }
                    return responseParser.parse(response, requestOptions.relation);
                    // What are the possible results of this?
                });
        };

        /**
         * Finds an URL that satisfies the provided predicate function.
         *
         * @param {Function} predicate Function to execute on each value in the description document URLs array,
         * taking three arguments:
         * element The current element being processed in the array.
         * index The index of the current element being processed in the array.
         * array The array find was called upon.
         * @param {Object|null} context Object to use as "this" when executing the predicate function.
         * @return {OpenSearchUrl|undefined} The first URL in the array that satisfies the provided predicate
         * function. Otherwise, undefined is returned.
         */
        OpenSearchService.prototype.findUrl = function(predicate, context) {
            return OpenSearchUtils.arrayFind(this._descriptionDocument.urls, predicate, context);
        };

        // Do ParserRegistry belong to the OpenSearchService?
        /**
         * Registers a parser for the specified mime type and relation.
         *
         * The parse method of the parser will be called with the response of the server when the mime type and
         * relation type matches.
         *
         * @param {String} type Mime type of the parser to register.
         * @param {String} rel Relation type of the parser to register.
         * @param {Object} parser An object with a parse method.
         */
        OpenSearchService.prototype.registerParser = function (type, rel, parser) {
            this.parserRegistry.registerParser(type, rel, parser);
        };

        /**
         * Returns the list of supported mime types.
         *
         * @return {String[]} The list of supported mime types.
         */
        OpenSearchService.prototype.getSupportedFormats = function () {
            return this.parserRegistry.getFormats();
        };

        /**
         * Returns the response parser for the specified mime type and relation.
         *
         * @param {String} type Mime type of the parser.
         * @param {String} rel Relation type of the parser.
         *
         * @return {Object|undefined} The response parser.
         */
        OpenSearchService.prototype.getParser = function (type, rel) {
            return this.parserRegistry.getParser(type, rel);
        };

        /**
         * Removes the response parser for the specified mime type and relation.
         *
         * @param {String} type Mime type of the registered parser.
         * @param {String} rel Relation type of the registered parser.
         */
        OpenSearchService.prototype.removeParser = function (type, rel) {
            this.parserRegistry.removeParser(type, rel);
        };

        /**
         * Internal. Applications should not call this function.
         * Registers the default parsers for an OpenSearchService.
         */
        OpenSearchService.prototype.registerDefaultParsers = function () {
            this.registerParser('application/atom+xml', OpenSearchConstants.RESULTS, OpenSearchAtomParser);
            this.registerParser('application/atom+xml', OpenSearchConstants.COLLECTION, OpenSearchAtomParser);

            /** There are 3 accepted mime types for GeoJSON **/
            this.registerParser('application/vnd.geo+json', OpenSearchConstants.RESULTS, window.JSON);
            this.registerParser('application/vnd.geo+json', OpenSearchConstants.COLLECTION, window.JSON);

            this.registerParser('application/geo+json', OpenSearchConstants.RESULTS, window.JSON);
            this.registerParser('application/geo+json', OpenSearchConstants.COLLECTION, window.JSON);

            this.registerParser('application/json', OpenSearchConstants.RESULTS, window.JSON);
            this.registerParser('application/json', OpenSearchConstants.COLLECTION, window.JSON);
        };

        return OpenSearchService;
    });