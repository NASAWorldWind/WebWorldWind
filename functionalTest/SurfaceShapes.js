requirejs([
    '../src/WorldWind',
    './Util'
    ],
    function (WorldWind, Util) {
        "use strict";

        var statusDialog = document.getElementById("status-dialog");
        var statusOutput = document.getElementById("output");
        var navigateButton = document.getElementById("navigate-button");
        var staticShapesButton = document.getElementById("static-button");

        var updateStatus = function (statusMessage) {
            var children = statusDialog.childNodes;
            for (var c = 0; c < children.length; c++) {
                statusDialog.removeChild(children[c]);
            }

            statusDialog.appendChild(document.createTextNode(statusMessage));
        };

        updateStatus("Initializing globe...");
        var wwd = Util.initializeLowResourceWorldWindow("globe");
        var util = new Util(wwd);
        updateStatus("Globe Loaded, ready for testing");

        // moving state
        var moving = false;
        var navigationComplete = false;

        // moves
        var moveOne = {
            range: {
                goal: 8e5,
                step: 5e4
            },
            tilt: {
                goal: 75,
                step: 0.75
            },
            onComplete: function () {
                updateStatus("First move complete...");
            }
        };

        var moveTwo = {
            heading: {
                goal: 135,
                step: 1
            },
            onComplete: function () {
                updateStatus("Second move complete");
            }
        };

        var moveThree = {
            latitude: {
                goal: wwd.navigator.lookAtLocation.latitude,
                step: 1
            },
            longitude: {
                goal: -70,
                step: 0.25
            },
            onComplete: function () {
                moving = false;
                navigationComplete = true;
                updateStatus("Move Complete");
            }
        };

        var onClickMove = function () {
            if (!moving) {
                moving = true;
                util.move([moveOne, moveTwo, moveThree]);
            }
        };

        var onGenerateShapesClick = function () {
            var layer = new WorldWind.RenderableLayer("Test Layer");
            wwd.addLayer(layer);
            for (var i = 0; i < 10000; i++) {
                var shapeLocation = new WorldWind.Location(Math.random() * 160 - 80, Math.random() * 340 - 170);
                var minorAxis = Math.random() * 100000 + 10000;
                var majorAxis = Math.random() * 500000 + 10000;
                var heading = Math.random() * 360;
                layer.addRenderable(new WorldWind.SurfaceEllipse(shapeLocation, majorAxis, minorAxis, heading));
            }
            wwd.redraw();
        };

        // Temporary metric capture framework
        var stats = [], min = Number.MAX_VALUE, max = -Number.MAX_VALUE;
        var metricCapture = function (worldwindow, stage) {
            if (stage === WorldWind.AFTER_REDRAW) {
                if (moving && !navigationComplete) {
                    var frametime = worldwindow.frameStatistics.frameTime;
                    stats.push(frametime);
                    min = Math.min(min, frametime);
                    max = Math.max(max, frametime);
                }

                if (navigationComplete) {
                    navigationComplete = false;
                    // clean up the data
                    stats.shift();
                    stats.pop();
                    statusOutput.appendChild(Util.generateResultsSummary(stats, "Frame Times"));
                }
            }
        };
        wwd.redrawCallbacks.push(metricCapture);

        navigateButton.addEventListener("click", onClickMove);
        staticShapesButton.addEventListener("click", onGenerateShapesClick);
    });
