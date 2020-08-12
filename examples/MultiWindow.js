/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * Illustrates the use of multiple WorldWindows on the same page.
 */
requirejs(['./WorldWindShim'], function () {
    "use strict";

    // Tell WorldWind to log only warnings and errors.
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    // Make a layer that shows a Path and is shared among the WorldWindows.
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
        imageryLayer = new WorldWind.BingAerialWithLabelsLayer(null),
        atmosphereLayer = new WorldWind.AtmosphereLayer();

    var wwd1 = new WorldWind.WorldWindow("canvasOne");
    wwd1.addLayer(imageryLayer);
    wwd1.addLayer(atmosphereLayer);
    wwd1.addLayer(pathLayer);
    // Add a compass layer, view controls layer, and coordinates display layer. Each WorldWindow must have its own.
    wwd1.addLayer(new WorldWind.CompassLayer());
    wwd1.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd1));
    wwd1.addLayer(new WorldWind.ViewControlsLayer(wwd1));

    var wwd2 = new WorldWind.WorldWindow("canvasTwo");
    wwd2.addLayer(imageryLayer);
    wwd2.addLayer(atmosphereLayer);
    wwd2.addLayer(pathLayer);
    wwd2.addLayer(new WorldWind.CompassLayer());
    wwd2.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd2));
    wwd2.addLayer(new WorldWind.ViewControlsLayer(wwd2));

    var wwd3 = new WorldWind.WorldWindow("canvasThree");
    wwd3.addLayer(imageryLayer);
    wwd3.addLayer(atmosphereLayer);
    wwd3.addLayer(pathLayer);
    wwd3.addLayer(new WorldWind.CompassLayer());
    wwd3.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd3));
    wwd3.addLayer(new WorldWind.ViewControlsLayer(wwd3));
});