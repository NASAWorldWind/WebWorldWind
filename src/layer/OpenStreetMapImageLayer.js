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
/**
 * @exports OpenStreetMapImageLayer
 */
define([
        '../util/Color',
        '../util/Logger',
        '../ogc/wmts/WmtsCapabilities',
        '../layer/WmtsLayer'
    ],
    function (Color,
              Logger,
              WmtsCapabilities,
              WmtsLayer) {
        "use strict";

        /**
         * Constructs an Open Street Map layer.
         * @alias OpenStreetMapImageLayer
         * @constructor
         * @augments WmtsLayer
         * @classdesc Provides a layer that shows Open Street Map imagery.
         *
         * @param {String} displayName This layer's display name. "Open Street Map" if this parameter is
         * null or undefined.
         */
        var OpenStreetMapImageLayer = function (displayName) {
            var xhr = new XMLHttpRequest(), url = "https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml",
                self = this;

            this.displayName = displayName || "Open Street Map";

            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var wmtsCapabilities = new WmtsCapabilities(xhr.responseXML);
                        var wmtsLayerCapabilities = wmtsCapabilities.getLayer("osm");
                        var wmtsConfig = WmtsLayer.formLayerConfiguration(wmtsLayerCapabilities);
                        wmtsConfig.title = self.displayName;
                        WmtsLayer.call(self, wmtsConfig);
                    } else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "OSM retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            };

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "OSM retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "OSM retrieval timed out: " + url);
            };

            xhr.send(null);

            this.pickEnabled = false;
        };

        OpenStreetMapImageLayer.prototype = Object.create(WmtsLayer.prototype);

        OpenStreetMapImageLayer.prototype.doRender = function (dc) {
            WmtsLayer.prototype.doRender.call(this, dc);

            // Add a screen credit to attribute the data source to OSM and EOX
            // The pattern for this attribute is described in the WMTS Capabilities document and demonstrated at EOX
            // Maps site: http://maps.eox.at/
            if (this.inCurrentFrame) {
                dc.screenCreditController.addStringCredit("http://www.openstreetmap.org/copyright, http://maps.eox.at/#data, and http://eox.at", Color.DARK_GRAY);
                dc.screenCreditController.addStringCredit("OpenStreetMap { Data © OpenStreetMap contributers, Rendering © MapServer and EOX }", Color.DARK_GRAY);
            }
        };

        return OpenStreetMapImageLayer;
    }
);
