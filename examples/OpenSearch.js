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
        wwd.addLayer(bmngLayer);

        wwd.navigator.lookAtLocation.latitude = 46.50;
        wwd.navigator.lookAtLocation.longitude = 6.56;
        wwd.navigator.range = 2750 * 1e3;

        // ************************************************************************************************************
        // This performs a 2-step search for Earth Observation products using the OpenSearch service and layer.

        var url = 'https://fedeo.esa.int/opensearch/description.xml';

        // Use the service for getting and parsing the OpenSearch description document
        WorldWind.OpenSearchService.create({url : url})
            .then(function (service) {
                var searchParams = [
                    {name: 'query', value: 'LAI'},
                    {name: 'organisationName', value: 'VITO'}
                ];

                // Search for collections using the given parameters
                return service.search(searchParams, {relation: 'collection'});
            })
            .then(function (response) {
                // Get the first feature with one or more search links
                var feature = response.features.filter(function (feature) {
                    return feature.properties.identifier == 'urn:eop:VITO:CGS_S2_LAI';
                })[0];

                var productSearchUrl = feature.properties.links.search[0].href;

                return WorldWind.OpenSearchService.create({url: productSearchUrl});
            })
            .then(function (service) {
                var searchParams = [
                    {name: 'startDate', value: new Date('2018-01-01T00:00:00Z')},
                    {name: 'endDate', value: new Date('2018-01-31T00:00:00Z')}
                ];

                // Search for products using the given parameters
                return service.search(searchParams);
            })
            .then(function (products) {
                // Display the products on the globe
                var layer = new WorldWind.RenderableLayer("OpenSearch Products");
                new WorldWind.GeoJSONParser(products).load(null, shapeConfigurationCallback, layer);
                wwd.addLayer(layer);

                layerManager.synchronizeLayerList();
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