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
        wwd.cameraAsLookAt(lookAt);
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

        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(atmosphereLayer);

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
            var precision = 10000.0;
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
                    wwd.cameraAsLookAt(lookAt);
                    pos = lookAt.position;
                    view = lookAt;
                    rangeSlider.slider("enable");
                    altitudeSlider.slider("disable");
                }
            } else {
                if (currentViewType === "Camera") {
                    pos = camera.position;
                    view = camera;
                } else {
                    wwd.cameraAsLookAt(lookAt);
                    pos = lookAt.position;
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
                    wwd.cameraFromLookAt(lookAt);
                }
            }
            updateControls(pos, view);
            wwd.redraw();
        };

        window.setInterval(function () {
            var pos, view;
            wwd.cameraAsLookAt(lookAt);
            if (currentViewType === "Camera") {
                pos = camera.position;
                view = camera;
            } else {
                pos = lookAt.position;
                view = lookAt;
            }
            updateControls(pos, view);
        }, 100);

        var canyonCheckBox = document.getElementById('canyon');
        var canyonInterval = 0;
        canyonCheckBox.addEventListener('change', onCanyonCheckBoxClick, false);

        var canyonTour = [];
        canyonTour.push({
            position: new WorldWind.Position(36.17, -112.04, 2000),
            heading: -150,
            tilt: 70,
            finished: false
        });
        canyonTour.push({
            position: new WorldWind.Position(36.10, -112.10, 2000),
            heading: 90,
            tilt: 70,
            finished: false
        });
        canyonTour.push({
            position: new WorldWind.Position(36.10, -112.08, 2000),
            heading: 120,
            tilt: 70,
            finished: false
        });
        canyonTour.push({
            position: new WorldWind.Position(36.05, -111.98, 2000),
            heading: 120,
            tilt: 70,
            finished: false
        });

        var canyonLatInc;
        var canyonLonInc;
        var headingInc;
        var tiltInc;
        var segmentStart = true;
        var fromIndex = 0;
        var toIndex = 1;
        var fromNode = canyonTour[fromIndex];
        var toNode = canyonTour[toIndex];
        var traversalDir = 1, segHeading, segCompassHeading, headingSteps;

        function goToCanyonStartComplete() {
            runCanyonSimulation();
        }

        function onCanyonCheckBoxClick() {
            if (this.checked) {
                wwd.goTo(fromNode.position, goToCanyonStartComplete);
                // camera.position.copy(fromNode.position);
                // goToCanyonStartComplete();
            }
            else {
                clearInterval(canyonInterval);
                wwd.redraw();
            }
        }

        function runCanyonSimulation() {
            canyonInterval = setInterval(function () {
                if (toNode.finished) {
                    fromIndex = toIndex;
                    toIndex += traversalDir;
                    var reset = false;
                    if (toIndex === canyonTour.length) {
                        traversalDir = -1;
                        reset = true;
                    }
                    else if (toIndex < 0) {
                        traversalDir = 1;
                        reset = true;
                    }
                    if (reset) {
                        toIndex = fromIndex + traversalDir;
                        for (var i = 0; i < canyonTour.length; i++) {
                            canyonTour[i].finished = false;
                        }
                    }
                    fromNode = canyonTour[fromIndex];
                    toNode = canyonTour[toIndex];
                    segmentStart = true;
                }

                var camCompassHeading;
                if (segmentStart) {
                    segmentStart = false;
                    var radiansPerFrame = 0.001 / 480
                    var numFrames = Math.ceil(WorldWind.Location.greatCircleDistance(fromNode.position, toNode.position) / radiansPerFrame);
                    canyonLatInc = (toNode.position.latitude - fromNode.position.latitude) / numFrames;
                    canyonLonInc = (toNode.position.longitude - fromNode.position.longitude) / numFrames;
                    segHeading = traversalDir < 0 ? WorldWind.Angle.normalizedDegrees(toNode.heading + 180) : fromNode.heading;
                    segCompassHeading = segHeading < 0 ? segHeading + 360 : segHeading;
                    camCompassHeading = camera.heading < 0 ? camera.heading + 360 : camera.heading;
                    var headingDiff = segCompassHeading - camCompassHeading;
                    if (Math.abs(headingDiff) >= 180) {
                        headingDiff = headingDiff < 0 ? headingDiff + 360 : headingDiff - 360;
                    }
                    var angleInc = 0.25;
                    headingSteps = Math.floor(Math.abs(headingDiff) / angleInc);
                    headingInc = Math.sign(headingDiff) * angleInc;
                    tiltInc = Math.sign(fromNode.tilt - camera.tilt) * angleInc;
                    camera.position.altitude = fromNode.position.altitude;
                }
                if (headingSteps > 0 || tiltInc !== 0) {
                    camCompassHeading = camera.heading < 0 ? camera.heading + 360 : camera.heading;
                    camera.heading = WorldWind.Angle.normalizedDegrees(camCompassHeading + headingInc);
                    camera.tilt += tiltInc;
                    headingSteps--;
                    if (headingSteps <= 0) {
                        headingInc = 0;
                        camera.heading = segHeading;
                    }
                    if ((tiltInc > 0 && camera.tilt >= fromNode.tilt) ||
                        (tiltInc < 0 && camera.tilt <= fromNode.tilt)) {
                        tiltInc = 0;
                        camera.tilt = fromNode.tilt;
                    }
                } else {
                    camera.position.latitude += canyonLatInc;
                    camera.position.longitude += canyonLonInc;
                    if ((canyonLatInc > 0 && camera.position.latitude > toNode.position.latitude) ||
                        (canyonLatInc < 0 && camera.position.latitude < toNode.position.latitude) ||
                        (canyonLonInc > 0 && camera.position.longitude > toNode.position.longitude) ||
                        (canyonLonInc < 0 && camera.position.longitude < toNode.position.longitude)) {
                        toNode.finished = true;
                    }
                }
                wwd.redraw();
            }, 25);
        }

        var orbitCheckBox = document.getElementById('orbit');
        var orbitInterval = 0;
        orbitCheckBox.addEventListener('change', onOrbitCheckBoxClick, false);

        function goToOrbitStartComplete() {
            runOrbitSimulation();
        }

        var orbitStartPos = new WorldWind.Position(30, -70, 5e6);

        function onOrbitCheckBoxClick() {
            if (this.checked) {
                wwd.goTo(orbitStartPos, goToOrbitStartComplete);
            }
            else {
                clearInterval(orbitInterval);
                wwd.redraw();
            }
        }

        function runOrbitSimulation() {
            orbitInterval = setInterval(function () {
                camera.position.latitude = orbitStartPos.latitude;
                camera.position.longitude -= 0.1;
                camera.position.altitude = orbitStartPos.altitude;

                if (camera.position.longitude < -180) {
                    camera.position.longitude = 180;
                }

                wwd.redraw();
            }, 25);
        }
    });