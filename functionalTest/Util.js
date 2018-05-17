define([

    ],
    function () {
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
        
        return wwd;
    };

    Util.prototype.changeRange = function (goal, step, interval, complete) {
        var range = this.wwd.navigator.range;
        var diff = range - goal;
        var self = this;
        if (Math.abs(diff) > 1) {
            if (diff < 0) {
                this.wwd.navigator.range = Math.abs(diff) > step ? range + step : goal;
            } else {
                this.wwd.navigator.range = Math.abs(diff) > step ? range - step : goal;
            }
            this.wwd.redraw();
            setTimeout(function () {
                self.changeRange(goal, step, interval, complete);
            }, interval);
        } else {
            complete();
        }
    };

    Util.prototype.changeTilt = function (goal, step, interval, complete) {
        var tilt = this.wwd.navigator.tilt;
        var diff = tilt - goal;
        var self = this;
        if (Math.abs(diff) > 1) {
            if (diff < 0) {
                this.wwd.navigator.tilt = Math.abs(diff) > step ? tilt + step : goal;
            } else {
                this.wwd.navigator.tilt = Math.abs(diff) > step ? tilt - step : goal;
            }
            this.wwd.redraw();
            setTimeout(function () {
                self.changeTilt(goal, step, interval, complete);
            }, interval);
        } else {
            complete();
        }
    };

    Util.prototype.changeHeading = function (goal, step, interval, complete) {
        var heading = this.wwd.navigator.heading;
        var diff = heading - goal;
        var self = this;
        if (Math.abs(diff) > 1) {
            if (diff < 0) {
                this.wwd.navigator.heading = Math.abs(diff) > step ? heading + step : goal;
            } else {
                this.wwd.navigator.heading = Math.abs(diff) > step ? heading - step : goal;
            }
            this.wwd.redraw();
            setTimeout(function () {
                self.changeHeading(goal, step, interval, complete);
            }, interval);
        } else {
            complete();
        }
    };
    
    return Util;
});
