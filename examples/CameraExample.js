/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: BasicExample.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/navigate/CameraController',
        '../src/geom/Position',
        '../src/WorldWind',
        './LayerManager'],
    function (CameraController,
              Position,
              ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne", null, CameraController);

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var modelLayer = new WorldWind.RenderableLayer("model");
        wwd.addLayer(modelLayer);
        var position = new WorldWind.Position(45, -100, 1000e3);
        var colladaLoader = new WorldWind.ColladaLoader(position);
        colladaLoader.init({dirPath: './collada_models/sentinel1Reduced/'});
        colladaLoader.load('Sentinel_1_07.01.2016.dae', function (scene) {
            scene.scale = 500000;
            modelLayer.addRenderable(scene);
        });

        var polygonsLayer = new WorldWind.RenderableLayer();
        polygonsLayer.displayName = "Polygons";
        wwd.addLayer(polygonsLayer);

        var boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Position(30, -100, 1e5));
        boundaries[0].push(new WorldWind.Position(30, -90, 1e5));
        boundaries[0].push(new WorldWind.Position(35, -90, 1e5));
        boundaries[0].push(new WorldWind.Position(35, -100, 1e5));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Position(32, -96, 1e5));
        boundaries[1].push(new WorldWind.Position(32, -94, 1e5));
        boundaries[1].push(new WorldWind.Position(33, -94, 1e5));
        boundaries[1].push(new WorldWind.Position(33, -96, 1e5));

        var polygon = new WorldWind.Polygon(boundaries, null);
        polygon.altitudeMode = WorldWind.ABSOLUTE;
        polygon.extrude = false;
        polygon.textureCoordinates = [
            [new WorldWind.Vec2(0, 0), new WorldWind.Vec2(1, 0), new WorldWind.Vec2(1, 1), new WorldWind.Vec2(0, 1)],
            [new WorldWind.Vec2(0.4, 0.4), new WorldWind.Vec2(0.6, 0.4), new WorldWind.Vec2(0.6, 0.6),
                new WorldWind.Vec2(0.4, 0.6)]
        ];

        var polygonAttributes = new WorldWind.ShapeAttributes(null);
        polygonAttributes.imageSource = "../images/400x230-splash-nww.png";
        polygonAttributes.drawInterior = true;
        polygonAttributes.drawOutline = true;
        polygonAttributes.outlineColor = WorldWind.Color.BLUE;
        polygonAttributes.interiorColor = WorldWind.Color.WHITE;
        polygonAttributes.drawVerticals = polygon.extrude;
        polygonAttributes.applyLighting = true;
        polygon.attributes = polygonAttributes;
        var highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        polygon.highlightAttributes = highlightAttributes;

        polygonsLayer.addRenderable(polygon);

        var boundaries = [];
        boundaries[0] = []; // outer boundary
        boundaries[0].push(new WorldWind.Position(30, -100, 1e6));
        boundaries[0].push(new WorldWind.Position(30, -90, 1e6));
        boundaries[0].push(new WorldWind.Position(35, -90, 1e6));
        boundaries[0].push(new WorldWind.Position(35, -100, 1e6));
        boundaries[1] = []; // inner boundary
        boundaries[1].push(new WorldWind.Position(32, -96, 1e6));
        boundaries[1].push(new WorldWind.Position(32, -94, 1e6));
        boundaries[1].push(new WorldWind.Position(33, -94, 1e6));
        boundaries[1].push(new WorldWind.Position(33, -96, 1e6));

        var polygon = new WorldWind.Polygon(boundaries, null);
        polygon.altitudeMode = WorldWind.ABSOLUTE;
        polygon.extrude = false;
        polygon.textureCoordinates = [
            [new WorldWind.Vec2(0, 0), new WorldWind.Vec2(1, 0), new WorldWind.Vec2(1, 1), new WorldWind.Vec2(0, 1)],
            [new WorldWind.Vec2(0.4, 0.4), new WorldWind.Vec2(0.6, 0.4), new WorldWind.Vec2(0.6, 0.6),
                new WorldWind.Vec2(0.4, 0.6)]
        ];

        var polygonAttributes = new WorldWind.ShapeAttributes(null);
        polygonAttributes.imageSource = "../images/400x230-splash-nww.png";
        polygonAttributes.drawInterior = true;
        polygonAttributes.drawOutline = true;
        polygonAttributes.outlineColor = WorldWind.Color.BLUE;
        polygonAttributes.interiorColor = WorldWind.Color.WHITE;
        polygonAttributes.drawVerticals = polygon.extrude;
        polygonAttributes.applyLighting = true;
        polygon.attributes = polygonAttributes;
        var highlightAttributes = new WorldWind.ShapeAttributes(polygonAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        polygon.highlightAttributes = highlightAttributes;

        polygonsLayer.addRenderable(polygon);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });