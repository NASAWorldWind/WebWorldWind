/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

requirejs([
        './WorldWindShim',
        './LayerManager'
    ],
    function (WorldWind,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");
        var bmngLayer = new WorldWind.BMNGLayer();
        var openSearchLayer = new WorldWind.OpenSearchLayer('Open Search');
        wwd.addLayer(bmngLayer);
        wwd.addLayer(openSearchLayer);

        openSearchLayer.shapeConfigurationCallback = shapeConfigurationCallback;
        openSearchLayer.currentTimeInterval = [
            new Date('2013-03-06T00:00:00.000Z'),
            new Date('2013-03-12T00:00:00.000Z')
        ];

        // ************************************************************************************************************
        // This performs a 2-step search for Earth Observation products using the OpenSearch service and layer.

        var url = 'http://geo.spacebel.be/opensearch/description.xml';

        var openSearchService = new WorldWind.OpenSearchService(url);

        // Use the service for getting and parsing the OpenSearch description document
        openSearchService.discover()
            .then(function (service) {
                var searchParams = [
                    {name: 'platform', value: 'smos'}
                ];

                // Search for collections using the given parameters
                return service.search(searchParams, {relation: 'collection'});
            })
            .then(function (response) {
                // Get the first feature with one or more search links
                var feature = response.features.filter(function (feature) {
                    return !!feature.links.search;
                })[0];

                var productSearchUrl = feature.links.search[0].href;

                // Use the layer for the second step so that the results are display on the globe
                return openSearchLayer.discover({url: productSearchUrl});
            })
            .then(function (layer) {
                var searchParams = [
                    {name: 'productType', value: '{MIR_SCLF1C,MIR_SCSF1C,MIR_SCLD1C,MIR_SCSD1C}'}
                ];

                // Search for products using the given parameters
                return layer.search(searchParams);
            })
            .then(function (geoJSONCollection) {
                // Refresh the globe after the search has completed
                wwd.redraw();
            })
            .catch(function (err) {
                // Handle errors
                console.error(err);
            });

        // ************************************************************************************************************

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

        function shapeConfigurationCallback(geometry, properties) {
            var configuration = {};

            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = new WorldWind.PlacemarkAttributes();

                if (properties && (properties.name || properties.Name || properties.NAME)) {
                    configuration.name = properties.name || properties.Name || properties.NAME;
                }
                if (properties && properties.POP_MAX) {
                    var population = properties.POP_MAX;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
            }
            else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);
                configuration.attributes.drawOutline = true;
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.1 * configuration.attributes.interiorColor.red,
                    0.3 * configuration.attributes.interiorColor.green,
                    0.7 * configuration.attributes.interiorColor.blue,
                    1.0);
                configuration.attributes.outlineWidth = 1.0;
            }
            else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);
                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.6);
                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            configuration.userProperties = properties || {};

            return configuration;
        }
    });