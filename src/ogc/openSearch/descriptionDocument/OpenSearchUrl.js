/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchUrl
 */

define([
        '../OpenSearchConstants',
        '../OpenSearchNamespaces',
        './OpenSearchParameter',
        '../OpenSearchUtils'
    ],
    function (OpenSearchConstants,
              OpenSearchNamespaces,
              OpenSearchParameter,
              OpenSearchUtils) {
        'use strict';

        /**
         * Constructs an OpenSearchUrl.
         * @alias OpenSearchUrl
         * @constructor
         * @classdesc Represents an Open Search Url.
         * The Open Search Url describes an interface by which a client can make requests for an external resource,
         * such as search results, or additional description documents.
         * This object holds as properties the fields for a Open Search Url node.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         */
        var OpenSearchUrl = function () {
            this._type = '';
            this._method = '';
            this._encType = '';
            this._template = '';
            this._parameters = [];
            this._indexOffset = 1;
            this._pageOffset = 1;
            this._relations = [];

            //Internal. The base url of the template.
            this._baseUrl = '';
            //Internal. A map of the parameters of this OpenSearchUrl
            this._paramsByName = Object.create(null);
            //Internal. A list of the parameters that are not meant to be replaced.
            this._staticParams = [];
        };

        Object.defineProperties(OpenSearchUrl.prototype, {
            /**
             * The mime type of the resource being described.
             * @memberof OpenSearchUrl.prototype
             * @type {String}
             */
            type: {
                get: function () {
                    return this._type;
                }
            },

            /**
             * A valid HTTP verb for this Url
             * @memberof OpenSearchUrl.prototype
             * @type {String}
             */
            method: {
                get: function () {
                    return this._method;
                }
            },

            /**
             * The encoding for POST or PUT requests
             * @memberof OpenSearchUrl.prototype
             * @type {String}
             */
            encType: {
                get: function () {
                    return this._encType;
                }
            },

            /**
             * Represent a parameterized form of the URL by which a search engine is queried.
             * @memberof OpenSearchUrl.prototype
             * @type {String}
             */
            template: {
                get: function () {
                    return this._template;
                }
            },

            /**
             * A list with the parameters
             * @memberof OpenSearchUrl.prototype
             * @type {[OpenSearchParameter]}
             */
            parameters: {
                get: function () {
                    return this._parameters;
                }
            },

            /**
             * The index number of the first search result.
             * @memberof OpenSearchUrl.prototype
             * @type {Number}
             * @default 1
             */
            indexOffset: {
                get: function () {
                    return this._indexOffset;
                }
            },

            /**
             * The page number of the first set of search results.
             * @memberof OpenSearchUrl.prototype
             * @type {Number}
             * @default 1
             */
            pageOffset: {
                get: function () {
                    return this._pageOffset;
                }
            },

            /**
             * The role of the resource being described in relation to the description document.
             * @memberof OpenSearchUrl.prototype
             * @type {[String]}
             * @default ['results']
             */
            relations: {
                get: function () {
                    return this._relations;
                }
            }
        });

        /**
         * Internal use. Applications should not call this method.
         * Parses an Open Search Url node.
         *
         * @param {Node} node An Open Search Url node.
         *
         * @return {OpenSearchUrl}
         */
        OpenSearchUrl.prototype.parse = function (node) {
            this.parseAttributes(node);
            var templateParams = this.parseTemplate(this._template);
            if (!templateParams) {
                return this;
            }
            var nodeParams = this.parseNodeParams(node);

            //params only in nodes, not in template
            var onlyNodeParams = nodeParams.filter(function (param) {
                var templateParam = OpenSearchUtils.arrayFind(templateParams, function(templateParam) {
                    return templateParam.name === param.name;
                });
                return templateParam == null;
            });

            var parameters = templateParams.map(function (templateParam) {
                var nodeParam = OpenSearchUtils.arrayFind(nodeParams, function (nodeParam) {
                    return nodeParam.name === templateParam.name;
                });
                if (nodeParam) {
                    return templateParam.merge(nodeParam)
                }
                return templateParam;
            }).concat(onlyNodeParams);

            this._parameters = parameters.filter(function (param) {
                return param.replaceable;
            });

            this._staticParams = parameters.filter(function (param) {
                return !param.replaceable;
            });

            this._parameters.forEach(function (param) {
                this._paramsByName[param.name] = param;
            }, this);

            return this;
        };

        /**
         * Internal use. Applications should not call this method.
         * Parses the attributes of an Open Search Url node and stores the result in this OpenSearchUrl instance.
         *
         * @param {Node} node An Open Search Url node
         */
        OpenSearchUrl.prototype.parseAttributes = function (node) {
            this._type = node.getAttribute('type');
            this._template = node.getAttribute('template');

            var rel = node.getAttribute('rel');
            if (rel) {
                this._relations = rel.split(' ');
            }
            else {
                this._relations = [OpenSearchConstants.RESULTS];
            }

            this._indexOffset = node.getAttribute('indexOffset');
            if (this._indexOffset) {
                this._indexOffset = +this._indexOffset;
            }
            else {
                this._indexOffset = 1;
            }

            this._pageOffset = node.getAttribute('pageOffset');
            if (this._pageOffset) {
                this._pageOffset = +this._pageOffset;
            }
            else {
                this._pageOffset = 1;
            }

            this._method = node.getAttributeNS(OpenSearchNamespaces.parameters, 'method') || 'GET';
            this._encType = node.getAttributeNS(OpenSearchNamespaces.parameters, 'enctype') || 'application/x-www-form-urlencoded';
        };

        /**
         * Internal use. Applications should not call this method.
         * Parses an Open Search Url template and extracts the search parameters.
         *
         * @param {String} template The URL template to be processed
         * @return {[OpenSearchParameter]|undefined}
         */
        OpenSearchUrl.prototype.parseTemplate = function (template) {
            if (!template) {
                return;
            }

            var params = [];
            var urlParser = OpenSearchUrl.createUrlParser();
            urlParser.href = template;
            var queryString = urlParser.search;
            this._baseUrl = urlParser.protocol + '//' + urlParser.host + urlParser.port + urlParser.pathname;
            this._baseUrl = urlParser.protocol + '//' + urlParser.hostname;
            if (urlParser.port) {
                this._baseUrl += ':' + urlParser.port;
            }
            if (urlParser.pathname) {
                if (urlParser.pathname[0] === '/') {
                    this._baseUrl += urlParser.pathname;
                }
                else {
                    this._baseUrl += '/' + urlParser.pathname;
                }
            }


            if (!queryString) {
                return params;
            }

            if (queryString[0] === '?') {
                queryString = queryString.slice(1);
            }
            queryString = queryString.replace(/&(?!amp;)/g, "&amp;");
            var queries = queryString.split('&amp;');
            for (var i = 0; i < queries.length; i++) {
                params.push(OpenSearchParameter.fromQuery(queries[i]));
            }

            return params;
        };

        /**
         * Internal use. Applications should not call this method.
         * Parses an Open Search Url and extracts the parameters from the Parameter node introduced with the
         * Open Search Parameter extension.
         *
         * @param {Node} node An Open Search Url node
         *
         * @return {[OpenSearchParameter]}
         */
        OpenSearchUrl.prototype.parseNodeParams = function (node) {
            var paramNodes = OpenSearchUtils.getXmlElements(node, 'Parameter');
            return paramNodes.map(function (paramNode) {
                return OpenSearchParameter.fromNode(paramNode);
            });
        };

        /**
         * Internal use. Applications should not call this method.
         * Checks if this OpenSearchUrl is compatible with the search parameters supplied.
         *
         * @param {Array} searchParams A list of search parameters
         *
         * @return {Boolean}
         */
        OpenSearchUrl.prototype.isCompatible = function (searchParams) {
            var compatible = searchParams.every(function (searchParam) {
                return searchParam.name in this._paramsByName;
            }, this);

            if (!compatible) {
                return false;
            }

            var missingRequiredParams = this._parameters.filter(function (param) {
                return (
                    param.required &&
                    !searchParams.some(function (searchParam) {
                        return searchParam.name === param.name;
                    })
                );
            });

            return missingRequiredParams.length === 0;
        };

        /**
         * Internal use. Applications should not call this method.
         * Creates a query url for the supplied search params to be used for GET requests.
         *
         * @param {Array|null} searchParams A list of search parameters
         *
         * @return {String} The url
         */
        OpenSearchUrl.prototype.createRequestUrl = function (searchParams) {
            searchParams = searchParams || [];

            var url = this._baseUrl;
            var queryParts = this._staticParams.map(function (param) {
                return param.name + '=' + param.value;
            }).concat(searchParams.map(function (param) {
                return param.name + '=' + this.serializeParam(param.value);
            }, this)).join('&');

            if (queryParts.length) {
                url += '?' + queryParts;
            }

            return url;
        };

        /**
         * Internal use. Applications should not call this method.
         * Creates the request body for the supplied search params to be used for POST or PUT requests.
         *
         * @param {Array|null} searchParams A list of search parameters
         *
         * @return {FormData}
         */
        OpenSearchUrl.prototype.createRequestBody = function (searchParams) {
            var formData = new FormData();
            var queryParts = this.createQueryParts(searchParams);
            queryParts.forEach(function (query) {
                formData.append(query.name, query.value);
            });
            return formData;
        };

        /**
         * Internal use. Applications should not call this method.
         * Creates an key-value pair Object with the name and value of the search params.
         *
         * @param {Array|null} searchParams A list of search parameters
         *
         * @return {Array}
         */
        OpenSearchUrl.prototype.createQueryParts = function (searchParams) {
            searchParams = searchParams || [];

            return this._staticParams.map(function (param) {
                return {name: param.name, value: this.serializeParam(param.value)};
            }, this).concat(searchParams.map(function (param) {
                return {name: param.name, value: this.serializeParam(param.value)};
            }, this));
        };

        /**
         * Internal use. Applications should not call this method.
         * Serializes a value to be used for a GET request.
         *
         * @param {*} value The value to be serialized
         *
         * @return {String} The serialized value
         */
        OpenSearchUrl.prototype.serializeParam = function (value) {
            if (typeof value === 'string') {
                return encodeURIComponent(value);
            }
            if (typeof value === 'number') {
                return value.toString();
            }
            if (value instanceof Date) {
                return value.toISOString();
            }
            if (value &&
                typeof value === 'object' &&
                value.minLongitude != null &&
                value.minLatitude != null &&
                value.maxLongitude != null &&
                value.maxLatitude != null) {
                return value.minLongitude + ',' + value.minLatitude + ',' + value.maxLongitude + ',' + value.maxLatitude;
            }

            return encodeURIComponent(String(value));
        };

        /**
         * Internal use. Applications should not call this method.
         * Creates an Url parser as an anchor element.
         * @return {HTMLElement} An anchor element
         */
        OpenSearchUrl.createUrlParser = function () {
            if (!OpenSearchUrl.urlParser) {
                OpenSearchUrl.urlParser = document.createElement('a');
            }
            return OpenSearchUrl.urlParser;
        };

        return OpenSearchUrl;

    });