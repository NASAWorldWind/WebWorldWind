/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchUtils
 */

define([
        '../../util/Promise'
    ],
    function (Promise) {
        'use strict';

        /**
         * Provides utilities for the OpenSearch.
         * @exports OpenSearchUtils
         */
        var OpenSearchUtils = {

            /**
             * Gets the trimmed text content of the first child node starting from a root node
             *
             * @param {Node} parent The root node from which to start the search
             * @param {String} localName The local name (without the namespace) of the child node which contains the
             * text content
             * @param {String|null} namespaceURI The namespaceURI of the child
             *
             * @return {String} The text content of the specified child node
             */
            getChildTextContent: function (parent, localName, namespaceURI) {
                var collection = this.getXmlElements(parent, localName, namespaceURI);
                if (collection.length) {
                    return collection[0].textContent.trim();
                }
                return '';
            },

            /**
             * Gets the trimmed text content of node.
             *
             * @param {Node} node The node from which to get the text content
             *
             * @return {String} The text content of the specified child node
             */
            getTextContent: function (node) {
                return node.textContent.trim();
            },

            /**
             * Finds all the child nodes, that match the localName and namespaceURI, starting from a root node.
             *
             * @param {Node} parent The root node from which to start the search
             * @param {String} localName The local name (without the namespace) of the child node
             * @param {String|null} namespaceURI The namespaceURI of the child
             *
             * @return {[Node]} An array of Nodes.
             */
            getXmlElements: function (parent, localName, namespaceURI) {
                var collection;
                if (namespaceURI) {
                    collection = parent.getElementsByTagNameNS(namespaceURI, localName);
                }
                else {
                    collection = parent.getElementsByTagName(localName);
                    //Firefox does not return namespace nodes with getElementsByTagName
                    if (!collection.length) {
                        collection = parent.getElementsByTagNameNS('*', localName);
                    }
                }
                if (collection && collection.length) {
                    return [].slice.call(collection);
                }
                return [];
            },

            /**
             * Gets the attributes of a Node and stores them in an Object
             *
             * @param {Node} node
             * @param {Object} result An object to store the attributes
             *
             * @return {Object}
             */
            getNodeAttributes: function (node, result) {
                for (var i = 0, len = node.attributes.length; i < len; i++) {
                    var attribute = node.attributes[i];
                    result[attribute.name] = attribute.value;
                }
                return result;
            },

            /**
             * Finds a value in an array that satisfies the provided testing function.
             *
             * @param {Array} array The array to search in.
             * @param {Function} predicate Function to execute on each value in the array, taking three arguments:
             * element The current element being processed in the array.
             * index The index of the current element being processed in the array.
             * array The array find was called upon.
             * @param {Object|null} context Object to use as "this" when executing the predicate function.
             *
             * @return {Any|undefined} the value of the first element in the array that satisfies the provided testing
             * function. Otherwise undefined is returned.
             */
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

            /**
             * Parses a xml string and return the root element.
             *
             * @param {String} xmlString The xml to parse
             * @return {Element} The root element of the parsed document
             */
            parseXml: function (xmlString) {
                var xmlDOM = new DOMParser().parseFromString(xmlString, 'text/xml');
                return xmlDOM.documentElement;
            },

            /**
             * Provides an interface for fetching resources.
             *
             * @param {OpenSearchRequest} options
             * @return {Promise} A promise that resolves with the response or rejects with an error
             */
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

                    xhr.open(options.method, options.url, true, options.user, options.password);

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