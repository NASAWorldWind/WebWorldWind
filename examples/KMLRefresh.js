/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * Illustrates how to refresh KML files
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

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layer.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            // Add atmosphere layer on top of base layer.
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

        var kmlLayer = new WorldWind.RenderableLayer("KML");
        wwd.addLayer(kmlLayer);
        var kmlFilePromise = new WorldWind.KmlFile('data/etnaOverlay.kml');
        var displayedKML = null;
        var normalKML = null;
        kmlFilePromise.then(function (kmlFile) {
            kmlLayer.addRenderable(kmlFile);
            normalKML = kmlFile;
            displayedKML = kmlFile;
            wwd.redraw();
            wwd.goTo(new WorldWind.Position(37.58543388598137, 14.97128369746704, 90000));
        });
        kmlFilePromise = new WorldWind.KmlFile('data/etnaOverlay-shifted.kml');
        var shiftedKML = null;
        kmlFilePromise.then(function (kmlFile) {
            shiftedKML = kmlFile;
        });
        $('#switchKML').click(function () {
            if (normalKML && shiftedKML) {
                kmlLayer.removeRenderable(displayedKML);
                if (displayedKML == normalKML) {
                    kmlLayer.addRenderable(shiftedKML);
                    displayedKML = shiftedKML;
                } else {
                    kmlLayer.addRenderable(normalKML);
                    displayedKML = normalKML;
                }
                wwd.redraw();
            }
        });


        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });