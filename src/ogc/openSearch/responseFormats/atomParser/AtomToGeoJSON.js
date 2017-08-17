/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports AtomToGeoJSON
 */

define([
        './GeoRssParser'
    ],
    function (GeoRssParser) {
        'use strict';

        var AtomToGeoJSON = {

            parse: function (xmlString, searchType) {
                var root = new DOMParser().parseFromString(xmlString, 'text/xml').documentElement;
                var featureCollection = {
                    id: '',
                    type: 'FeatureCollection',
                    features: [],
                    properties: {}
                };
                var properties = featureCollection.properties;

                for (var i = 0, len = root.children.length; i < len; i++) {
                    var node = root.children[i];

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
                            properties.query = AtomToGeoJSON.parseAttributesAsString(node);
                            break;

                        case 'link':
                            AtomToGeoJSON.parseFeedLinks(node, properties);
                            break;

                        case 'entry':
                            featureCollection.features.push(AtomToGeoJSON.parseEntry(node, searchType));
                            break;
                    }
                }

                return featureCollection;
            },

            parseFeedLinks: function (node, properties) {
                if (!properties.links) {
                    properties.links = {};
                }

                var links = properties.links;
                var rel = node.getAttribute('rel') || 'alternate';
                var link = AtomToGeoJSON.parseLink(node);

                if (rel === 'first' ||
                    rel === 'next' ||
                    rel === 'last') {
                    links[rel] = link
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

            parseEntry: function (entryNode, searchType) {
                var feature = {
                    id: '',
                    type: 'Feature',
                    bbox: [],
                    geometry: null,
                    properties: {}
                };
                var properties = feature.properties;

                for (var i = 0, len = entryNode.children.length; i < len; i++) {
                    var node = entryNode.children[i];

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
                            AtomToGeoJSON.parseEntryLinks(node, feature, searchType);
                            break;

                        case 'polygon':
                        case 'point':
                        case 'line':
                            feature.geometry = GeoRssParser.parseSimple(node);
                            break;

                        case 'where':
                            feature.geometry = GeoRssParser.parseGml(node);
                            break;

                        case 'box':
                            feature.bbox = GeoRssParser.parseBox(node);
                    }
                }

                return feature;
            },

            parseEntryLinks: function (node, feature, searchType) {
                if (searchType === 'collection') {
                    if (!feature.links) {
                        feature.links = {};
                    }
                    var links = feature.links;
                }
                else {
                    //searchType === 'results';
                    if (!feature.properties.links) {
                        feature.properties.links = {};
                    }
                    links = feature.properties.links;
                }
                var rel = node.getAttribute('rel') || 'alternate';
                if (rel === 'alternate') {
                    rel = 'alternates';
                }
                if (!links[rel]) {
                    links[rel] = [];
                }
                links[rel].push(AtomToGeoJSON.parseLink(node));
            }
        };

        return AtomToGeoJSON;

    });