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
 * Illustrates how to load and display Well-Known Text (WKT) data.
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

        // Parse a WKT collection and add it as a Layer.
        var defaultLayer = new WorldWind.RenderableLayer("WKT Geometry Collection");
        new WorldWind.Wkt("" +
            "GEOMETRYCOLLECTION(" +
            "   POLYGON ((40 -70, 45 -80, 40 -90)), " +
            "   POINT (33 -75)," +
            "   MULTIPOINT ((38 -70),(42 -75),(38 -80))," +
            "   LINESTRING ((33 -75, 37 -80, 33 -85))," +
            "   MULTILINESTRING ((38 -70, 42 -75, 38 -80),(43 -65, 47 -70, 43 -75))" +
            ")").load(null, null, defaultLayer);
        wwd.addLayer(defaultLayer);

        // Using the callback mechanism presented in the Wkt parser to update the shapes as well as
        // showing a message that confirms a successful rendering.
        var customCallbackLayer = new WorldWind.RenderableLayer("WKT Multi Polygon");
        new WorldWind.Wkt("MULTIPOLYGON (((50 -60, 55 -70, 50 -80)),((30 -60, 35 -70, 30 -80)))").load(
            function completionCallback(wkt, objects) {
                // Once all the shapes are parsed, this function is called.
                console.log('Parsing of the Wkt was completed');

                wkt.defaultParserCompletionCallback(wkt, objects);
            },
            function shapeConfigurationCallback(shape) {
                if (shape.type === WorldWind.WktType.SupportedGeometries.MULTI_POLYGON) {
                    var shapeAttributes = new WorldWind.ShapeAttributes(null);
                    shapeAttributes.interiorColor = WorldWind.Color.GREEN;
                    return {
                        attributes: shapeAttributes
                    };
                }
            },
            customCallbackLayer
        );
        wwd.addLayer(customCallbackLayer);

        // Allow for parsing of Well-Known Text from the app's text box (entered by the user).
        var wktLayer = new WorldWind.RenderableLayer('Custom WKT');
        $('#showWkt').click(function () {
            new WorldWind.Wkt($('#wkt').val()).load(null, null, wktLayer);
        });
        wwd.addLayer(wktLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });