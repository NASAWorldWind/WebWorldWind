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
 * Illustrates how to display and pick Paths.
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
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
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

        // Create the path's positions.
        var pathPositions = [];
        pathPositions.push(new WorldWind.Position(40, -100, 1e4));
        pathPositions.push(new WorldWind.Position(45, -110, 1e4));
        pathPositions.push(new WorldWind.Position(46, -122, 1e4));

        // Create the path.
        var path = new WorldWind.Path(pathPositions, null);
        path.altitudeMode = WorldWind.RELATIVE_TO_GROUND; // The path's altitude stays relative to the terrain's altitude.
        path.followTerrain = true;
        path.extrude = true; // Make it a curtain.
        path.useSurfaceShapeFor2D = true; // Use a surface shape in 2D mode.

        // Create and assign the path's attributes.
        var pathAttributes = new WorldWind.ShapeAttributes(null);
        pathAttributes.outlineColor = WorldWind.Color.BLUE;
        pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);
        pathAttributes.drawVerticals = path.extrude; //Draw verticals only when extruding.
        path.attributes = pathAttributes;

        // Create and assign the path's highlight attributes.
        var highlightAttributes = new WorldWind.ShapeAttributes(pathAttributes);
        highlightAttributes.outlineColor = WorldWind.Color.RED;
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0.5);
        path.highlightAttributes = highlightAttributes;

        // Add the path to a layer and the layer to the WorldWindow's layer list.
        var pathsLayer = new WorldWind.RenderableLayer();
        pathsLayer.displayName = "Paths";
        pathsLayer.addRenderable(path);
        wwd.addLayer(pathsLayer);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });