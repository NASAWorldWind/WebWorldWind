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
 * @exports WmsTimeDimensionedLayer
 */
define([
        '../error/ArgumentError',
        '../layer/Layer',
        '../util/Logger',
        '../layer/WmsLayer'
    ],
    function (ArgumentError,
              Layer,
              Logger,
              WmsLayer) {
        "use strict";

        /**
         * Constructs a WMS time-dimensioned image layer.
         * @alias WmsTimeDimensionedLayer
         * @constructor
         * @augments Layer
         * @classdesc Displays a time-series WMS image layer. This layer contains a collection of {@link WmsLayer}s,
         * each representing a different time in a time sequence. Only the layer indicated by this layer's
         * [time]{@link WmsTimeDimensionedLayer#time} property is displayed during any frame.
         * @param {{}} config Specifies configuration information for the layer.
         * See the constructor description for {@link WmsLayer} for a description of the required properties.
         * @throws {ArgumentError} If the specified configuration is null or undefined.
         */
        var WmsTimeDimensionedLayer = function (config) {
            if (!config) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsTimeDimensionedLayer", "constructor",
                        "No configuration specified."));
            }

            Layer.call(this, "WMS Time Dimensioned Layer");

            /**
             * The configuration object specified at construction.
             * @type {{}}
             * @readonly
             */
            this.config = config;

            // Intentionally not documented.
            this.displayName = config.title;
            this.pickEnabled = false;

            // Intentionally not documented. Contains the lazily loaded list of sub-layers.
            this.layers = {};
        };

        WmsTimeDimensionedLayer.prototype = Object.create(Layer.prototype);

        WmsTimeDimensionedLayer.prototype.doRender = function (dc) {
            if (this.time) {
                var currentTimeString = this.time.toISOString(),
                    layer = this.layers[currentTimeString];

                if (!layer) {
                    layer = new WmsLayer(this.config, currentTimeString);
                    this.layers[currentTimeString] = layer;
                }

                layer.opacity = this.opacity;
                layer.doRender(dc);

                this.inCurrentFrame = layer.inCurrentFrame;
            }
        };

        return WmsTimeDimensionedLayer;
    });