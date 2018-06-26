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
 * Illustrates how to load and display GeoJSON data.
 */

requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            // Add atmosphere layer on top of base layer.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Set up the common placemark attributes.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 0.05;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.5);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

        var shapeConfigurationCallback = function (geometry, properties) {
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
                configuration.attributes.outlineWidth = 2.0;
            }
            else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.5);
                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            return configuration;
        };

        var parserCompletionCallback = function (layer) {
            wwd.addLayer(layer);
            layerManager.synchronizeLayerList();
        };

        var resourcesUrl = "https://worldwind.arc.nasa.gov/web/examples/data/geojson-data/";

        // Polygon test
        var polygonLayer = new WorldWind.RenderableLayer("Polygon - Romania");
        var polygonGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "PolygonTest.geojson");
        polygonGeoJSON.load(null, shapeConfigurationCallback, polygonLayer);
        wwd.addLayer(polygonLayer);

        // MultiPolygon test
        var multiPolygonLayer = new WorldWind.RenderableLayer("MultiPolygon - Italy");
        var multiPolygonGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "MultiPolygonTest.geojson");
        multiPolygonGeoJSON.load(null, shapeConfigurationCallback, multiPolygonLayer);
        wwd.addLayer(multiPolygonLayer);

        //Point test
        var pointLayer = new WorldWind.RenderableLayer("Point - Bucharest");
        var pointGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "PointTest.geojson");
        pointGeoJSON.load(null, shapeConfigurationCallback, pointLayer);
        wwd.addLayer(pointLayer);

        //MultiPoint test
        var multiPointLayer = new WorldWind.RenderableLayer("MultiPoint - Italy");
        var multiPointGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "MultiPointTest.geojson");
        multiPointGeoJSON.load(null, shapeConfigurationCallback, multiPointLayer);
        wwd.addLayer(multiPointLayer);

        //LineString test
        var lineStringLayer = new WorldWind.RenderableLayer("LineString - Cluj - Bologna");
        var lineStringDataSource = '{ "type": "LineString", "coordinates": [[23.62364, 46.77121] , [ 11.34262, 44.49489]] }';
        var lineStringGeoJSON = new WorldWind.GeoJSONParser(lineStringDataSource);
        lineStringGeoJSON.load(null, shapeConfigurationCallback, lineStringLayer);
        wwd.addLayer(lineStringLayer);

        //MultiLineString test
        var multiLineStringLayer = new WorldWind.RenderableLayer("MultiLineString - Danube");
        var multiLineStringGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "MultiLineStringTest.geojson");
        multiLineStringGeoJSON.load(null, shapeConfigurationCallback, multiLineStringLayer);
        wwd.addLayer(multiLineStringLayer);

        // GeometryCollection test with a callback function
        var geometryCollectionLayer = new WorldWind.RenderableLayer("GeometryCollection - Greece");
        var geometryCollectionGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "GeometryCollectionFeatureTest.geojson");
        geometryCollectionGeoJSON.load(parserCompletionCallback, shapeConfigurationCallback, geometryCollectionLayer);

        // Feature test
        var featureLayer = new WorldWind.RenderableLayer("Feature - Germany");
        var featureGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "FeatureTest.geojson");
        featureGeoJSON.load(null, shapeConfigurationCallback, featureLayer);
        wwd.addLayer(featureLayer);

        // Feature collection test

        // Feature collection - Spain and Portugal
        var spainLayer = new WorldWind.RenderableLayer("Feature Collection - Spain & Portugal");
        var spainGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "FeatureCollectionTest_Spain_Portugal.geojson");
        spainGeoJSON.load(null, shapeConfigurationCallback, spainLayer);
        wwd.addLayer(spainLayer);

        //CRS Reprojection test

        //USA EPSG:3857 named
        var ch3857Layer = new WorldWind.RenderableLayer("Switzerland 3857");
        var ch3857GeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "FeatureCollectionTest_EPSG3857_Switzerland.geojson");
        ch3857GeoJSON.load(null, shapeConfigurationCallback, ch3857Layer);
        wwd.addLayer(ch3857Layer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
        layerManager.synchronizeLayerList();
        layerManager.goToAnimator.goTo(new WorldWind.Location(38.72, 14.91))
    });