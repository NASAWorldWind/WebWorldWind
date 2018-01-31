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
        var camera = wwd.camera;
        var lookAt = new WorldWind.LookAt();
        camera.getAsLookAt(lookAt);
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var thisFunction = this;

        // var lookAt = new WorldWind.LookAt(wwd);
        // var tiltDir = -1;
        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
        var selectedViewType = "Camera";
        $("#select-view").change(function () {
            selectedViewType = "";
            $("select option:selected").each(function () {
                selectedViewType += $(this).text();
            });
            updateView();
        });

        var updateView;

        var addSlider = function (valueControl, sliderControl, min, max, step, defaultValue) {
            sliderControl.slider({
                value: min, min: min, max: max, step: step, animate: true,
                slide: function (event, ui) {
                    valueControl.html(ui.value);
                    updateView();
                }
            });
            sliderControl.slider('value', defaultValue);
            valueControl.html(defaultValue);
        };

        var latitudeSlider = $("#latitudeSlider");
        addSlider($("#latitude"), latitudeSlider, -90, 90, 1, camera.position.latitude);

        var longitudeSlider = $("#longitudeSlider");
        addSlider($("#longitude"), longitudeSlider, -180, 180, 1, camera.position.longitude);

        var altitudeSlider = $("#altitudeSlider");
        addSlider($("#altitude"), altitudeSlider, 0, 10e7, 100, camera.position.altitude);

        var rangeSlider = $("#rangeSlider");
        addSlider($("#range"), rangeSlider, 0, 10e7, 100, lookAt.range);
        rangeSlider.slider("disable");

        var headingSlider = $("#headingSlider");
        addSlider($("#heading"), headingSlider, 0, 360, 1, camera.heading);

        var tiltSlider = $("#tiltSlider");
        addSlider($("#tilt"), tiltSlider, -90, 90, 1, camera.tilt);

        var rollSlider = $("#rollSlider");
        addSlider($("#roll"), rollSlider, -90, 90, 1, camera.roll);

        var currentViewType = selectedViewType;
        updateView = function () {
            var pos,view;
            if (selectedViewType !== currentViewType) {
                currentViewType = selectedViewType;
                if (currentViewType === "Camera") {
                    pos=camera.position;
                    view=camera;
                    rangeSlider.slider("disable");
                } else {
                    pos=lookAt.lookAtPosition;
                    view=lookAt;
                    rangeSlider.slider("enable");
                    camera.getAsLookAt(lookAt);
                    rangeSlider.slider('value', lookAt.range);
                }
                latitudeSlider.slider('value', pos.latitude);
                longitudeSlider.slider('value', pos.longitude);
                altitudeSlider.slider('value', pos.altitude);
                headingSlider.slider('value', view.heading);
                tiltSlider.slider('value', view.tilt);
                rollSlider.slider('value', view.roll);
            } else {
                if (currentViewType === "Camera") {
                    pos=camera.position;
                    view=camera;
                } else {
                    pos=lookAt.lookAtPosition;
                    view=lookAt;
                }
                pos.latitude = latitudeSlider.slider("value");
                pos.longitude = longitudeSlider.slider("value");
                pos.altitude = altitudeSlider.slider("value");
                view.heading = headingSlider.slider("value");
                view.tilt = tiltSlider.slider("value");
                view.roll = rollSlider.slider("value");
                if (selectedViewType === "LookAt") {
                    lookAt.range = rangeSlider.slider("value");
                    camera.setFromLookAt(lookAt);
                }
            }
        };
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