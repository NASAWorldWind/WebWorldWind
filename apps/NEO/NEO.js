/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: NEO.js 3411 2015-08-17 04:23:28Z tgaskins $
 */
define(['../../src/WorldWind',
        './DatasetDropdown',
        './LayerDropdown',
        '../util/ProjectionMenu',
        '../util/TimeSeriesPlayer'],
    function (ww,
              DatasetDropdown,
              LayerDropdown,
              ProjectionMenu,
              TimeSeriesPlayer) {
        "use strict";

        var NEO = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Create the World Window.
            this.wwd = new WorldWind.WorldWindow("canvasOne");

            /**
             * Added imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BMNGLayer(), enabled: true, hide: true},
                {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                {layer: new WorldWind.CompassLayer(), enabled: true, hide: true},
                {layer: new WorldWind.CoordinatesDisplayLayer(this.wwd), enabled: true, hide: true},
                {layer: new WorldWind.ViewControlsLayer(this.wwd), enabled: true, hide: true}
            ];

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                layers[l].layer.hide = layers[l].hide;
                this.wwd.addLayer(layers[l].layer);
            }

            // Start the view pointing to a longitude within the current time zone.
            this.wwd.navigator.lookAtLocation.latitude = 30;
            this.wwd.navigator.lookAtLocation.longitude = -(180 / 12) * ((new Date()).getTimezoneOffset() / 60);

            this.timeSeriesPlayer = new TimeSeriesPlayer(this.wwd);
            this.projectionMenu = new ProjectionMenu(this.wwd);
            this.datasetDropdown = new DatasetDropdown(this);
            this.layerDropdown = new LayerDropdown(this);
        };

        NEO.prototype.onDatasetClick = function (event) {
            var datasetTitle = event.target.innerText || event.target.innerHTML;

            var datasetCaps = this.findLayerCapsByTitle(
                this.datasetDropdown.wmsCapsDoc.capability.layers[0], datasetTitle);

            $("#datasetDropdownTitle").html(datasetCaps.title + "<span class='caret'></span>");

            this.layerDropdown.setLayers(datasetCaps);

            this.setLayer(datasetCaps.layers[0].title);
        };

        NEO.prototype.onLayerClick = function (event) {
            var layerTitle = event.target.innerText || event.target.innerHTML;

            this.setLayer(layerTitle);
        };

        NEO.prototype.setLayer = function (layerTitle) {
            var layersToRemove = [];

            for (var i = 0; i < this.wwd.layers.length; i++) {
                var currentLayer = this.wwd.layers[i];

                if (currentLayer.NEOLayer) {
                    layersToRemove.push(currentLayer);
                }
            }

            for (i = 0; i < layersToRemove.length; i++) {
                this.wwd.removeLayer(layersToRemove[i]);
            }

            var layerCaps = this.findLayerCapsByTitle(this.datasetDropdown.wmsCapsDoc.capability.layers[0], layerTitle);
            this.addLayer(layerCaps);

            $("#layerDropdownTitle").html(layerTitle + "<span class='caret'></span>");
        };

        NEO.prototype.addLayer = function (layerCaps) {
            if (layerCaps.name) {
                var config = WorldWind.WmsLayer.formLayerConfiguration(layerCaps, null);
                var layer;

                config.numLevels = 5;

                if (config.timeSequences &&
                    (config.timeSequences[config.timeSequences.length - 1] instanceof WorldWind.PeriodicTimeSequence)) {
                    var timeSequence = config.timeSequences[config.timeSequences.length - 1];
                    //config.levelZeroDelta = new WorldWind.Location(60, 60);
                    layer = new WorldWind.WmsTimeDimensionedLayer(config);
                    layer.opacity = 0.8;
                    layer.time = timeSequence.startTime;
                    this.timeSeriesPlayer.timeSequence = timeSequence;
                    this.timeSeriesPlayer.layer = layer;
                    layer.timeSequence = timeSequence;
                } else {
                    layer = new WorldWind.WmsLayer(config, null);
                    this.timeSeriesPlayer.timeSequence = null;
                    this.timeSeriesPlayer.layer = null;
                }

                if (layerCaps.styles && layerCaps.styles.length > 0
                    && layerCaps.styles[0].legendUrls && layerCaps.styles[0].legendUrls.length > 0) {
                    this.addLegend(layerCaps.styles[0].legendUrls[0]);
                }

                layer.NEOLayer = true;
                layer.enabled = true;
                this.wwd.addLayer(layer);
                this.wwd.redraw();

                return layer;
            }

            return null;
        };

        NEO.prototype.addLegend = function (legendCaps) {
            var legendLayer = new WorldWind.RenderableLayer();

            var screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_INSET_PIXELS, 50),
                screenImage = new WorldWind.ScreenImage(screenOffset, legendCaps.url);
            screenImage.imageOffset =
                new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_INSET_PIXELS, 0);
            legendLayer.addRenderable(screenImage);
            legendLayer.NEOLayer = true;
            this.wwd.addLayer(legendLayer);
        };

        NEO.prototype.findLayerCapsByTitle = function (layerCaps, layerTitle) {
            if (layerCaps.title === layerTitle) {
                return layerCaps;
            }

            if (layerCaps.layers && layerCaps.layers.length > 0) {
                for (var i = 0; i < layerCaps.layers.length; i++) {
                    var found = this.findLayerCapsByTitle(layerCaps.layers[i], layerTitle);

                    if (found) {
                        return found;
                    }
                }
            }

            return null;
        };

        return NEO;
    });