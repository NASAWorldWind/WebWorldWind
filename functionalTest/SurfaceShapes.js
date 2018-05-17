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
        var moveTwo = function () {
            // wait until previous moves are complete
            operationsComplete++;
            if (operationsComplete > 1) {
                util.changeHeading(90, 1, 50, function() {
                    updateStatus("Move Complete");
                    moving = false;
                    operationsComplete = 0;
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
    });
