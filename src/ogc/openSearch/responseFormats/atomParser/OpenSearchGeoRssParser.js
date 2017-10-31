/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchGeoRssParser
 */

define([
        '../../OpenSearchNamespaces',
        '../../OpenSearchUtils'
    ],
    function (OpenSearchNamespaces,
              OpenSearchUtils) {
        'use strict';

        /**
         * Parses GeoRSS to geoJSON geometry
         * GeoRSS can be encoded as Simple and GML
         * @exports OpenSearchGeoRssParser
         */
        var OpenSearchGeoRssParser = {

            /**
             * Parses GeoRSS-Simple to geoJSON geometry
             *
             * @param {Node} node the GeoRSS node
             *
             * @return {Object} a geoJSON geometry object
             */
            parseSimple: function (node) {
                var geometry = {
                    type: '',
                    coordinates: []
                };

                if (node.localName === 'polygon') {
                    geometry.type = 'Polygon';
                    geometry.coordinates.push(OpenSearchGeoRssParser.parseLocations(node));
                }
                else if (node.localName === 'point') {
                    geometry.type = 'Point';
                    geometry.coordinates = OpenSearchGeoRssParser.parseLocations(node);
                }
                else if (node.localName === 'line') {
                    geometry.type = 'LineString';
                    geometry.coordinates = OpenSearchGeoRssParser.parseLocations(node);
                }

                return geometry;
            },

            /**
             * Parses GeoRSS-GML to geoJSON geometry
             *
             * @param {Node} node the GeoRSS node
             *
             * @return {Object} a geoJSON geometry object
             */
            parseGml: function (node) {
                var geometry = {
                    type: '',
                    coordinates: []
                };
                var firstChild = node.firstElementChild;

                switch (firstChild.localName) {
                    case 'Point':
                        geometry.type = 'Point';
                        var posNode = OpenSearchUtils.getXmlElements(firstChild, 'pos')[0];
                        if (posNode) {
                            geometry.coordinates = OpenSearchGeoRssParser.parseLocations(posNode);
                        }
                        break;

                    case 'LineString':
                        geometry.type = 'LineString';
                        var posList = OpenSearchUtils.getXmlElements(firstChild, 'posList')[0];
                        if (posList) {
                            geometry.coordinates = OpenSearchGeoRssParser.parseLocations(posList);
                        }
                        break;

                    case 'Polygon':
                        geometry.type = 'Polygon';
                        geometry.coordinates = OpenSearchGeoRssParser.parseGmlPolygon(firstChild);
                        break;

                    case 'MultiSurface':
                        geometry.type = 'MultiPolygon';
                        geometry.coordinates = [OpenSearchGeoRssParser.parseMultiPolygon(firstChild)];
                        break;

                    default:
                        break;
                }

                return geometry;
            },

            /**
             * Parses a GeoRSS box to geoJSON bbox
             *
             * @param {Node} node the GeoRSS box node
             *
             * @return {Array} a geoJSON bbox array
             */
            parseBox: function (node) {
                var locations = OpenSearchGeoRssParser.parseLocations(node);
                return [].concat.apply([], locations);
            },

            /**
             * Extracts the coordinates of a GeoRSS node as a geoJSON coordinates array.
             *
             * @param {Node} node the GeoRSS node
             *
             * @return {Array} a geoJSON coordinates array
             */
            parseLocations: function (node) {
                var points = node.textContent.trim().replace(/\s+/g, ' ').split(' ');
                var locations = [];
                for (var i = 0; i < points.length; i += 2) {
                    var lat = +points[i];
                    var lon = +points[i + 1];
                    locations.push([lon, lat]);
                }
                return locations;
            },

            /**
             * Extracts the coordinates of a GeoRSS-GML Polygon node as a geoJSON coordinates array.
             *
             * @param {Node} node the GeoRSS-GML Polygon node
             *
             * @return {Array} a geoJSON coordinates array
             */
            parseGmlPolygon: function (node) {
                var exteriorPosList = OpenSearchUtils.getXmlElements(node, 'posList')[0];
                var interiorNodes = OpenSearchUtils.getXmlElements(node, 'interior');

                var exteriorLocations = OpenSearchGeoRssParser.parseLocations(exteriorPosList);

                var interiors = [];
                for (var i = 0; i < interiorNodes.length; i++) {
                    var interiorPosList = OpenSearchUtils.getXmlElements(interiorNodes[i], 'posList')[0];
                    if (interiorPosList) {
                        var interiorLocations = OpenSearchGeoRssParser.parseLocations(interiorPosList);
                        interiors.push(interiorLocations);
                    }
                }

                return exteriorLocations.concat(interiors);
            },

            /**
             * Extracts the coordinates of a GeoRSS-GML MultiSurface node as a geoJSON coordinates array.
             *
             * @param {Node} node the GeoRSS-GML MultiSurface node
             *
             * @return {Array} a geoJSON coordinates array
             */
            parseMultiPolygon: function (node) {
                //node can contain a single 'surfaceMembers' element and/or multiple 'surfaceMember' elements

                var polygons = OpenSearchUtils.getXmlElements(node, 'surfaceMember').map(function (surfaceMember) {
                    return OpenSearchUtils.getXmlElements(surfaceMember, 'Polygon');
                });

                var surfaceMembers = OpenSearchUtils.getXmlElements(node, 'surfaceMembers')[0];
                if (surfaceMembers) {
                    polygons = polygons.concat(OpenSearchUtils.getXmlElements(surfaceMembers, 'Polygon'));
                }

                return polygons.map(function (polygon) {
                    return OpenSearchGeoRssParser.parseGmlPolygon(polygon);
                });
            }

        };

        return OpenSearchGeoRssParser;
    });