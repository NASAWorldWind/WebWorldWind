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
 * Illustrates how to load and display a Collada 3D model onto the globe.
 */

requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind, LayerManager) {
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
        {layer: new WorldWind.BingAerialLayer(null), enabled: false},
        {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
        {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
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

        // Create renderable layer to hold the Collada model.
    var modelLayer = new WorldWind.RenderableLayer("Duck");
    wwd.addLayer(modelLayer);

        // Define a position for locating the model.
    var position = new WorldWind.Position(45, -100, 1000e3);
        // Create a Collada loader and direct it to the desired directory and .dae file.
    var colladaLoader = new WorldWind.ColladaLoader(position);
    colladaLoader.init({dirPath: './collada_models/duck/'});
    colladaLoader.load('duck.dae', function (scene) {
        scene.scale = 5000;
        modelLayer.addRenderable(scene); // Add the Collada model to the renderable layer within a callback.
    });

    // Create a layer manager for controlling layer visibility.
    var layerManager = new LayerManager(wwd);
});
