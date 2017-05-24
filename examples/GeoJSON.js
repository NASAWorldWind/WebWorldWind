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

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
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
            else if (geometry.isLineStringType() || geometry.isMultiLineStringType()){
                configuration.attributes =  new WorldWind.ShapeAttributes(null);
            configuration.attributes.drawOutline = true;
            configuration.attributes.outlineColor = new WorldWind.Color(
                0.1 * configuration.attributes.interiorColor.red,
                0.3 * configuration.attributes.interiorColor.green,
                0.7 * configuration.attributes.interiorColor.blue,
                1.0);
            configuration.attributes.outlineWidth = 1.0;
            }
            else if(geometry.isPolygonType() || geometry.isMultiPolygonType())
            {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.
                    configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.1);
                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            return configuration;
        };

        var extrudedConfigurationCallback = function (geometry, properties) {
            var configuration = {};

            configuration.attributes = new WorldWind.ShapeAttributes(null);

            // Fill the polygon with a random pastel color.
            configuration.attributes.interiorColor = new WorldWind.Color(
                0.375 + 0.5 * Math.random(),
                0.375 + 0.5 * Math.random(),
                0.375 + 0.5 * Math.random(),
                1.0);

            configuration.attributes.outlineColor = new WorldWind.Color(
                0.5 * configuration.attributes.interiorColor.red,
                0.5 * configuration.attributes.interiorColor.green,
                0.5 * configuration.attributes.interiorColor.blue,
                1.0);

            //Extrude the polygon
            configuration.extrude = true;

            //Set the altitude for the extrusion
            configuration.altitude=properties.height || 1e5;

            //Set altitude mode to relative
            configuration.altitudeMode = WorldWind.RELATIVE_TO_GROUND;


            return configuration;
        };

        var parserCompletionCallback = function(layer) {
            wwd.addLayer(layer);
        };

        var resourcesUrl = "http://worldwindserver.net/webworldwind/data/geojson-data/";

        // Polygon test
        var polygonLayer = new WorldWind.RenderableLayer("Polygon");
        var polygonGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "PolygonTest.geojson");
        polygonGeoJSON.load(null, shapeConfigurationCallback, polygonLayer);
        wwd.addLayer(polygonLayer);

        // MultiPolygon test
        var multiPolygonLayer = new WorldWind.RenderableLayer("MultiPolygon");
        var multiPolygonGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "MultiPolygonTest.geojson");
        multiPolygonGeoJSON.load(null, shapeConfigurationCallback, multiPolygonLayer);
        wwd.addLayer(multiPolygonLayer);

        //Point test
        var pointLayer = new WorldWind.RenderableLayer("Point");
        var pointGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "PointTest.geojson");
        pointGeoJSON.load(null, shapeConfigurationCallback, pointLayer);
        wwd.addLayer(pointLayer);

        //MultiPoint test
        var multiPointLayer = new WorldWind.RenderableLayer("MultiPoint");
        var multiPointGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "MultiPointTest.geojson");
        multiPointGeoJSON.load(null, shapeConfigurationCallback, multiPointLayer);
        wwd.addLayer(multiPointLayer);

        //LineString test
        var lineStringLayer = new WorldWind.RenderableLayer("LineString");
        var lineStringDataSource = '{ "type": "LineString", "coordinates": [[28.609974323244046, 44.202662372914631] , [ 26.098000795350401, 44.435317663494573]] }';
        var lineStringGeoJSON = new WorldWind.GeoJSONParser(lineStringDataSource);
        lineStringGeoJSON.load(null, shapeConfigurationCallback, lineStringLayer);
        wwd.addLayer(lineStringLayer);

        //MultiLineString test
        var multiLineStringLayer = new WorldWind.RenderableLayer("MultiLineString");
        var multiLineStringGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "MultiLineStringTest.geojson");
        multiLineStringGeoJSON.load(null, shapeConfigurationCallback, multiLineStringLayer);
        wwd.addLayer(multiLineStringLayer);

        // GeometryCollection test with a callback function
        var geometryCollectionLayer = new WorldWind.RenderableLayer("GeometryCollection");
        var geometryCollectionGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "GeometryCollectionFeatureTest.geojson");
        geometryCollectionGeoJSON.load(parserCompletionCallback, shapeConfigurationCallback, geometryCollectionLayer);

        // Feature test
        var featureLayer = new WorldWind.RenderableLayer("Feature - USA");
        var featureGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "FeatureTest.geojson");
        featureGeoJSON.load(null, shapeConfigurationCallback, featureLayer);
        wwd.addLayer(featureLayer);

        // Feature collection tests

        //World Borders
        var worldBordersLayer = new WorldWind.RenderableLayer("World Borders");
        var worldBordersGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "world_borders.geojson");
        worldBordersGeoJSON.load(null, shapeConfigurationCallback, worldBordersLayer);
        wwd.addLayer(worldBordersLayer);

        //World Main Cities
        var worldMainCitiesLayer = new WorldWind.RenderableLayer("World Main Cities");
        var worldMainCitiesGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "world_main_cities.geojson");
        worldMainCitiesGeoJSON.load(null, shapeConfigurationCallback, worldMainCitiesLayer);
        wwd.addLayer(worldMainCitiesLayer);

        //World Rivers
        var worldRiversLayer = new WorldWind.RenderableLayer("World Rivers");
        var worldRiversGeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "world_rivers.geojson");
        worldRiversGeoJSON.load(null, shapeConfigurationCallback, worldRiversLayer);
        wwd.addLayer(worldRiversLayer);

        //CRS Reprojection test

        //USA EPSG:3857 named
        var usa3857Layer = new WorldWind.RenderableLayer("USA 3857-named");
        var usa3857GeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "usa_epsg3857_named.geojson");
        usa3857GeoJSON.load(null, shapeConfigurationCallback, usa3857Layer);
        wwd.addLayer(usa3857Layer);

        //USA EPSG:3857 linked
        var usa3857Layer = new WorldWind.RenderableLayer("USA 3857-linked");
        var usa3857GeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "usa_epsg3857_linked.geojson");
        usa3857GeoJSON.load(null, shapeConfigurationCallback, usa3857Layer);
        wwd.addLayer(usa3857Layer);

        //USA EPSG:4326
        var usa4326Layer = new WorldWind.RenderableLayer("USA-4326");
        var usa4326GeoJSON = new WorldWind.GeoJSONParser(resourcesUrl + "usa_epsg4326.geojson");
        usa4326GeoJSON.load(null, shapeConfigurationCallback, usa4326Layer);
        wwd.addLayer(usa4326Layer);

        //Parsing GeoJSON directly

         //Italy Bounding Box
         var italyBoundingsLayer = new WorldWind.RenderableLayer("Italy Boundings");
         var italyBoundingsGeoJSON = new WorldWind.GeoJSONParser('{"type":"FeatureCollection","features":[{"type":"Feature",' +
         '"properties":{},"geometry":{"type":"Polygon","coordinates":[[[6.30615,36.50963],[18.63281,36.50963],' +
         '[18.63281,46.81509],[6.30615,46.81509],[6.30615,36.50963]]]}}]}');
         italyBoundingsGeoJSON.load(null, shapeConfigurationCallback, italyBoundingsLayer);
         italyBoundingsLayer.enabled = false;
         wwd.addLayer(italyBoundingsLayer);

        //Sicily Bounding Box Extruded
        var sicilyBoundingsLayer = new WorldWind.RenderableLayer("Sicily Boundings");
        var sicilyBoundingsGeoJSON = new WorldWind.GeoJSONParser('{"type":"FeatureCollection","features":[{"type":"' +
            'Feature","properties":{"height":"1e5"},"geometry":{"type":"Polygon","coordinates":[[[12.07397,36.55377],' +
            '[15.72143,36.55377],[15.72143,38.48799],[12.07397,38.48799],[12.07397,36.55377]]]}}]}');
        sicilyBoundingsGeoJSON.load(null, extrudedConfigurationCallback, sicilyBoundingsLayer);
        sicilyBoundingsLayer.enabled = false;
        wwd.addLayer(sicilyBoundingsLayer);


        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });