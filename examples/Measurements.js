/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs([
        './LayerManager',
        '../src/WorldWind'
    ],
    function (LayerManager,
              WorldWind) {
        'use strict';

        var calcBtn = document.getElementById('calc');
        calcBtn.addEventListener('click', doCalc, false);

        var geoDistSpan = document.getElementById('geo-dist');
        var distSpan = document.getElementById('dist');
        var terrainDistSpan = document.getElementById('terrain-dist');
        var projectedAreaSpan = document.getElementById('projected-area');
        var terrainAreaSpan = document.getElementById('terrain-area');

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow('canvasOne');

        var BNMGLayer = new WorldWind.BMNGLayer();
        var CoordinatesDisplayLayer = new WorldWind.CoordinatesDisplayLayer(wwd);
        var pathLayer = new WorldWind.RenderableLayer('Path');
        wwd.addLayer(BNMGLayer);
        wwd.addLayer(CoordinatesDisplayLayer);
        wwd.addLayer(pathLayer);

        var pathPositions = [
            new WorldWind.Position(41.8267, -98.7686, 0),
            new WorldWind.Position(32.6658, -99.6049, 0),
            new WorldWind.Position(34.1708, -111.0846, 0),
            new WorldWind.Position(42.7502, -111.0705, 0),
            new WorldWind.Position(41.8267, -98.7686, 0)
        ];

        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.BLUE;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        var path = new WorldWind.Path(pathPositions, pathAttributes);
        path.altitudeMode = WorldWind.CLAMP_TO_GROUND;
        path.followTerrain = true;

        pathLayer.addRenderable(path);

        wwd.redraw();

        var lengthMeasurer = new WorldWind.LengthMeasurer(wwd);
        var areaMeasurer = new WorldWind.AreaMeasurer(wwd);

        function doCalc() {
            var distance = lengthMeasurer.getLength(pathPositions, false, WorldWind.GREAT_CIRCLE);
            var terrainDistance = lengthMeasurer.getLength(pathPositions, true, WorldWind.GREAT_CIRCLE);
            var geographicDistance = lengthMeasurer.getGeographicDistance(pathPositions, WorldWind.GREAT_CIRCLE);
            var area = areaMeasurer.getArea(pathPositions, false);
            var terrainArea = areaMeasurer.getArea(pathPositions, true);

            geoDistSpan.textContent = (geographicDistance / 1e3).toFixed(3);
            distSpan.textContent = (distance / 1e3).toFixed(3);
            terrainDistSpan.textContent = (terrainDistance / 1e3).toFixed(3);
            projectedAreaSpan.textContent = (area / 1e6).toFixed(3);
            terrainAreaSpan.textContent = (terrainArea / 1e6).toFixed(3);
        }

        var layerManger = new LayerManager(wwd);
    });