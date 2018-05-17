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

        // second move
        var operationsComplete = 0;
        var moving = false;
        var navigationComplete = false;
        var moveTwo = function () {
            // wait until previous moves are complete
            operationsComplete++;
            if (operationsComplete > 1) {
                util.changeHeading(90, 1, 50, function() {
                    updateStatus("Move Complete");
                    moving = false;
                    operationsComplete = 0;
                    navigationComplete = true;
                });
            }
        };

        // first move
        var moveOne = function () {
            if (!moving) {
                moving = true;
                util.changeRange(8e5, 5e4, 50, moveTwo);
                util.changeTilt(75, 0.25, 50,  moveTwo);
            }
        };

        navigateButton.addEventListener("click", moveOne);

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
                    var canvas = document.createElement("canvas");
                    canvas.setAttribute("width", 500);
                    canvas.setAttribute("height", 500);
                    var ctx = canvas.getContext("2d");
                    ctx.beginPath();
                    var x = Math.floor(1 / len * 500);
                    var y = Math.floor((max - stats[1]) * 500 / (max - min));
                    ctx.moveTo(x, y);
                    for (var i = 2, len = stats.length; i < len; i++) {
                        x = Math.floor(i / len * 500);
                        var y = Math.floor((max - stats[i]) * 500 / (max - min));
                        ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    statusOutput.appendChild(canvas);
                    var idx = worldwindow.redrawCallbacks.indexOf(metricCapture);
                    worldwindow.redrawCallbacks.splice(idx, 1);
                }

            }
        };

        wwd.redrawCallbacks.push(metricCapture);

        staticShapesButton.addEventListener("click", function () {
            var layer = new WorldWind.RenderableLayer("Test Layer");
            wwd.addLayer(layer);
            for (var i = 0; i < 2000; i++) {
                var shapeLocation = new WorldWind.Location(Math.random() * 22.5 + 15.0, -80 - Math.random() * 45);
                var minorAxis = Math.random() * 100000 + 10000;
                var majorAxis = Math.random() * 500000 + 10000;
                var heading = Math.random() * 360;
                layer.addRenderable(new WorldWind.SurfaceEllipse(shapeLocation, majorAxis, minorAxis, heading));
            }
            wwd.redraw();
        });
    });
