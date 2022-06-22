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
define(['../../src/WorldWind',
        '../util/GoToBox',
        '../util/LayersPanel',
        '../util/ProjectionMenu'],
    function (ww,
              GoToBox,
              LayersPanel,
              ProjectionMenu) {
        "use strict";
        
        var SinergiseWMTS = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Create the WorldWindow.
            var wwd = new WorldWind.WorldWindow("canvasOne");

            // Sinergise layers
            var wmtsCapabilities;

            /*
            * This example should be functional if a valid API key is provided.
            * Your own key to access Copernicus Sentinel data hosted on www.sentinel-hub.com must be
            * obtained by creating an account at https://www.sentinel-hub.com/create_account/
            * Trial keys as well as ESA-sponsored keys are available at https://www.sentinel-hub.com/Network-of-Resources/
            */

            // TO DO: Verify proper functioning with up to date API key

            var wmtsServer = 'https://services.sentinel-hub.com/v1/wmts/';
            var apiKey = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'; // Substitute with Sentinel Hub API key

            $.get(wmtsServer + apiKey + '?REQUEST=GetCapabilities&SERVICE=WMTS', function (response) {
                wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
                // console.log(wmtsCapabilities);
            }).done(function () {
                // Internal layers
                var layers = [
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false}
                ];

                // Sinergise "Agriculture" layer
                var agricultureLayerCaps = wmtsCapabilities.getLayer('TRUE_COLOR');
                var agricultureLayerConf = WorldWind.WmtsLayer.formLayerConfiguration(agricultureLayerCaps);
                var agricultureLayer = new WorldWind.WmtsLayer(agricultureLayerConf, "2017-03-09");
                layers.push({layer: agricultureLayer, enabled : true});

                // Internal layers
                layers.push(
                    {layer: new WorldWind.CompassLayer(), enabled: true},
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
                );

                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    layers[l].layer.layerSelected = layers[l].selected;
                    wwd.addLayer(layers[l].layer);
                }

                // Start the view pointing to Paris
                wwd.navigator.lookAtLocation.latitude = 48.86;
                wwd.navigator.lookAtLocation.longitude = 2.37;
                wwd.navigator.range = 5e4;

                // Create controllers for the user interface elements.
                new GoToBox(wwd);
                var layersPanel = new LayersPanel(wwd);
                new ProjectionMenu(wwd);

                var layerDropdown = $("#layerDropdown");

                var dropdownButton = $('<button class="btn btn-info btn-block dropdown-toggle" type="button" data-toggle="dropdown">Add<span class="caret"></span></button>');
                layerDropdown.append(dropdownButton);

                var ulItem = $('<ul class="dropdown-menu">');
                layerDropdown.append(ulItem);

                var allWmtsLayers = wmtsCapabilities.getLayers();
                for (var i = 0; i < allWmtsLayers.length; i++) {
                    var layerItem = $('<li><a data-id="' + allWmtsLayers[i].identifier + '">' + allWmtsLayers[i].titles[0].value + '</a></li>');
                    ulItem.append(layerItem);
                }

                ulItem = $('</ul>');
                layerDropdown.append(ulItem);

                dropdownButton.html("Add ("+allWmtsLayers.length+") <span class='caret'></span>");

                layerDropdown.find("li").on("click", function (e) {
                    var layerId = e.target.dataset.id;
                    var layerCaps = wmtsCapabilities.getLayer(layerId);
                    var layerConf = WorldWind.WmtsLayer.formLayerConfiguration(layerCaps);
                    wwd.layers.splice(wwd.layers.length - 3, 0, new WorldWind.WmtsLayer(layerConf, "2017-03-09"));
                    layersPanel.synchronizeLayerList();
                });
            });
        };

        return SinergiseWMTS;
    });
