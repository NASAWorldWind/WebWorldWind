define([
        '../src/WorldWind'
    ],
    function (WorldWind) {
        "use strict";

    var Util = function () {
    };

    Util.initializeLowResourceWorldWindow = function (canvasId) {
        var wwd = new WorldWind.WorldWindow(canvasId);
        wwd.globe.elevationModel.removeAllCoverages(); // Don't want delays associated with parsing and changing terrain
        var bmnglayer = new WorldWind.BMNGOneImageLayer();
        bmnglayer.minActiveAltitude = 0;
        wwd.addLayer(bmnglayer); // Don't want any imaging processing delays
        // wwd.addLayer(new WorldWind.FrameStatisticsLayer(wwd));
        // wwd.redrawCallbacks.push(function (worldwindow, stage) {
        //     if (stage === WorldWind.AFTER_REDRAW) {
        //         worldwindow.redraw();
        //     }
        // });
        
        return wwd;
    };

    Util.move = function (wwd, endStatesArray, complete) {
        var idx = 0;

        var nextPosition = function (worldwindow, stage) {
            if (stage !== WorldWind.AFTER_REDRAW) {
                return;
            }

            var range, tilt, heading, latitude, longitude, endStates = endStatesArray[idx];

            if (endStates.range && !endStates.range.complete) {
                range = Util.calculateNextValue(worldwindow.navigator.range, endStates.range.goal, endStates.range.step);
                if (typeof range === "number") {
                    worldwindow.navigator.range = range;
                } else {
                    endStates.range.complete = true;
                }
            }

            if (endStates.tilt && !endStates.tilt.complete) {
                tilt = Util.calculateNextValue(worldwindow.navigator.tilt, endStates.tilt.goal, endStates.tilt.step);
                if (typeof tilt === "number") {
                    worldwindow.navigator.tilt = tilt;
                } else {
                    endStates.tilt.complete = true;
                }
            }

            if (endStates.heading && !endStates.heading.complete) {
                heading = Util.calculateNextValue(worldwindow.navigator.heading, endStates.heading.goal, endStates.heading.step);
                if (typeof heading === "number") {
                    worldwindow.navigator.heading = heading;
                } else {
                    endStates.heading.complete = true;
                }
            }

            if (endStates.latitude && !endStates.latitude.complete) {
                latitude = Util.calculateNextValue(worldwindow.navigator.lookAtLocation.latitude,
                    endStates.latitude.goal, endStates.latitude.step);
                if (typeof latitude === "number") {
                    worldwindow.navigator.lookAtLocation.latitude = latitude;
                } else {
                    endStates.latitude.complete = true;
                }
            }

            if (endStates.longitude && !endStates.longitude.complete) {
                longitude = Util.calculateNextValue(worldwindow.navigator.lookAtLocation.longitude,
                    endStates.longitude.goal, endStates.longitude.step);
                if (typeof longitude === "number") {
                    worldwindow.navigator.lookAtLocation.longitude = longitude;
                } else {
                    endStates.longitude.complete = true;
                }
            }

            var keys = Object.getOwnPropertyNames(endStates);
            for (var i = 0; i < keys.length; i++) {
                if (!endStates[keys[i]].complete) {
                    worldwindow.redraw();
                    return;
                }
            }

            if (idx === endStatesArray.length - 1) {
                var callbackIdx = worldwindow.redrawCallbacks.indexOf(nextPosition);
                worldwindow.redrawCallbacks.splice(callbackIdx, 1);
                worldwindow.redraw();
                complete();
            } else {
                idx++;
                worldwindow.redraw();
            }
        };

        wwd.redrawCallbacks.push(nextPosition);
        wwd.redraw();
    };

    Util.calculateNextValue = function (currentValue, goal, step) {
        var diff = currentValue - goal;

        if (Math.abs(diff) > 0.1) {
            if (diff < 0) {
                return Math.abs(diff) > step ? currentValue + step : goal;
            } else {
                return Math.abs(diff) > step ? currentValue - step : goal;
            }
        } else {
            return null;
        }
    };
    
    return Util;
});
