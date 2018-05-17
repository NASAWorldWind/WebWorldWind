requirejs([
    '../src/WorldWind',
    './Util'
    ],
    function (WorldWind, Util) {
        "use strict";

        var statusDialog = document.getElementById("status-dialog");
        var statusOutput = document.getElementById("output");
        var navigateButton = document.getElementById("navigate-button");

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
        wwd.redrawCallbacks.push(function (worldwindow, stage) {
            if (stage === WorldWind.BEFORE_REDRAW) {
                if (moving && !navigationComplete) {
                    var frametime = worldwindow.frameStatistics.frameTime;
                    stats.push(frametime);
                    min = Math.min(min, frametime);
                    max = Math.max(max, frametime);
                }

                if (navigationComplete) {
                    var canvas = document.createElement("canvas");
                    canvas.setAttribute("width", Math.ceil(stats.length) + "");
                    canvas.setAttribute("height", Math.ceil(max - min) * 50 + "");
                    var ctx = canvas.getContext("2d");
                    ctx.beginPath();
                    ctx.moveTo(0, Math.floor(max - stats[0]) * 50);
                    for (var i = 1, len = stats.length; i < len; i++) {
                        ctx.lineTo(i, Math.floor(stats[i]) * 50);
                    }
                    ctx.stroke();
                    statusOutput.appendChild(canvas);
                }

            }
        });
    });
