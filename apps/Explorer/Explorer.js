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

            // Create the WorldWindow.
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
            var lookAt = new WorldWind.LookAt();
            lookAt.position.latitude = 30;
            lookAt.position.longitude = -(180 / 12) * ((new Date()).getTimezoneOffset() / 60);
            this.wwd.cameraFromLookAt(lookAt);

            this.goToBox = new GoToBox(this.wwd);
            this.layersPanel = new LayersPanel(this.wwd);
            this.timeSeriesPlayer = new TimeSeriesPlayer(this.wwd);
            this.serversPanel = new ServersPanel(this.wwd, this.layersPanel, this.timeSeriesPlayer);
            this.projectionMenu = new ProjectionMenu(this.wwd);

            this.layersPanel.timeSeriesPlayer = this.timeSeriesPlayer;

            this.serversPanel.attachServer("https://neo.sci.gsfc.nasa.gov/wms/wms");
        };

        return Explorer;
    }
)
;