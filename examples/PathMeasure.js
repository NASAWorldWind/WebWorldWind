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
        "use strict";

        var calcBtn = document.getElementById('calc');
        calcBtn.addEventListener('click', doCalc, false);

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");
        window.wwd = wwd;

        var BNMGLayer = new WorldWind.BMNGLayer();
        var CoordinatesDisplayLayer = new WorldWind.CoordinatesDisplayLayer(wwd);
        var pathLayer = new WorldWind.RenderableLayer('Path');
        wwd.addLayer(BNMGLayer);
        wwd.addLayer(CoordinatesDisplayLayer);
        wwd.addLayer(pathLayer);

        var altitude = 0;
        var pathPositions = [
            new WorldWind.Position(40, -100, altitude),
            new WorldWind.Position(45, -110, altitude),
            new WorldWind.Position(46, -122, altitude)
        ];

        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.BLUE;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        var path = new WorldWind.Path(pathPositions, pathAttributes);
        path.altitudeMode = WorldWind.CLAMP_TO_GROUND;
        //path.pathType = WorldWind.RHUMB_LINE;
        path.followTerrain = false;

        pathLayer.addRenderable(path);

        wwd.redraw();

        console.log('path', path);

        var lengthMeasurer = new WorldWind.LengthMeasurer(wwd);
        var pathDist = lengthMeasurer.getPathLength(path);
        console.log('pathDistance', pathDist);

        var locationDistance = lengthMeasurer.getLocationDistance(path);
        console.log('locationDistance', locationDistance);

        function doCalc(){
            var distance = lengthMeasurer.getPathLength(path);
            console.log('distance', distance);
            console.log('delta', locationDistance - distance);
        }

        var layerManger = new LayerManager(wwd);
    });