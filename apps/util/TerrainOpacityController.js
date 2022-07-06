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
 * @exports TerrainOpacityController
 */
define(function () {
    "use strict";

    /**
     * Constructs a TerrainOpacityController.
     * @alias TerrainOpacityController
     * @constructor
     * @classdesc Provides a slider to control the opacity of TiledImageLayer layers.
     * @param {WorldWindow} worldWindow The WorldWindow to associate with this opacity controller.
     */
    var TerrainOpacityController = function (worldWindow) {
        var thisController = this;

        this.wwd = worldWindow;

        this.slider = $("#terrainOpacitySlider").slider({
            value: this.wwd.surfaceOpacity * 100,
            min: 0,
            max: 100,
            animate: true,
            slide: function (event, ui) {
                $("#terrainOpacityReadout").html(ui.value / 100);
                thisController.updateOpacity(ui.value);
            }
        });
        $("#terrainOpacityReadout").html(this.slider.slider("value") / 100);
    };

    TerrainOpacityController.prototype.updateOpacity = function (value) {
        this.wwd.surfaceOpacity = value / 100;
        //for (var i = 0; i < this.wwd.layers.length; i++) {
        //    var layer = this.wwd.layers[i];
        //
        //    if (layer instanceof WorldWind.TiledImageLayer) {
        //        layer.opacity = value / 100;
        //    }
        //}

        this.wwd.redraw();
    };

    return TerrainOpacityController;
});