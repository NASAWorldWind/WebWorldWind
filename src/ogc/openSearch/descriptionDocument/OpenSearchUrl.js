/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchUrl
 */

define([
        '../OpenSearchNamespaces',
        './OpenSearchParameter',
        '../OpenSearchUtils'
    ],
    function (OpenSearchNamespaces,
              OpenSearchParameter,
              OpenSearchUtils) {
        'use strict';

        var OpenSearchUrl = function () {
            this._type = '';
            this._method = '';
            this._encType = '';
            this._template = '';
            this._parameters = [];
            this._indexOffset = 1;
            this._pageOffset = 1;
            this._relations = [];

            this._baseUrl = '';

            this._paramsByName = Object.create(null);
            this._staticParams = [];
        };

        Object.defineProperties(OpenSearchUrl.prototype, {
            type: {
                get: function () {
                    return this._type;
                }
            },

            method: {
                get: function () {
                    return this._method;
                }
            },

            encType: {
                get: function () {
                    return this._encType;
                }
            },

            template: {
                get: function () {
                    return this._template;
                }
            },

            parameters: {
                get: function () {
                    return this._parameters;
                }
            },

            indexOffset: {
                get: function () {
                    return this._indexOffset;
                }
            },

            pageOffset: {
                get: function () {
                    return this._pageOffset;
                }
            },

            relations: {
                get: function () {
                    return this._relations;
                }
            }
        });

        OpenSearchUrl.prototype.parse = function (node) {
            this.parseAttributes(node);
            var templateParams = this.parseTemplate(this._template);
            var nodeParams = this.parseNodeParams(node);

            //params only in nodes, not in template
            var onlyNodeParams = nodeParams.filter(function (param) {
                return OpenSearchUrl.findParamByName(templateParams, param.name) === null;
            });

            var parameters = templateParams.map(function (templateParam) {
                var nodeParam = OpenSearchUrl.findParamByName(nodeParams, templateParam.name);
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

        OpenSearchUrl.prototype.parseAttributes = function (node) {
            this._type = node.getAttribute('type');
            this._template = node.getAttribute('template');

            var rel = node.getAttribute('rel');
            if (rel) {
                this._relations = rel.split(' ');
            }
            else {
                this._relations = ['results'];
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

        OpenSearchUrl.prototype.parseTemplate = function (template) {
            if (!template) {
                return;
            }

            var params = [];
            var urlParser = OpenSearchUrl.createUrlParser();
            urlParser.href = template;
            var queryString = urlParser.search;
            this._baseUrl = urlParser.protocol + '//' + urlParser.host + urlParser.port + urlParser.pathname;

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

        OpenSearchUrl.prototype.parseNodeParams = function (node) {
            var params = [];
            var paramNodes = OpenSearchUtils.getXmlElements(node, 'Parameter');
            if (paramNodes && paramNodes.length) {
                for (var i = 0; i < paramNodes.length; i++) {
                    params.push(OpenSearchParameter.fromNode(paramNodes[i]));
                }
            }
            return params;
        };

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

        OpenSearchUrl.prototype.createRequestUrl = function (searchParams) {
            searchParams = searchParams || [];

            var url = this._baseUrl;
            var queryParts = this._staticParams.map(function(param) {
                return param.name + '=' + param.value;
            }).concat(searchParams.map(function(param){
                return param.name + '=' + this.serializeParam(param.value);
            }, this)).join('&');

            if (queryParts.length) {
                url += '?' + queryParts;
            }

            return url;
        };

        OpenSearchUrl.prototype.createQueryParts = function (searchParams) {
            return this._staticParams.map(function(param) {
                return {name: param.name, value: this.serializeParam(param.value)};
            }, this).concat(searchParams.map(function(param) {
                return {name: param.name, value: this.serializeParam(param.value)};
            }, this));
        };

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
            if (value instanceof WorldWind.Sector) {
                return value.minLongitude + ',' + value.minLatitude + ',' + value.maxLongitude + ',' + value.maxLatitude;
            }

            return encodeURIComponent(value.toString());
        };

        OpenSearchUrl.prototype.createRequestBody = function (searchParams) {
            var formData = new FormData();
            var queryParts = this.createQueryParts(searchParams);
            queryParts.forEach(function (query) {
                formData.append(query.name, query.value);
            });
            return formData;
        };

        OpenSearchUrl.createUrlParser = function () {
            if (!OpenSearchUrl.urlParser) {
                OpenSearchUrl.urlParser = document.createElement('a');
            }
            return OpenSearchUrl.urlParser;
        };

        OpenSearchUrl.findParamByName = function (array, paramName) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (paramName === array[i].name) {
                    return array[i];
                }
            }
            return null;
        };

        return OpenSearchUrl;

    });