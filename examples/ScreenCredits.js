/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create any layer that we desire to bind the screen credits to
        var anyLayer = new WorldWind.BMNGLandsatLayer();

        // Create  and add imagery and WorldWindow UI layers
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Add the layer thhat will be bound to the screen credits.
        wwd.addLayer(anyLayer);

        // Bind the screen credits to the desired layer (usually, conditioning their appearance
        // to the current display status of the layer).
        var dc = wwd.drawContext;
        anyLayer.doRender = function () {
            WorldWind.MercatorTiledImageLayer.prototype.doRender.call(this, dc);
            if (this.inCurrentFrame) {
                // Display the desired text if the layer is visible.
                dc.screenCreditController.addStringCredit(screenCreditText, WorldWind.Color.LIGHT_GRAY);
            }
        };

        // Create a layer manager for controlling layer visibility. Note that toggling on and off the
        // layer bound to the screen credits, toggles the latter on and off as well.
        var layerManager = new LayerManager(wwd);

        var screenCreditText =
            "Lorem ipsum dolor sit amet, consectetur adipiscing\n" +
            " elit, sed do eiusmod tempor incididunt ut labore et\n" +
            " dolore magna aliqua. Ut enim ad minim veniam, quis\n" +
            "nostrud exercitation ullamco laboris nisi ut aliquip\n" +
            "ex ea commodo consequat. Duis aute irure dolor in\n" +
            "reprehenderit in voluptate velit esse cillum dolore eu\n" +
            "fugiat nulla pariatur. Excepteur sint occaecat cupidatat\n" +
            "non proident, sunt in culpa qui officia deserunt mollit\n" +
            "anim id est laborum.\n" +
            "\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing\n" +
            " elit, sed do eiusmod tempor incididunt ut labore et\n" +
            " dolore magna aliqua. Ut enim ad minim veniam, quis\n" +
            "nostrud exercitation ullamco laboris nisi ut aliquip\n" +
            "ex ea commodo consequat. Duis aute irure dolor in\n" +
            "reprehenderit in voluptate velit esse cillum dolore eu\n" +
            "fugiat nulla pariatur. Excepteur sint occaecat cupidatat\n" +
            "non proident, sunt in culpa qui officia deserunt mollit\n" +
            "anim id est laborum.\n" +
            "\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing\n" +
            " elit, sed do eiusmod tempor incididunt ut labore et\n" +
            " dolore magna aliqua. Ut enim ad minim veniam, quis\n" +
            "nostrud exercitation ullamco laboris nisi ut aliquip\n" +
            "ex ea commodo consequat. Duis aute irure dolor in\n" +
            "reprehenderit in voluptate velit esse cillum dolore eu\n" +
            "fugiat nulla pariatur. Excepteur sint occaecat cupidatat\n" +
            "non proident, sunt in culpa qui officia deserunt mollit\n" +
            "anim id est laborum.\n" +
            "\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing\n" +
            " elit, sed do eiusmod tempor incididunt ut labore et\n" +
            " dolore magna aliqua. Ut enim ad minim veniam, quis\n" +
            "nostrud exercitation ullamco laboris nisi ut aliquip\n" +
            "ex ea commodo consequat. Duis aute irure dolor in\n" +
            "reprehenderit in voluptate velit esse cillum dolore eu\n" +
            "fugiat nulla pariatur. Excepteur sint occaecat cupidatat\n" +
            "non proident, sunt in culpa qui officia deserunt mollit\n" +
            "anim id est laborum.\n";
    });