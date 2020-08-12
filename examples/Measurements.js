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
 * Illustrates how to measure distances and areas.
 */

requirejs([
        './LayerManager',
        './WorldWindShim'
    ],
    function (LayerManager,
              WorldWind) {
        'use strict';

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWinow.
        var wwd = new WorldWind.WorldWindow('canvasOne');

        // Create and add layers to the WorldWindow.
        // Imagery layers.
        var BNMGLayer = new WorldWind.BMNGLayer();
        var AtmosphereLayer = new WorldWind.AtmosphereLayer();
        var pathLayer = new WorldWind.RenderableLayer('Path');
        // WorldWindow UI layer.
        var CoordinatesDisplayLayer = new WorldWind.CoordinatesDisplayLayer(wwd);
        wwd.addLayer(BNMGLayer);
        // Add atmosphere layer on top of base imagery layer.
        wwd.addLayer(AtmosphereLayer);
        wwd.addLayer(pathLayer);
        wwd.addLayer(CoordinatesDisplayLayer);

        // Bind our DOM elements where we will display the results.
        var geoDistSpan = document.getElementById('geo-dist');
        var distSpan = document.getElementById('dist');
        var terrainDistSpan = document.getElementById('terrain-dist');
        var projectedAreaSpan = document.getElementById('projected-area');
        var terrainAreaSpan = document.getElementById('terrain-area');

        // The measurements will be calculated when clicking on the 'Calc' button.
        var calcBtn = document.getElementById('calc');
        calcBtn.addEventListener('click', doCalc, false);

        // Define a closed path to circumscribe an area over the globe.
        // This area will be the one whose measures will be taken.
        // For more information about paths, see the Paths example.
        var pathPositions = [
            new WorldWind.Position(41.8267, -98.7686, 0),
            new WorldWind.Position(32.6658, -99.6049, 0),
            new WorldWind.Position(34.1708, -111.0846, 0),
            new WorldWind.Position(42.7502, -111.0705, 0),
            new WorldWind.Position(41.8267, -98.7686, 0)
        ];

        // Define the path attributes.
        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.BLUE;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        // Create the path that defines an enclosed area.
        var path = new WorldWind.Path(pathPositions, pathAttributes);
        path.altitudeMode = WorldWind.CLAMP_TO_GROUND;
        // When followTerrain is set to true, the computed length will account for terrain deformations.
        path.followTerrain = true;

        // Add the path to the layer.
        pathLayer.addRenderable(path);

        // Update the WorldWindow scene.
        wwd.redraw();

        // Create our measuring objects.
        var lengthMeasurer = new WorldWind.LengthMeasurer(wwd);
        var areaMeasurer = new WorldWind.AreaMeasurer(wwd);

        // Calculate the length and area measurements of the path defined before.
        function doCalc() {
            var distance = lengthMeasurer.getLength(pathPositions, false, WorldWind.GREAT_CIRCLE);
            var terrainDistance = lengthMeasurer.getLength(pathPositions, true, WorldWind.GREAT_CIRCLE);
            var geographicDistance = lengthMeasurer.getGeographicDistance(pathPositions, WorldWind.GREAT_CIRCLE);
            var area = areaMeasurer.getArea(pathPositions, false);
            var terrainArea = areaMeasurer.getArea(pathPositions, true);

            // Display the results.
            geoDistSpan.textContent = (geographicDistance / 1e3).toFixed(3);
            distSpan.textContent = (distance / 1e3).toFixed(3);
            terrainDistSpan.textContent = (terrainDistance / 1e3).toFixed(3);
            projectedAreaSpan.textContent = (area / 1e6).toFixed(3);
            terrainAreaSpan.textContent = (terrainArea / 1e6).toFixed(3);
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });