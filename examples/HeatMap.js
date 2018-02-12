/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        $.get('http://eoapps.solenix.ch/stats/sentinel-2a/2017/10.json').then(function (result) {
            "use strict";
            // Create the WorldWindow.
            var wwd = new WorldWind.WorldWindow("canvasOne");

            var data = result.boxes.map(function (box) {
                return new WorldWind.IntensityLocation((Number(box.bbox1Lat) + Number(box.bbox2Lat)) / 2, (Number(box.bbox1Lon) + Number(box.bbox2Lon)) / 2, box.amount);
            });

            function calculatePointRadius(sector, tileWidth, tileHeight) {
                var latitude = Math.ceil(Math.abs(sector.maxLatitude - sector.minLatitude));
                if(latitude < 1) {
                    return tileHeight;
                } else {
                    return Math.ceil(tileHeight / latitude);
                }
            }


            function drawHeatmap(){
                var currentShape = $('#shapeToDisplay').find(":selected").val();
                var tile = WorldWind.ColoredSquareTile;
                var scale = colors;
                if(currentShape === 'circle') {
                    tile = WorldWind.ColoredTile;
                }

                return new WorldWind.HeatMapLayer("HeatMap, Default version", data, {
                    radius: calculatePointRadius,
                    tile: tile,
                    incrementPerIntensity: $('#colorDensityIncrement').val(),
                    scale: scale
                })
            }

            var heatmapLayer = drawHeatmap();

            function replaceHeatmap() {
                wwd.removeLayer(heatmapLayer);

                heatmapLayer = drawHeatmap();

                wwd.addLayer(heatmapLayer);
            }

            // Adapt the HeatMap Layer on Change by throwing away the old one and building again the new one.
            $('#colorDensityIncrement').on('change', replaceHeatmap);
            $('#shapeToDisplay').on('change', replaceHeatmap);

            var colors = ['#0000ff','#00ffff', '#00ff00', '#ffff00', '#ff0000'];
            $('#addColor').on('click', function(){
                colors.push('#000000');
                rebuildColors();
            });

            function rebuildColors() {
                $('#colorsList').empty();

                colors.forEach(function(color, index) {
                    var colorHtml = $('<div><input type="color" id="color'+index+'" value="'+color+'"/><input type="button" id="removeColor'+index+'" data-index="'+index+'" class="colorRemoval" value="Remove Color"/></div>');
                    $('#colorsList').append(colorHtml);
                    $('#color'+index).on('change', function(){
                        colors[index] = $('#color'+index).val();
                        replaceHeatmap();
                    });
                });

                $('.colorRemoval').on('click', function(){
                    colors.splice($(this).get('data-index'), 1);
                    rebuildColors();
                });

                replaceHeatmap();
            }
            rebuildColors();

            var rectangleLayer = new WorldWind.TiledImageLayer(new WorldWind.Sector(-90, 90, -180, 180), new WorldWind.Location(45, 45), 14, 'image/png', 'Rectangle 1', 512, 512);
            var RectangleUrlBuilder = function() {
                WorldWind.UrlBuilder.call(this);
            };

            RectangleUrlBuilder.prototype = Object.create(WorldWind.UrlBuilder.prototype);

            RectangleUrlBuilder.prototype.urlForTile = function() {
                // Draw the rectangle fo the size of the canvas.
                var canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;

                var ctx = canvas.getContext('2d');
                ctx.globalAlpha = 1;
                ctx.fillRect(0, 0, 512, 512);

                return canvas.toDataURL();
            };

            rectangleLayer.urlBuilder = new RectangleUrlBuilder();
            rectangleLayer.displayName = "Black background";

            /**
             * Add imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BMNGLayer(), enabled: true},
                {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
                {layer: rectangleLayer, enabled: true}
            ];

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                wwd.addLayer(layers[l].layer);
            }

            wwd.addLayer(heatmapLayer);
            wwd.navigator.lookAtLocation = new WorldWind.Location(50, 20);
            wwd.redraw();

            // Create a layer manager for controlling layer visibility.
            var layerManager = new LayerManager(wwd);

            // Now set up to handle highlighting.
            var highlightController = new WorldWind.HighlightController(wwd);
        });
    });