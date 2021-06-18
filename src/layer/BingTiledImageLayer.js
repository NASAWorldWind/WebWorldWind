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
 * @exports BingTiledImageLayer
 */
define([
        '../util/Color',
        '../shapes/ScreenImage',
        '../layer/MercatorTiledImageLayer',
        '../WorldWind'
    ],
    function (Color,
              ScreenImage,
              MercatorTiledImageLayer,
              WorldWind) {
        "use strict";

        /**
         * Constructs a base Bing layer. This constructor is meant to be called only by subclasses.
         * @alias BingTiledImageLayer
         * @constructor
         * @augments MercatorTiledImageLayer
         * @classdesc Provides an abstract base layer for Bing imagery. This class is not intended to be constructed
         * independently but as a base layer for subclasses.
         * See {@link BingAerialLayer}, {@link BingAerialWithLabelsLayer} and {@link BingRoadsLayer}.
         *
         * @param {String} displayName This layer's display name.
         */
        var BingTiledImageLayer = function (displayName) {
            MercatorTiledImageLayer.call(this, displayName, 23, "image/jpeg", displayName, 256, 1);

            // TODO: Picking is enabled as a temporary measure for screen credit hyperlinks to work (see Layer.render)
            this.pickEnabled = true;

            this.detectBlankImages = true;

            // Set the detail control so the resolution is a close match 
            // to the resolution on the Bing maps website
            this.detailControl = 1.25;
        };

        // Internal use only. Intentionally not documented.
        BingTiledImageLayer.logoImage = null;

        // Internal use only. Intentionally not documented.
        BingTiledImageLayer.logoLastFrameTime = 0;

        BingTiledImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        BingTiledImageLayer.prototype.doRender = function (dc) {
            MercatorTiledImageLayer.prototype.doRender.call(this, dc);

            if (this.inCurrentFrame) {
                this.renderLogo(dc);
            }
        };

        BingTiledImageLayer.prototype.renderLogo = function (dc) {
            if (!BingTiledImageLayer.logoImage) {
                BingTiledImageLayer.logoImage = new ScreenImage(WorldWind.configuration.bingLogoPlacement,
                    WorldWind.configuration.baseUrl + "images/powered-by-bing.png");
                BingTiledImageLayer.logoImage.imageColor = new Color(1, 1, 1, 0.5); // Make Bing logo semi transparent.
            }

            if (BingTiledImageLayer.logoLastFrameTime !== dc.timestamp) {
                BingTiledImageLayer.logoImage.screenOffset = WorldWind.configuration.bingLogoPlacement;
                BingTiledImageLayer.logoImage.imageOffset = WorldWind.configuration.bingLogoAlignment;
                BingTiledImageLayer.logoImage.render(dc);
                BingTiledImageLayer.logoLastFrameTime = dc.timestamp;
            }
        };

        return BingTiledImageLayer;
    });
