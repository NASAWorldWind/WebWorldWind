/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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

            // Create the World Window.
            var wwd = new WorldWind.WorldWindow("canvasOne");

            // Sinergise layers
            var wmtsCapabilities;

            /*
            * The key to access Copernicus Sentinel data hosted on www.sentinel-hub.com is provided free-of-charge by
            * Sinergise for demonstration purposes only. You must obtain your own key at www.sentinel-hub.com before
            * using this layer in your application.
            */
            var wmtsServer = 'http://services.sentinel-hub.com/v1/wmts/56748ba2-4a88-4854-beea-86f9afc63e35';

            $.get(wmtsServer + '?REQUEST=GetCapabilities&SERVICE=WMTS', function (response) {
                wmtsCapabilities = new WorldWind.WmtsCapabilities(response);
                console.log(wmtsCapabilities);
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
