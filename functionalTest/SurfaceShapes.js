requirejs([
    '../src/WorldWind'
    ],
    function (WorldWind) {
        "use strict";

        var statusDialog = document.getElementById("status-dialog");
        var statusOutput = document.getElementById("output");
        var globeCanvas = document.getElementById("globe");

        statusDialog.innerText = "Initializing globe...";

        var wwd = new WorldWind.WorldWindow(globeCanvas);
        wwd.globe.elevationModel.removeAllCoverages(); // Don't want delays associated with changing terrain
        var bmnglayer = new WorldWind.BMNGOneImageLayer();
        bmnglayer.minActiveAltitude = 0;
        wwd.addLayer(bmnglayer); // Don't want any imaging processing delays

        statusDialog.innerText = "Globe Loaded";

    });