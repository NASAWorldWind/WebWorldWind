define([
        '../src/WorldWind'
    ],
    function (WorldWind) {
        "use strict";

    var Util = function (wwd) {
        this.wwd = wwd;
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

    Util.prototype.changeRange = function (goal, step, interval, complete) {

        var movement = function (worldwindow, stage) {
            if (stage === WorldWind.AFTER_REDRAW) {
                var range = worldwindow.navigator.range;
                var diff = range - goal;
                var self = this;
                if (Math.abs(diff) > 1) {
                    if (diff < 0) {
                        worldwindow.navigator.range = Math.abs(diff) > step ? range + step : goal;
                    } else {
                        worldwindow.navigator.range = Math.abs(diff) > step ? range - step : goal;
                    }
                    worldwindow.redraw();
                } else {
                    var idx = worldwindow.redrawCallbacks.indexOf(movement);
                    worldwindow.redrawCallbacks.splice(idx, 1);
                    complete();
                }
            }
        };

        this.wwd.redrawCallbacks.push(movement);
        this.wwd.redraw();

    };

    Util.prototype.changeTilt = function (goal, step, interval, complete) {

        var movement = function (worldwindow, stage) {
            var tilt = worldwindow.navigator.tilt;
            var diff = tilt - goal;
            var self = this;
            if (Math.abs(diff) > 1) {
                if (diff < 0) {
                    worldwindow.navigator.tilt = Math.abs(diff) > step ? tilt + step : goal;
                } else {
                    worldwindow.navigator.tilt = Math.abs(diff) > step ? tilt - step : goal;
                }
                worldwindow.redraw();
            } else {
                var idx = worldwindow.redrawCallbacks.indexOf(movement);
                worldwindow.redrawCallbacks.splice(idx, 1);
                complete();
            }
        };

        this.wwd.redrawCallbacks.push(movement);
        this.wwd.redraw();
    };

    Util.prototype.changeHeading = function (goal, step, interval, complete) {

        var movement = function (worldwindow, stage) {
            var heading = worldwindow.navigator.heading;
            var diff = heading - goal;
            var self = this;
            if (Math.abs(diff) > 1) {
                if (diff < 0) {
                    worldwindow.navigator.heading = Math.abs(diff) > step ? heading + step : goal;
                } else {
                    worldwindow.navigator.heading = Math.abs(diff) > step ? heading - step : goal;
                }
                worldwindow.redraw();
            } else {
                var idx = worldwindow.redrawCallbacks.indexOf(movement);
                worldwindow.redrawCallbacks.splice(idx, 1);
                complete();
            }
        };

        this.wwd.redrawCallbacks.push(movement);
        this.wwd.redraw();
    };
    
    return Util;
});
