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
 * Illustrates how to load and display a Collada 3D model onto the globe. Also shows how to calculate
 * intersection points when you click on the model.
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
        var placemarkLayer = new WorldWind.RenderableLayer("Placemarks")
        wwd.addLayer(placemarkLayer);

        // Define a position for locating the model.
        var position = new WorldWind.Position(45, -100, 1000e3);
        // Create a Collada loader and direct it to the desired directory and .dae file.
        var colladaLoader = new WorldWind.ColladaLoader(position);
        colladaLoader.init({dirPath: './collada_models/duck/'});
        var duckScene = null;
        colladaLoader.load('duck.dae', function (scene) {
            scene.scale = 5000;
            modelLayer.addRenderable(scene); // Add the Collada model to the renderable layer within a callback.
            duckScene = scene;
        });

        // The following is an example of 3D ray intersaction with a COLLADA model.
        // A ray will be generated extending from the camera "eye" point towards a point in the 
        // COLLADA model where the user has clicked, then the intersections between this ray and the model
        // will be computed and displayed.

        // Add placemarks to visualize intersection points.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageColor = WorldWind.Color.RED;
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/crosshair.png";

        // The next placemark will portray the closest intersection point to the camera, marked in a different color.
        var closestPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        closestPlacemarkAttributes.imageColor = WorldWind.Color.GREEN;
        closestPlacemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.GREEN;

        // Add click event to trigger the generation of the ray and the computation of its intersctions with the COLLADA model.
        var handleClick = function (o) {
            if (duckScene == null) {
                return;
            }
            placemarkLayer.removeAllRenderables();

            // Obtain 3D ray that extends from the camera "eye" point towards the point where the user clicked on the COLLADA model.
            var clickPoint = wwd.canvasCoordinates(o.clientX, o.clientY);
            var clickRay = wwd.rayThroughScreenPoint(clickPoint);

            // Compute intersection points between the model and the ray extending from the camera "eye" point.
            // Note that this takes into account possible concavities in the model.
            var intersections = [];
            if (duckScene.computePointIntersections(wwd.globe, clickRay, intersections)) {
                for (var i = 0, len = intersections.length; i < len; i++) {
                    var placemark = new WorldWind.Placemark(intersections[i], true, null);
                    placemark.altitudeMode = WorldWind.ABSOLUTE;
                    if (i == 0) {
                        placemark.attributes = closestPlacemarkAttributes;
                    } else {
                        placemark.attributes = placemarkAttributes;
                    }
                    placemarkLayer.addRenderable(placemark);
                }
            }

            // Redraw scene with the computed results.
            wwd.redraw();
        };

        // Listen for mouse clicks to trigger the related event.
        wwd.addEventListener("click", handleClick);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });
