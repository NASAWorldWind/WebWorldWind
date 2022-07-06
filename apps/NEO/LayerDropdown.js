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
define(function () {
    "use strict";

    var LayerDropdown = function (controller) {
        this.controller = controller;
    };

    LayerDropdown.prototype.setLayers = function (datasetCaps) {
        this.fillDropdownList(datasetCaps);

        $("#layerDropdownTitle").html(datasetCaps.layers[0].title + "<span class='caret'></span>");
    };

    LayerDropdown.prototype.fillDropdownList = function (datasetCaps) {

        var dropdownList = $('#layerDropdownList');

        dropdownList.empty();

        for (var i = 0; i < datasetCaps.layers.length; i++) {
            var layer = datasetCaps.layers[i];

            var menuItem = $('<li><a>' + layer.title + '</a></li>');
            dropdownList.append(menuItem);
        }

        var controller = this.controller;
        dropdownList.find(" li").on("click", function (e) {
            controller.onLayerClick(e);
        });
    };

    return LayerDropdown;
});