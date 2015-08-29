/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Explorer.js 3362 2015-07-31 19:29:12Z tgaskins $
 */
define(['../../src/WorldWind',
        '../util/GoToBox',
        '../util/LayersPanel',
        '../util/ProjectionMenu',
        '../util/ServersPanel',
        '../util/TimeSeriesPlayer'],
    function (ww,
              GoToBox,
              LayersPanel,
              ProjectionMenu,
              ServersPanel,
              TimeSeriesPlayer) {
        "use strict";

        var Explorer = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Create the World Window.
            this.wwd = new WorldWind.WorldWindow("canvasOne");

            /**
             * Added imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BMNGLayer(), enabled: true, hide: true},
                {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
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

            this.goToBox = new GoToBox(this.wwd);
            this.layersPanel = new LayersPanel(this.wwd);
            this.timeSeriesPlayer = new TimeSeriesPlayer(this.wwd);
            this.serversPanel = new ServersPanel(this.wwd, this.layersPanel, this.timeSeriesPlayer);
            this.projectionMenu = new ProjectionMenu(this.wwd);

            this.layersPanel.timeSeriesPlayer = this.timeSeriesPlayer;

            this.serversPanel.attachServer("neowms.sci.gsfc.nasa.gov/wms/wms");
        };

        return Explorer;
    }
)
;