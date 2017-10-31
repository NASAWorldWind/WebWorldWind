/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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
         * @alias OpenSearchDescriptionDocument
         * @constructor
         * @classdesc Represents an Open Search Description Document.
         * This object holds as properties the fields specified in the Open Search Description Document.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "shortName" and "urls".
         * @param {Node} xmlRoot An XML DOM representing the Open Search Description Document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var OpenSearchDescriptionDocument = function (xmlRoot) {
            if (!xmlRoot) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchDescriptionDocument", "constructor",
                        "missingDomElement"));
            }

            var ns = OpenSearchNamespaces.openSearch;

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
             * @type {[OpenSearchUrl]}
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
             * @type {[String]}
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
             * @type {[{height: Number, width: Number, type: String, src: String}]}
             */
            images: {
                get: function () {
                    return this._images;
                }
            },

            /**
             * Defines a search query that can be performed by search clients.
             * @memberof OpenSearchDescriptionDocument.prototype
             * @type {[Object]}
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
             * @type {[String]}
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
             * @type {[String]}
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
             * @type {[String]}
             */
            outputEncodings: {
                get: function () {
                    return this._outputEncodings;
                }
            }

        });

        /**
         * Internal use. Applications should not call this method.
         * Parses an Open Search Image node.
         *
         * @param {Node} node An Open Search Image node.
         *
         * @return {{height: Number, width: Number, type: String, src: String}}
         */
        OpenSearchDescriptionDocument.prototype.parseImage = function (node) {
            var image = {};
            OpenSearchUtils.getNodeAttributes(node, image);
            image.src = node.textContent;
            return image;
        };

        /**
         * Internal use. Applications should not call this method.
         * Parses an Open Search Query node.
         *
         * @param {Node} node An Open Search Query node.
         *
         * @return {Object}
         */
        OpenSearchDescriptionDocument.prototype.parseQuery = function (node) {
            var query = {};
            OpenSearchUtils.getNodeAttributes(node, query);
            return query;
        };

        /**
         * Internal use. Applications should not call this method.
         * Finds a compatible Open Search Url for a search request based on the supplied arguments.
         *
         * @param {Array|null} searchParams A list of search parameters for the query
         * @param {OpenSearchRequest} requestOptions
         * @param {Array} supportedFormats A list with the supported formats (mime types) that the requesting service
         * can parse.
         *
         * @return {OpenSearchUrl|null} If possible, an Atom Url will be returned.
         */
        OpenSearchDescriptionDocument.prototype.findCompatibleUrl = function (searchParams, requestOptions, supportedFormats) {
            var compatibleUrls = this.findCompatibleUrls(searchParams, requestOptions, supportedFormats);
            var atomUrls = compatibleUrls.filter(function (url) {
                return url.type === 'application/atom+xml';
            });
            if (atomUrls.length) {
                return atomUrls[0] || null;
            }
            return compatibleUrls[0] || null;
        };

        /**
         * Internal use. Applications should not call this method.
         * Finds a list of compatible Open Search Urls for a search request based on the supplied arguments.
         *
         * @param {Array|null} searchParams A list of search parameters for the query
         * @param {OpenSearchRequest} requestOptions
         * @param {Array} supportedFormats A list with the supported formats that the requesting service can parse.
         *
         * @return {[OpenSearchUrl]}
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
