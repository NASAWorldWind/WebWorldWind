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
        window.wwd = wwd;

        var BNMGLayer = new WorldWind.BMNGLayer();
        var pathLayer = new WorldWind.RenderableLayer('pathLayer');
        wwd.addLayer(BNMGLayer);
        wwd.addLayer(pathLayer);

        var pathPositions = [
            new WorldWind.Position(40, -100, 1e4),
            new WorldWind.Position(45, -110, 1e4),
            new WorldWind.Position(46, -122, 1e4)
        ];

        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.BLUE;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        var path = new WorldWind.Path(pathPositions, pathAttributes);
        path.altitudeMode = WorldWind.CLAMP_TO_GROUND;
        //path.pathType = WorldWind.RHUMB_LINE;
        path.followTerrain = true;

        pathLayer.addRenderable(path);

        wwd.redraw();

        console.log('path', path);

        var lengthMeasurer = new WorldWind.LengthMeasurer(wwd);
        var pathDist = lengthMeasurer.getPathLength(path);
        console.log('pathDistance', pathDist);

        setTimeout(function () {
            var topoDistance = lengthMeasurer.getPathLength(path);
            console.log('topoDistance', topoDistance);
        }, 30000);

        var layerManger = new LayerManager(wwd);
    });