/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports DescriptionDocument
 */

define([
        '../OpenSearchNamespaces',
        './OpenSearchUrl',
        '../OpenSearchUtils'
    ],
    function (OpenSearchNamespaces,
              OpenSearchUrl,
              OpenSearchUtils) {
        'use strict';

        var DescriptionDocument = function (root) {
            var ns = OpenSearchNamespaces.openSearch;

            this._shortName = OpenSearchUtils.getChildTextContent(root, 'ShortName', ns);
            this._description = OpenSearchUtils.getChildTextContent(root, 'Description', ns);
            this._urls = OpenSearchUtils.getXmlElements(root, 'Url', ns).map(function (node) {
                return new OpenSearchUrl().parse(node);
            });
            this._contact = OpenSearchUtils.getChildTextContent(root, 'Contact', ns);
            this._tags = OpenSearchUtils.getChildTextContent(root, 'Tags', ns);
            this._longName = OpenSearchUtils.getChildTextContent(root, 'LongName', ns);
            this._images = OpenSearchUtils.getXmlElements(root, 'Image', ns).map(this.parseImage);
            this._queries = OpenSearchUtils.getXmlElements(root, 'Query', ns).map(this.parseQuery);
            this._developer = OpenSearchUtils.getChildTextContent(root, 'Developer', ns);
            this._attribution = OpenSearchUtils.getChildTextContent(root, 'Attribution', ns);
            this._syndicationRight = OpenSearchUtils.getChildTextContent(root, 'SyndicationRight', ns);
            this._adultContent = OpenSearchUtils.getChildTextContent(root, 'AdultContent', ns);
            this._languages = OpenSearchUtils.getXmlElements(root, 'Language', ns).map(OpenSearchUtils.getTextContent);
            this._inputEncodings = OpenSearchUtils.getXmlElements(root, 'InputEncoding', ns).map(OpenSearchUtils.getTextContent);
            this._outputEncodings = OpenSearchUtils.getXmlElements(root, 'OutputEncoding', ns).map(OpenSearchUtils.getTextContent);
        };

        Object.defineProperties(DescriptionDocument.prototype, {

            shortName: {
                get: function () {
                    return this._shortName;
                }
            },

            description: {
                get: function () {
                    return this._description;
                }
            },

            urls: {
                get: function () {
                    return this._urls;
                }
            },

            contact: {
                get: function () {
                    return this._contact;
                }
            },

            tags: {
                get: function () {
                    return this._tags;
                }
            },

            longName: {
                get: function () {
                    return this._longName;
                }
            },

            images: {
                get: function () {
                    return this._images;
                }
            },

            queries: {
                get: function () {
                    return this._queries;
                }
            },

            developer: {
                get: function () {
                    return this._developer;
                }
            },

            attribution: {
                get: function () {
                    return this._attribution;
                }
            },

            syndicationRight: {
                get: function () {
                    return this._syndicationRight;
                }
            },

            adultContent: {
                get: function () {
                    return this._adultContent;
                }
            },

            languages: {
                get: function () {
                    return this._languages;
                }
            },

            inputEncodings: {
                get: function () {
                    return this._inputEncodings;
                }
            },

            outputEncodings: {
                get: function () {
                    return this._outputEncodings;
                }
            }

        });

        DescriptionDocument.prototype.parseImage = function (node) {
            var image = {};
            OpenSearchUtils.parseNodeAttributes(node, image);
            image.src = node.textContent;
            return image;
        };

        DescriptionDocument.prototype.parseQuery = function (node) {
            var query = {};
            OpenSearchUtils.parseNodeAttributes(node, query);
            return query;
        };

        DescriptionDocument.prototype.findCompatibleUrl = function (searchParams, requestOptions, supportedFormats) {
            var compatibleUrls = this.findCompatibleUrls(searchParams, requestOptions, supportedFormats);
            var atomUrls = compatibleUrls.filter(function (url) {
                return url.type === 'application/atom+xml';
            });
            if (atomUrls.length) {
                console.log('prefer atom');
                return atomUrls[0];
            }
            return compatibleUrls[0];
        };

        DescriptionDocument.prototype.findCompatibleUrls = function (searchParams, requestOptions, supportedFormats) {
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

        return DescriptionDocument;

    });
