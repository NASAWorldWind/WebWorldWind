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
            // {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

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

        var latitudeValue = $("#latitude");
        var latitudeSlider = $("#latitudeSlider");
        addSlider(latitudeValue, latitudeSlider, -90, 90, 1, camera.position.latitude);

        var longitudeValue = $("#longitude");
        var longitudeSlider = $("#longitudeSlider");
        addSlider(longitudeValue, longitudeSlider, -180, 180, 1, camera.position.longitude);

        var altitudeValue = $("#altitude");
        var altitudeSlider = $("#altitudeSlider");
        addSlider(altitudeValue, altitudeSlider, 1, 10e6, 1, camera.position.altitude);

        var rangeValue = $("#range");
        var rangeSlider = $("#rangeSlider");
        addSlider(rangeValue, rangeSlider, 1, 10e6, 1, lookAt.range);
        rangeSlider.slider("disable");

        var headingValue = $("#heading");
        var headingSlider = $("#headingSlider");
        addSlider(headingValue, headingSlider, -180, 180, 1, camera.heading);

        var tiltValue = $("#tilt");
        var tiltSlider = $("#tiltSlider");
        addSlider(tiltValue, tiltSlider, -90, 90, 1, camera.tilt);

        var rollValue = $("#roll");
        var rollSlider = $("#rollSlider");
        addSlider(rollValue, rollSlider, -90, 90, 1, camera.roll);

        var updateControls = function (pos, selectedView) {
            var precision=10000.0;
            latitudeValue.html(Math.round(pos.latitude * precision) / precision);
            longitudeValue.html(Math.round(pos.longitude * precision) / precision);
            altitudeValue.html(Math.round(pos.altitude * precision) / precision);
            headingValue.html(Math.round(selectedView.heading * precision) / precision);
            tiltValue.html(Math.round(selectedView.tilt * precision) / precision);
            rollValue.html(Math.round(selectedView.roll * precision) / precision);

            latitudeSlider.slider('value', pos.latitude);
            longitudeSlider.slider('value', pos.longitude);
            altitudeSlider.slider('value', pos.altitude);
            headingSlider.slider('value', selectedView.heading);
            tiltSlider.slider('value', selectedView.tilt);
            rollSlider.slider('value', selectedView.roll);
            if (selectedView === lookAt) {
                rangeValue.html(Math.round(lookAt.range * 100.0) / 100.0);
                rangeSlider.slider('value', lookAt.range);
            }
        };

        var currentViewType = selectedViewType;
        updateView = function () {
            var pos, view;
            if (selectedViewType !== currentViewType) {
                currentViewType = selectedViewType;
                if (currentViewType === "Camera") {
                    pos = camera.position;
                    view = camera;
                    rangeSlider.slider("disable");
                    altitudeSlider.slider("enable");
                } else {
                    camera.getAsLookAt(lookAt);
                    pos = lookAt.lookAtPosition;
                    view = lookAt;
                    rangeSlider.slider("enable");
                    altitudeSlider.slider("disable");
                }
            } else {
                if (currentViewType === "Camera") {
                    pos = camera.position;
                    view = camera;
                } else {
                    camera.getAsLookAt(lookAt);
                    pos = lookAt.lookAtPosition;
                    view = lookAt;
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
            updateControls(pos, view);
            wwd.redraw();
        };

        window.setInterval(function () {
            var pos, view;
            camera.getAsLookAt(lookAt);
            if (currentViewType === "Camera") {
                pos = camera.position;
                view = camera;
            } else {
                pos = lookAt.lookAtPosition;
                view = lookAt;
            }
            updateControls(pos, view);
        }, 100);
    });