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
 * @exports OpenSearchAtomParser
 */

define([
        '../../OpenSearchConstants',
        './OpenSearchGeoRssParser'
    ],
    function (OpenSearchConstants,
              OpenSearchGeoRssParser) {
        'use strict';

        /**
         * Parses Atom for EO to GeoJSON.
         *
         * @exports OpenSearchAtomParser
         */
        var OpenSearchAtomParser = {

            /**
             * Parses Atom for EO as GeoJSON feature collection.
             *
             * @param {String} xmlString The Atom response as a string.
             * @param {String} searchType The relation type.
             *
             * @return {Object} The resulting GeoJSON feature collection.
             */
            parse: function (xmlString, searchType) {
                var root = new DOMParser().parseFromString(xmlString, 'text/xml').documentElement;
                var featureCollection = {
                    id: '',
                    type: 'FeatureCollection',
                    features: [],
                    properties: {}
                };
                var properties = featureCollection.properties;

                for (var i = 0, len = root.childNodes.length; i < len; i++) {
                    var node = root.childNodes[i];

                    if (node.nodeType !== 1) {
                        continue;
                    }

                    switch (node.localName) {
                        case 'id':
                            featureCollection.id = node.textContent.trim();
                            break;

                        case 'title':
                        case 'updated':
                        case 'rights':
                            properties[node.localName] = node.textContent.trim();
                            break;

                        case 'generator':
                            properties.creator = node.textContent.trim();
                            break;

                        case 'totalResults':
                        case 'startIndex':
                        case 'itemsPerPage':
                            properties[node.localName] = +node.textContent.trim();
                            break;

                        case 'Query':
                            properties.query = OpenSearchAtomParser.parseAttributesAsString(node);
                            break;

                        case 'link':
                            OpenSearchAtomParser.parseFeedLinks(node, properties);
                            break;

                        case 'entry':
                            featureCollection.features.push(OpenSearchAtomParser.parseEntry(node, searchType));
                            break;

                        default:
                            break;
                    }
                }

                return featureCollection;
            },

            /**
             * Parses the links in the feed node.
             *
             * @param {Node} node The link node to parse.
             * @param {Object} result The object to store the parsed results.
             */
            parseFeedLinks: function (node, result) {
                if (!result.links) {
                    result.links = {};
                }

                var links = result.links;
                var rel = node.getAttribute('rel') || 'alternate';
                var link = OpenSearchAtomParser.parseLink(node);

                if (rel === 'first' ||
                    rel === 'next' ||
                    rel === 'last') {
                    links[rel] = link;
                }
                else {
                    if (rel === 'alternate') {
                        rel = 'alternates';
                    }
                    if (!links[rel]) {
                        links[rel] = [];
                    }
                    links[rel].push(link);
                }
            },

            /**
             * Parses an Atom link node.
             *
             * @param {Node} node The link node to parse.
             *
             * @return {Object} The object containing the attributes values from the link node.
             */
            parseLink: function (node) {
                var link = {};
                var href = node.getAttribute('href');
                var type = node.getAttribute('type');
                var title = node.getAttribute('title');
                var hreflang = node.getAttribute('hreflang');

                link.href = href;
                if (type) {
                    link.type = type;
                }
                if (title) {
                    link.title = title;
                }
                if (hreflang) {
                    link.hreflang = hreflang;
                }

                return link;
            },

            /**
             * Parses the attributes of a node as a string.
             *
             * Each attribute is in the format name="value".
             * The attributes are delimited by a space.
             * Example: 'name="value" name="value"'
             *
             * @param {Node} node The node to parse.
             *
             * @return {String} The resulting string.
             */
            parseAttributesAsString: function (node) {
                var attributes = '';
                for (var i = 0, len = node.attributes.length; i < len; i++) {
                    var attribute = node.attributes[i];
                    attributes += attribute.name + '="' + attribute.value + '"';
                    if (i < len - 1) {
                        attributes += ' ';
                    }
                }
                return attributes;
            },

            /**
             * Parses an Atom entry node as a GeoJSON feature.
             *
             * @param {Node} entryNode The entry node to parse.
             * @param {String} searchType The relation type.
             *
             * @return {Object} The resulting GeoJSON feature.
             */
            parseEntry: function (entryNode, searchType) {
                var feature = {
                    id: '',
                    type: 'Feature',
                    bbox: [],
                    geometry: null,
                    properties: {}
                };
                var properties = feature.properties;

                for (var i = 0, len = entryNode.childNodes.length; i < len; i++) {
                    var node = entryNode.childNodes[i];

                    if (node.nodeType !== 1) {
                        continue;
                    }

                    switch (node.localName) {
                        case 'id':
                            feature.id = node.textContent.trim();
                            break;

                        case 'title':
                        case 'date':
                        case 'identifier':
                        case 'updated':
                        case 'rights':
                        case 'published':
                            properties[node.localName] = node.textContent.trim();
                            break;

                        case 'category':
                            if (!properties.categories) {
                                properties.categories = [];
                            }
                            properties.categories.push({
                                label: node.getAttribute('label'),
                                term: node.getAttribute('term')
                            });
                            break;

                        case 'link':
                            OpenSearchAtomParser.parseEntryLinks(node, feature, searchType);
                            break;

                        case 'polygon':
                        case 'point':
                        case 'line':
                            feature.geometry = OpenSearchGeoRssParser.parseSimple(node);
                            break;

                        case 'where':
                            feature.geometry = OpenSearchGeoRssParser.parseGml(node);
                            break;

                        case 'box':
                            feature.bbox = OpenSearchGeoRssParser.parseBox(node);
                            break;

                        default:
                            break;
                    }
                }

                return feature;
            },

            /**
             * Parses the links in the entry node.
             *
             * @param {Node} node The link node to parse.
             * @param {Object} result The object to store the parsed results.
             * @param {String} searchType The relation type.
             */
            parseEntryLinks: function (node, result, searchType) {
                if (searchType === OpenSearchConstants.COLLECTION) {
                    if (!result.links) {
                        result.links = {};
                    }
                    var links = result.links;
                }
                else {
                    //searchType === 'results';
                    if (!result.properties.links) {
                        result.properties.links = {};
                    }
                    links = result.properties.links;
                }
                var rel = node.getAttribute('rel') || 'alternate';
                if (rel === 'alternate') {
                    rel = 'alternates';
                }
                if (!links[rel]) {
                    links[rel] = [];
                }
                links[rel].push(OpenSearchAtomParser.parseLink(node));
            }
        };

        return OpenSearchAtomParser;

    });