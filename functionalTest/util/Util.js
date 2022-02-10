define([
        '../../src/WorldWind',
        '../../src/util/WWUtil'
    ],
    function (WorldWind, WWUtil) {
        "use strict";

    var Util = function (worldwindow) {

        this.wwd = worldwindow;

        this.moveQueue = [];

        this.frameStats = [];

        this.captureMetrics = false;

        this.wwd.redrawCallbacks.push(this.onRedrawMove());

        this.wwd.redrawCallbacks.push(this.onRedrawMetricCapture());

        this.statusOutput = document.getElementById("status-output");

        this.resultsOutput = document.getElementById("results-output");
    };

    Util.initializeLowResourceWorldWindow = function (canvasId) {
        var wwd = new WorldWind.WorldWindow(canvasId);
        wwd.globe.elevationModel.removeAllCoverages(); // Don't want delays associated with parsing and changing terrain
        var bmnglayer = new WorldWind.BMNGOneImageLayer();
        bmnglayer.minActiveAltitude = 0;
        wwd.addLayer(bmnglayer); // Don't want any imaging processing delays
        wwd.redraw();
        
        return wwd;
    };

    Util.prototype.isMoving = function () {
        return this.moveQueue.length > 0;
    };

    Util.prototype.setStatusMessage = function (value) {
        Util.setElementValue(this.statusOutput, value);
    };

    Util.prototype.setOutputMessage = function (value) {
        Util.setElementValue(this.resultsOutput, value);
    };

    Util.prototype.appendOutputMessage = function (value) {
        this.resultsOutput.appendChild(document.createElement("hr"));
        Util.appendElementValue(this.resultsOutput, value);
    };

    Util.setElementValue = function (element, value) {
        var children = element.childNodes;

        // remove existing nodes
        for (var c = 0; c < children.length; c++) {
            element.removeChild(children[c]);
        }

        Util.appendElementValue(element, value);
    };

    Util.appendElementValue = function (element, value) {
        if (typeof value === "string") {
            value = document.createElement("h3").appendChild(document.createTextNode(value));
        }

        element.appendChild(value);
    };

    Util.prototype.onRedrawMove = function () {

        var self = this;

        return function (worldwindow, stage) {

            if (self.moveQueue.length > 0 && stage === WorldWind.AFTER_REDRAW) {

                var range, tilt, heading, latitude, longitude, endStates = self.moveQueue[0];

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

                // Check to see if all the end states of this move have been completed
                var keys = Object.getOwnPropertyNames(endStates);
                for (var i = 0; i < keys.length; i++) {

                    // skip the callback property
                    if (keys[i] === "onComplete") {
                        continue;
                    }

                    if (!endStates[keys[i]].complete) {
                        // not done yet, don't complete the move yet
                        worldwindow.redraw();
                        return;
                    }
                }

                // Remove the move from the queue and invoke the completion listener if provided
                self.moveQueue.shift();
                if (endStates.onComplete) {
                    endStates.onComplete();
                }
                worldwindow.redraw();
            }
        };
    };

    Util.prototype.onRedrawMetricCapture = function () {

        var self = this;

        return function (worldwindow, stage) {

            if (self.captureMetrics && stage === WorldWind.AFTER_REDRAW) {

                // Copy all of the individual frame metrics
                var frameStatistics = {};

                frameStatistics.frameTime = worldwindow.frameStatistics.frameTime;
                frameStatistics.tesselationTime = worldwindow.frameStatistics.tessellationTime;
                frameStatistics.layerRenderingTime = worldwindow.frameStatistics.layerRenderingTime;
                frameStatistics.orderedRenderingTime = worldwindow.frameStatistics.orderedRenderingTime;
                frameStatistics.terrainTileCount = worldwindow.frameStatistics.terrainTileCount;
                frameStatistics.imageTileCount = worldwindow.frameStatistics.imageTileCount;
                frameStatistics.renderedTileCount = worldwindow.frameStatistics.renderedTileCount;
                frameStatistics.tileUpdateCount = worldwindow.frameStatistics.tileUpdateCount;
                frameStatistics.textureLoadCount = worldwindow.frameStatistics.textureLoadCount;
                frameStatistics.vboLoadCount = worldwindow.frameStatistics.vboLoadCount;

                self.frameStats.push(frameStatistics);
            }
        };
    };

    Util.prototype.move = function (endStates) {

        if (Array.isArray(endStates)) {
            endStates.forEach(function (endState) {
                this.moveQueue.push(endState);
            }, this);
        } else {
            this.moveQueue.push(endStates);
        }

        this.wwd.redraw();
    };

    Util.prototype.startMetricCapture = function () {
        this.frameStats = [];
        this.captureMetrics = true;
    };

    Util.prototype.stopMetricCapture = function () {
        this.captureMetrics = false;
    };

    Util.generateResultsSummary = function (dataArray, title) {
        var min = Util.calculateMin(dataArray), max = Util.calculateMax(dataArray), average, stddev, bins;

        // calculate average
        average = Util.calculateAverage(dataArray);

        // calculate standard deviation
        stddev = Util.calculateStdDev(dataArray);

        // bin the data on 5 second bins
        bins = Util.binValues(dataArray, 5);

        // create the html elements displaying the data
        var encDiv = document.createElement("div");
        var titleEl = document.createElement("h2");
        titleEl.appendChild(document.createTextNode(title));
        encDiv.appendChild(titleEl);
        var list = document.createElement("ul");
        encDiv.appendChild(list);
        var li = document.createElement("li");
        list.appendChild(li);
        li.appendChild(document.createTextNode("Average: " + average));
        li = document.createElement("li");
        list.appendChild(li);
        li.appendChild(document.createTextNode("Standard Deviation: " + stddev));
        li = document.createElement("li");
        list.appendChild(li);
        li.appendChild(document.createTextNode("Max: " + max));
        li = document.createElement("li");
        list.appendChild(li);
        li.appendChild(document.createTextNode("Min: " + min));

        encDiv.appendChild(Util.generateTextOutput(dataArray));

        return encDiv;
    };

    Util.calculateMax = function (values) {
        var max = -Number.MAX_VALUE;

        values.forEach(function (value) {
            max = Math.max(max, value);
        });

        return max;
    };

    Util.calculateMin = function (values) {
        var min = Number.MAX_VALUE;

        values.forEach(function (value) {
            min = Math.min(min, value);
        });

        return min;
    };

    Util.calculateAverage = function (values) {
        var total = 0;
        values.forEach(function (value) {
            total += value;
        });

        return total / values.length;
    };

    Util.calculateStdDev = function (values) {
        var avg = Util.calculateAverage(values), total = 0, diff;

        values.forEach(function (value) {
            diff = value - avg;
            total += diff * diff;
        });

        return Math.sqrt(total / values.length);
    };

    Util.binValues = function (values, binSize) {
        var i, idx, min = Util.calculateMin(values), max = Util.calculateMax(values), binRange = (max - min),
            len = values.length, binCount = Math.ceil(binRange / binSize), bins;

        bins = new Array(binCount + 1);

        WWUtil.fillArray(bins, 0);
        for (i = 0; i < len; i++) {
            idx = Math.floor((values[i] - min) / binSize); // TODO check if this should be floor or round
            bins[idx]++;
        }

        return bins;
    };

    Util.generateSimplePlot = function (data, sizeX, sizeY, reverseData) {
        var canvas = document.createElement("canvas"), xScale, yScale, i, x, y, ctx, max = Util.calculateMax(data),
            min = Util.calculateMin(data), dataPoints = data.length;

        // setup canvas element
        canvas.setAttribute("width", sizeX);
        canvas.setAttribute("height", sizeY);
        ctx = canvas.getContext("2d");

        // setup scaling values
        xScale = sizeX / dataPoints;
        yScale = sizeY / (max - min);

        // plot data
        x = 0;
        y = data[0] * yScale;
        if (reverseData) {
            y = sizeY - y;
        }
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (i = 1; i < dataPoints; i++) {
            x = xScale * i;
            y = data[i] * yScale;
            if (reverseData) {
                y = sizeY - y;
            }
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        return canvas;
    };

    Util.generateTextOutput = function (data) {
        var textOutput = document.createElement("textarea");
        textOutput.value = data.join(",");
        textOutput.setAttribute("id", "text-data-output");

        var copyToClipboardButton = document.createElement("button");
        copyToClipboardButton.appendChild(document.createTextNode("Copy to Clipboard"));
        copyToClipboardButton.addEventListener("click", function () {
            textOutput.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        });

        var outputDiv = document.createElement("div");
        outputDiv.appendChild(textOutput);
        var buttonDiv = document.createElement("div");
        buttonDiv.appendChild(copyToClipboardButton);

        var div = document.createElement("div");
        div.appendChild(outputDiv);
        div.appendChild(buttonDiv);

        return div;
    };

    // Internal use only
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
