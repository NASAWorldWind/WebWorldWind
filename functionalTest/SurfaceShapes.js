requirejs([
    '../src/WorldWind'
    ],
    function (WorldWind) {
        "use strict";

        var statusDialog = document.getElementById("status-dialog");
        var statusOutput = document.getElementById("output");
        var globeCanvas = document.getElementById("globe");

        var updateStatus = function (statusMessage) {
            var children = statusDialog.childNodes;
            for (var c = 0; c < children.length; c++) {
                statusDialog.removeChild(children[c]);
            }

            statusDialog.appendChild(document.createTextNode(statusMessage));
        };

        updateStatus("Initializing globe...");

        var wwd = new WorldWind.WorldWindow(globeCanvas);
        wwd.globe.elevationModel.removeAllCoverages(); // Don't want delays associated with parsing and changing terrain
        var bmnglayer = new WorldWind.BMNGOneImageLayer();
        bmnglayer.minActiveAltitude = 0;
        wwd.addLayer(bmnglayer); // Don't want any imaging processing delays

        updateStatus("Globe Loaded, ready for testing");

        var runNavigation = function () {

        };

    });