/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoRssParser
 */

define([
        '../../OpenSearchNamespaces',
        '../../OpenSearchUtils'
    ],
    function (OpenSearchNamespaces,
              OpenSearchUtils) {
        'use strict';

        var GeoRssParser = {
            parseSimple: function (node) {
                var geometry = {
                    type: '',
                    coordinates: []
                };

                if (node.localName === 'polygon') {
                    geometry.type = 'Polygon';
                    geometry.coordinates.push(GeoRssParser.parseLocations(node));
                }
                else if (node.localName === 'point') {
                    geometry.type = 'Point';
                    geometry.coordinates = GeoRssParser.parseLocations(node);
                }
                else if (node.localName === 'line') {
                    geometry.type = 'LineString';
                    geometry.coordinates = GeoRssParser.parseLocations(node);
                }

                return geometry;
            },

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
                            geometry.coordinates = GeoRssParser.parseLocations(posNode);
                        }
                        break;

                    case 'LineString':
                        geometry.type = 'LineString';
                        var posList = OpenSearchUtils.getXmlElements(firstChild, 'posList')[0];
                        if (posList) {
                            geometry.coordinates = GeoRssParser.parseLocations(posList);
                        }
                        break;

                    case 'Polygon':
                        geometry.type = 'Polygon';
                        geometry.coordinates = GeoRssParser.parseGmlPolygon(firstChild);
                        break;

                    case 'MultiSurface':
                        geometry.type = 'MultiPolygon';
                        geometry.coordinates = [GeoRssParser.parseMultiPolygon(firstChild)];
                        break;

                    default:
                        break;
                }

                return geometry;
            },

            parseBox: function (node) {
                var locations = GeoRssParser.parseLocations(node);
                return [].concat.apply([], locations);
            },

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

            parseGmlPolygon: function (node) {
                var exteriorPosList = OpenSearchUtils.getXmlElements(node, 'posList')[0];
                var interiorNodes = OpenSearchUtils.getXmlElements(node, 'interior');

                var exteriorLocations = GeoRssParser.parseLocations(exteriorPosList);

                var interiors = [];
                for (var i = 0; i < interiorNodes.length; i++) {
                    var interiorPosList = OpenSearchUtils.getXmlElements(interiorNodes[i], 'posList')[0];
                    if (interiorPosList) {
                        var interiorLocations = GeoRssParser.parseLocations(interiorPosList);
                        interiors.push(interiorLocations);
                    }
                }

                return exteriorLocations.concat(interiors);
            },

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
                    return GeoRssParser.parseGmlPolygon(polygon);
                });
            }

        };

        return GeoRssParser;
    });