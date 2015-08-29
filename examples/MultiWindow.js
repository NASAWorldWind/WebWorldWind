/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates the use of multiple World Windows on the same page.
 *
 * @version $Id: MultiWindow.js 3314 2015-07-10 18:28:45Z dcollins $
 */

requirejs(['../src/WorldWind'], function () {
    "use strict";

    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    // Make a layer that shows a Path and is shared among the World Windows.
    var makePathLayer = function () {
        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.interiorColor = WorldWind.Color.CYAN;
        pathAttributes.outlineColor= WorldWind.Color.BLUE;

        var pathPositions = [
            new WorldWind.Position(40, -100, 1e4),
            new WorldWind.Position(45, -110, 1e4),
            new WorldWind.Position(46, -122, 1e4)
        ];
        var path = new WorldWind.Path(pathPositions);
        path.attributes = pathAttributes;
        path.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        path.followTerrain = true;

        var pathLayer = new WorldWind.RenderableLayer("Path Layer");
        pathLayer.addRenderable(path);

        return pathLayer;
    };

    // Create the shared shape layer and imagery layer
    var pathLayer = makePathLayer(),
        imageryLayer = new WorldWind.BingAerialWithLabelsLayer(null);

    var wwd1 = new WorldWind.WorldWindow("canvasOne");
    wwd1.addLayer(imageryLayer);
    wwd1.addLayer(pathLayer);
    // Add a compass layer, view controls layer, and coordinates display layer. Each world window must have its own.
    wwd1.addLayer(new WorldWind.CompassLayer());
    wwd1.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd1));
    wwd1.addLayer(new WorldWind.ViewControlsLayer(wwd1));

    var wwd2 = new WorldWind.WorldWindow("canvasTwo");
    wwd2.addLayer(imageryLayer);
    wwd2.addLayer(pathLayer);
    wwd2.addLayer(new WorldWind.CompassLayer());
    wwd2.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd2));
    wwd2.addLayer(new WorldWind.ViewControlsLayer(wwd2));

    var wwd3 = new WorldWind.WorldWindow("canvasThree");
    wwd3.addLayer(imageryLayer);
    wwd3.addLayer(pathLayer);
    wwd3.addLayer(new WorldWind.CompassLayer());
    wwd3.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd3));
    wwd3.addLayer(new WorldWind.ViewControlsLayer(wwd3));
});