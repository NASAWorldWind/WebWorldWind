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
 * @exports OpenSearchDescriptionDocument
 */

define([
        '../../../error/ArgumentError',
        '../../../util/Logger',
        '../OpenSearchNamespaces',
        './OpenSearchUrl',
        '../OpenSearchUtils'
    ],
    function (ArgumentError,
              Logger,
              OpenSearchNamespaces,
              OpenSearchUrl,
              OpenSearchUtils) {
        'use strict';

        /**
         * Constructs an OpenSearchDescriptionDocument from a XML DOM.
         *
         * @alias OpenSearchDescriptionDocument
         * @constructor
         * @param {Node} xmlRoot An XML DOM representing the Open Search Description Document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         * @classdesc Represents an Open Search Description Document.
         *
         * This object holds as properties the fields specified in the Open Search Description Document.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         * For example: "shortName" and "urls".
         */
        var OpenSearchDescriptionDocument = function (xmlRoot) {
            if (!xmlRoot) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchDescriptionDocument", "constructor",
                        "missingDomElement"));
            }

            var ns = OpenSearchNamespaces.openSearch;

            this._namespaces = OpenSearchUtils.getNodeAttributes(xmlRoot, {});
            this._shortName = OpenSearchUtils.getChildTextContent(xmlRoot, 'ShortName', ns);
            this._description = OpenSearchUtils.getChildTextContent(xmlRoot, 'Description', ns);
            this._urls = OpenSearchUtils.getXmlElements(xmlRoot, 'Url', ns).map(function (node) {
                return new OpenSearchUrl().parse(node);
            });
            this._contact = OpenSearchUtils.getChildTextContent(xmlRoot, 'Contact', ns);
            this._tags = OpenSearchUtils.getChildTextContent(xmlRoot, 'Tags', ns);
            this._longName = OpenSearchUtils.getChildTextContent(xmlRoot, 'LongName', ns);
            this._images = OpenSearchUtils.getXmlElements(xmlRoot, 'Image', ns).map(this.parseImage);
            this._queries = OpenSearchUtils.getXmlElements(xmlRoot, 'Query', ns).map(this.parseQuery);
            this._developer = OpenSearchUtils.getChildTextContent(xmlRoot, 'Developer', ns);
            this._attribution = OpenSearchUtils.getChildTextContent(xmlRoot, 'Attribution', ns);
            this._syndicationRight = OpenSearchUtils.getChildTextContent(xmlRoot, 'SyndicationRight', ns);
            this._adultContent = OpenSearchUtils.getChildTextContent(xmlRoot, 'AdultContent', ns);
            if(this._adultContent === 'false') {
                this._adultContent = false;
            } else if(this._adultContent === 'true') {
                this._adultContent = true;
            }
            this._languages = OpenSearchUtils.getXmlElements(xmlRoot, 'Language', ns).map(OpenSearchUtils.getTextContent);
            this._inputEncodings = OpenSearchUtils.getXmlElements(xmlRoot, 'InputEncoding', ns).map(OpenSearchUtils.getTextContent);
            this._outputEncodings = OpenSearchUtils.getXmlElements(xmlRoot, 'OutputEncoding', ns).map(OpenSearchUtils.getTextContent);
        };

        Object.defineProperties(OpenSearchDescriptionDocument.prototype, {
            /**
             * Contains a brief human-readable title that identifies the search engine.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            shortName: {
                get: function () {
                    return this._shortName;
                }
            },

            /**
             * Contains a human-readable text description of the search engine.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            description: {
                get: function () {
                    return this._description;
                }
            },

            /**
             * Describes an interface by which a client can make requests for an external resource,
             * such as search results, or additional description documents.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {OpenSearchUrl[]}
             */
            urls: {
                get: function () {
                    return this._urls;
                }
            },

            /**
             * Contains an email address at which the maintainer of the description document can be reached.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            contact: {
                get: function () {
                    return this._contact;
                }
            },

            /**
             * Contains a set of words that are used as keywords to identify and categorize this search content.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String[]}
             */
            tags: {
                get: function () {
                    return this._tags;
                }
            },

            /**
             * Contains an extended human-readable title that identifies the search engine.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            longName: {
                get: function () {
                    return this._longName;
                }
            },

            /**
             * Contains information that identifies the location of an image that can be used in association with this
             * search content.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @typedef {{height: Number, width: Number, type: String, src: String}} image
             * @type {image[]}
             */
            images: {
                get: function () {
                    return this._images;
                }
            },

            /**
             * Defines a search query that can be performed by search clients.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {Object[]}
             */
            queries: {
                get: function () {
                    return this._queries;
                }
            },

            /**
             * Contains the human-readable name or identifier of the creator or maintainer of the description document.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            developer: {
                get: function () {
                    return this._developer;
                }
            },

            /**
             * Contains a list of all sources or entities that should be credited for the content contained in the
             * search feed.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            attribution: {
                get: function () {
                    return this._attribution;
                }
            },

            /**
             * Contains a value that indicates the degree to which the search results provided by this search engine
             * can be queried, displayed, and redistributed.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            syndicationRight: {
                get: function () {
                    return this._syndicationRight;
                }
            },

            /**
             * Contains a value that should be set to true if the search results may contain material intended
             * only for adults.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String}
             */
            adultContent: {
                get: function () {
                    return this._adultContent;
                }
            },

            /**
             * Contains a list of strings that indicates that the search engine supports search results in the
             * specified language.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String[]}
             */
            languages: {
                get: function () {
                    return this._languages;
                }
            },

            /**
             * Contains a list of strings that indicates that the search engine supports search requests encoded with
             * the specified character encoding.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String[]}
             */
            inputEncodings: {
                get: function () {
                    return this._inputEncodings;
                }
            },

            /**
             * Contains a list of strings that indicates that the search engine supports responses encoded with the
             * specified character encoding.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {String[]}
             */
            outputEncodings: {
                get: function () {
                    return this._outputEncodings;
                }
            }

        });

        /**
         * Internal use. Applications should not call this method.
         * Parses an Image node.
         *
         * @param {Node} node The Image node to parse.
         * @typedef {{height: Number, width: Number, type: String, src: String}} Image
         * @return {Image}
         */
        OpenSearchDescriptionDocument.prototype.parseImage = function (node) {
            var image = {};
            OpenSearchUtils.getNodeAttributes(node, image);
            image.src = node.textContent;
            if(image.height) {
                image.height = Number(image.height);
            }
            if(image.width) {
                image.width = Number(image.width);
            }
            return image;
        };

        /**
         * Internal use. Applications should not call this method.
         * Parses an Query node.
         *
         * @param {Node} node The Query node to parse.
         * @return {Object} The resulting object.
         */
        OpenSearchDescriptionDocument.prototype.parseQuery = function (node) {
            var query = {};
            OpenSearchUtils.getNodeAttributes(node, query);
            return query;
        };

        /**
         * It returns the first URL from the Search document that matches the criteria.
         *
         * @public
         * @param filter {Object}
         * @param filter.supportedFormats {String[]|null} The list of search parameters for the query.
         * @param filter.requestOptions {OpenSearchRequest} The request options.
         * @param filter.searchParams {Array|null} The list of search parameters for the query.
         * @return {OpenSearchUrl|null} The first matching URL or null.
         */
        OpenSearchDescriptionDocument.prototype.findFirstSearchUrl = function(filter) {
            return this.findCompatibleUrls(filter.searchParams, filter.requestOptions, filter.supportedFormats)[0] || null;
        };

        /**
         * Indicates whether a particular extension is supported, e.g. geo, time and parameter
         *
         * @param extensionType {String} The extension type supported in this case. E.g. http://a9.com/-/opensearch/extensions/geo/1.0/
         * @return Boolean True if given extension is supported
         */
        OpenSearchDescriptionDocument.prototype.hasExtension = function(extensionType) {
            var namespaces = this._namespaces;
            var found = false;
            Object.keys(namespaces).forEach(function(namespace){
                if(namespaces[namespace] === extensionType) {
                    found = true;
                }
            });
            return found;
        };

        /**
         * Internal use. Applications should not call this method.
         * Finds a list of compatible URLs for a search request based on the specified arguments.
         *
         * @private
         * @param {Array|null} searchParams The list of search parameters for the query.
         * @param {OpenSearchRequest} requestOptions The request options.
         * @param {Array} supportedFormats The list of formats (mime types) that the requesting service can parse.
         *
         * @return {OpenSearchUrl[]} The list of matching URLs.
         */
        OpenSearchDescriptionDocument.prototype.findCompatibleUrls = function (searchParams, requestOptions, supportedFormats) {
            var urls = this.urls.filter(function (url) {
                return supportedFormats.indexOf(url.type) !== -1;
            });

            urls = urls.filter(function (url) {
                return url.relations.indexOf(requestOptions.relation) !== -1;
            });

            if (requestOptions.type) {
                urls = urls.filter(function (url) {
                    return url.type === requestOptions.type;
                });
            }

            if (requestOptions.method) {
                urls = urls.filter(function (url) {
                    return url.method === requestOptions.method;
                });
            }

            if (searchParams) {
                urls = urls.filter(function (url) {
                    return url.isCompatible(searchParams);
                });
            }

            return urls;
        };

        return OpenSearchDescriptionDocument;

    });
