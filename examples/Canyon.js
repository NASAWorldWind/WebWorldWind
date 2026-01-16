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
requirejs(['./WorldWindShim'],
    function (WorldWind) {
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
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(atmosphereLayer);

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

    });