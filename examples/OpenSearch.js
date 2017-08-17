/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");
        var BMNGLayer = new WorldWind.BMNGLayer();
        var openSearchLayer = new WorldWind.OpenSearchLayer('Open Search');
        wwd.addLayer(BMNGLayer);
        wwd.addLayer(openSearchLayer);

        wwd.navigator.lookAtLocation.latitude = 55;
        wwd.navigator.lookAtLocation.longitude = 0;
        wwd.navigator.range = 40e5;

        openSearchLayer.shapeConfigurationCallback = shapeConfigurationCallback;
        openSearchLayer.currentTimeInterval = [
            new Date('2002-11-15T10:04:03.000Z'),
            new Date('2002-11-15T10:04:20.000Z')
        ];

        /*** Using the OpenSearchService to do a two step search search ***/

        var searchParams = [
            {name: 'count', value: 5}
        ];

        var openSearchService = new WorldWind.OpenSearchService('http://sxcat.eox.at/opensearch');
        openSearchService.discover()
            .then(function (service) {
                return service.search(null, {relation: 'collection'});
            })
            .then(function (geoJSONCollection) {
                console.log('collection results', geoJSONCollection);

                //not all results contain geo products, some are for calibration data
                var feature = geoJSONCollection.features[25];

                var productSearchUrl = feature.properties.links.search[0].href;
                console.log('search link', feature.properties.links.search[0]);
                console.log('feature title', feature.properties.title);

                return openSearchLayer.discover({url: productSearchUrl});
            })
            .then(function (layer) {
                console.log('description document', layer.descriptionDocument);
                console.log('search urls', layer.descriptionDocument.urls);

                //Only interested in urls that contain results and return an atom response.
                var url = layer.descriptionDocument.urls.filter(function(url) {
                    return (
                        url.relations.indexOf('results') >= 0 &&
                        url.type === 'application/atom+xml'
                    );
                })[0];
                console.log('searchParams', url.parameters);
                return layer.search(searchParams);
            })
            .then(function (geoJSONCollection) {
                console.log('products results', geoJSONCollection);
                wwd.redraw();
            })
            .catch(function (err) {
                console.error(err);
            });

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        function shapeConfigurationCallback(geometry, properties) {
            var configuration = {};

            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

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