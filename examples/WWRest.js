/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WWRest.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");
        wwd.addLayer(new WorldWind.BMNGRestLayer(null, "../data/Earth/BMNG256-200404", "Blue Marble"));
        wwd.addLayer(new WorldWind.LandsatRestLayer(null, "../data/Earth/LandSat", "LandSat"));
        wwd.addLayer(new WorldWind.BingWMSLayer());
        wwd.addLayer(new WorldWind.CompassLayer());
        wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));

        wwd.globe.elevationModel = new WorldWind.EarthRestElevationModel(null, "../data/Earth/EarthElevations2",
            "Earth Elevations");

        var surfaceImageLayer = new WorldWind.RenderableLayer();
        surfaceImageLayer.displayName = "Uploaded Image";
        wwd.addLayer(surfaceImageLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        wwd.canvas.addEventListener('drop', function (e) {
            e.preventDefault();
            console.log("DROP");

            var files = e.dataTransfer.files;
            if (files && files.length) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:3001");
                var body = new FormData();
                for (var i = 0; i < files.length; i++) {
                    body.append(i, files[i]);
                }
                xhr.upload.onload = function (e) {
                };
                xhr.send(body);
            }

            return false;
        }, false);

        wwd.canvas.addEventListener('dragover', function (e) {
            e.preventDefault();
            return false;
        }, false);

        wwd.canvas.addEventListener('dragenter', function (e) {
            e.preventDefault();
            return false;
        }, false);

        var onTimeout = function () {
            console.log("UPDATING IMAGE");

            if (surfaceImageLayer.renderables.length > 0) {
                surfaceImageLayer.removeAllRenderables();
            }

            var surfaceImage = new WorldWind.SurfaceImage(
                new WorldWind.Sector(46, 47, -123, -122),
                WorldWind.WWUtil.currentUrlSansFilePart() + "/../uploads/N.46-W.123.png"
                //"http://10.0.1.197/WebWorldWind/uploads/N.46-W.123.png"
            );

            surfaceImageLayer.addRenderable(surfaceImage);

            wwd.redraw();

            window.setTimeout(onTimeout, 2000);
        };

        window.setTimeout(onTimeout, 2000);
    });