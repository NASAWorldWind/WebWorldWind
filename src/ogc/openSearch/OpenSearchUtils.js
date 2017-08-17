/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchUtils
 */

define([],
    function () {
        'use strict';

        var OpenSearchUtils = {

            getChildTextContent: function (parent, localName, namespaceURI) {
                var collection = this.getXmlElements(parent, localName, namespaceURI);
                if (collection.length) {
                    return collection[0].textContent.trim();
                }
                return '';
            },

            getChildTextContentWithCodeSpace: function (parent, localName, namespaceURI) {
                var collection = this.getXmlElements(parent, localName, namespaceURI);
                if (collection.length) {
                    var node = collection[0];
                    return {
                        codeSpace: node.getAttribute('codeSpace'),
                        value: node.textContent.trim()
                    };
                }
            },

            getChildTextContentWithUom: function (parent, localName, namespaceURI) {
                var collection = this.getXmlElements(parent, localName, namespaceURI);
                if (collection.length) {
                    var node = collection[0];
                    return {
                        uom: node.getAttribute('uom'),
                        value: node.textContent.trim()
                    };
                }
            },

            getFileNameLink: function (parent, localName, namespaceURI) {
                var fileNameNode = this.getXmlElements(parent, localName, namespaceURI)[0];
                if (fileNameNode) {
                    var ServiceReference = this.getXmlElements(fileNameNode, 'ServiceReference')[0];
                    if (ServiceReference) {
                        return ServiceReference.getAttribute('xlink:href');
                    }
                }
            },

            getTextContent: function (node) {
                return node.textContent.trim();
            },

            getXmlElements: function (parent, localName, namespaceURI) {
                var collection;
                if (namespaceURI) {
                    collection = parent.getElementsByTagNameNS(namespaceURI, localName);
                }
                else {
                    collection = parent.getElementsByTagName(localName);
                    //hack, Firefox does not return NS nodes with getElementsByTagName
                    if (!collection.length) {
                        collection = parent.getElementsByTagNameNS('*', localName);
                    }
                }
                if (collection && collection.length) {
                    return [].slice.call(collection);
                }
                return [];
            },

            getChildren: function (parent, namespaceURI) {
                return [].slice.call(parent.childNodes).filter(function (node) {
                    if (namespaceURI) {
                        return node.nodeType === 1 && node.namespaceURI === namespaceURI;
                    }
                    return node.nodeType === 1;
                });
            },

            parseChildNodes: function (childNodesInfo, parentNode, result) {
                result = result || {};
                var self = this;
                childNodesInfo.forEach(function (nodeEntry) {
                    var value;
                    if (nodeEntry.attribute === 'codeSpace') {
                        value = self.getChildTextContentWithCodeSpace(parentNode, nodeEntry.name);
                    }
                    else if (nodeEntry.attribute === 'uom') {
                        value = self.getChildTextContentWithUom(parentNode, nodeEntry.name);
                    }
                    else if (nodeEntry.attribute === 'xlink:href') {
                        value = self.getFileNameLink(parentNode, nodeEntry.name);
                    }
                    else {
                        value = self.getChildTextContent(parentNode, nodeEntry.name);
                    }
                    if (value) {
                        result[nodeEntry.name] = value;
                    }
                });
                return result;
            },

            parseNodeAttributes: function (node, result) {
                for (var i = 0, len = node.attributes.length; i < len; i++) {
                    var attribute = node.attributes[i];
                    result[attribute.name] = attribute.value;
                }
                return result;
            },

            getAttributeAsString: function (node, attribute, ns, defaultValue) {
                var value = this.getNodeAttribute(node, attribute, ns);
                if (value == null && defaultValue) {
                    return defaultValue;
                }
                return value;
            },

            getAttributeAsNumber: function (node, attribute, ns, defaultValue) {
                var value = this.getNodeAttribute(node, attribute, ns);
                if (value == null && defaultValue) {
                    return defaultValue;
                }
                return +value;
            },

            getAttributeAsArray: function (node, attribute, ns, defaultValue) {
                var value = this.getNodeAttribute(node, attribute, ns);
                if (value == null && defaultValue) {
                    return defaultValue;
                }
                return value;
            },

            getNodeAttribute: function (node, attribute, ns) {
                if (ns) {
                    return node.getAttributeNS(ns, attribute);
                }
                return node.getAttribute(attribute);
            },

            arrayFind: function (array, predicate, context) {
                if (!Array.isArray(array)) {
                    throw (new Error('arrayFind - missing array'));
                }
                if (typeof predicate !== 'function') {
                    throw (new Error('arrayFind - missing predicate'));
                }

                for (var i = 0, len = array.length; i < len; i++) {
                    if (predicate.call(context, array[i], i, array)) {
                        return array[i];
                    }
                }
            },

            parseXml: function (xmlString) {
                var xml = new DOMParser().parseFromString(xmlString, 'text/xml');
                return xml.documentElement;
            },

            fetch: function (options) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();

                    xhr.onload = function () {
                        if (this.status >= 200 && this.status < 300) {
                            return resolve(this.response);
                        }
                        return reject(new Error(this.status + ' ' + this.statusText));
                    };

                    xhr.onerror = function () {
                        return reject(new Error('Unable to fetch data'));
                    };

                    xhr.ontimeout = function () {
                        return reject(new Error('Request timed out'));
                    };

                    xhr.open(options.method, options.url, true);

                    xhr.withCredentials = options.withCredentials;

                    xhr.timeout = options.timeout;

                    xhr.responseType = options.responseType;

                    Object.keys(options.headers).forEach(function (key) {
                        xhr.setRequestHeader(key, options.headers[key]);
                    });

                    xhr.send(options.body);
                });
            }

        };

        return OpenSearchUtils;
    });