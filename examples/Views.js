/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");
        var camera = new WorldWind.Camera(wwd);
        wwd.setView(camera);

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true}
            // {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // var lookAt = new WorldWind.LookAt(wwd);
        // var tiltDir = -1;
        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
        // window.setInterval(function () {
        //     wwd.getView().asCamera(camera);
        //     // var newLon = camera.cameraPosition.longitude + 1;
        //     // if (newLon > 180) {
        //     //     newLon = -180;
        //     // }
        //     // else if (newLon < -180) {
        //     //     newLon = 180;
        //     // }
        //     // camera.cameraPosition.longitude = newLon;
        //     var newTilt = camera.tilt + tiltDir*0.5;
        //     if (newTilt > 20) {
        //         newTilt = 20;
        //         tiltDir = -1;
        //     }
        //     else if (newTilt < -20) {
        //         newTilt = -20;
        //         tiltDir = 1;
        //     }
        //     camera.tilt=newTilt;
        //     wwd.setView(camera);
        //
        //     // wwd.getView().asLookAt(lookAt);
        //     // // var newLon = lookAt.lookAtPosition.longitude + 1;
        //     // // if (newLon > 180) {
        //     // //     newLon = -180;
        //     // // }
        //     // // else if (newLon < -180) {
        //     // //     newLon = 180;
        //     // // }
        //     // var newTilt = lookAt.tilt + tiltDir*0.5;
        //     // if (newTilt > 20) {
        //     //     newTilt = 20;
        //     //     tiltDir = -1;
        //     // }
        //     // else if (newTilt < -20) {
        //     //     newTilt = -20;
        //     //     tiltDir = 1;
        //     // }
        //     // lookAt.tilt=newTilt;
        //     // //lookAt.lookAtPosition.longitude = newLon;
        //     // wwd.setView(lookAt);
        // }, 100);
    });