/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Illustrates how to load and display a GeoTiff file.
 */

requirejs(['./WorldWindShim',
           './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add imagery layers to the WorldWindow.
        var layers = [
            //Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create GeoTiff layer and add it to the WorldWindow's layer list. Disabled until its image is loaded.
        var geoTiffLayer = new WorldWind.RenderableLayer("GeoTiff");
        geoTiffLayer.enabled = false;
        geoTiffLayer.showSpinner = true;
        wwd.addLayer(geoTiffLayer);

        var resourceUrl = "https://worldwind.arc.nasa.gov/web/examples/data/black_sea_rgb.tif";

        // Load the GeoTiff using the Reader's built-in XHR retrieval function.
        WorldWind.GeoTiffReader.retrieveFromUrl(resourceUrl, function (geoTiffReader, xhrStatus) {
            if (!geoTiffReader) {
                // Error, provide the status text to the console.
                console.log(xhrStatus);
                return;
            }

            // Display the obtained GeoTiff imagery with a WorldWind SurfaceImage renderable.
            var surfaceGeoTiff = new WorldWind.SurfaceImage(
                geoTiffReader.metadata.bbox,
                new WorldWind.ImageSource(geoTiffReader.getImage())
            );

            // Add the SurfaceImage to the GeoTiff layer and update the layer manager.
            geoTiffLayer.addRenderable(surfaceGeoTiff);
            geoTiffLayer.enabled = true;
            geoTiffLayer.showSpinner = false;
            layerManager.synchronizeLayerList();

            // Redraw the WorldWindow and point the camera towards the imagery location.
            wwd.redraw();
            wwd.goTo(new WorldWind.Position(43.69, 28.54, 55000));
        });

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });