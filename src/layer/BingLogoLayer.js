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
 * @exports BingLogoLayer
 */
define([
        '../util/Color',
        '../util/Offset',
        '../layer/Layer',
        '../shapes/ScreenImage'
    ],
    function (Color,
              Offset,
              Layer,
              ScreenImage) {
        "use strict";

        /**
         * A Layer that displays the Bing logo.
         * @alias BingLogoLayer
         * @constructor
         * @augments Layer
         * @classdesc Displays the Bing logo in order to provide attributions to layers with imagery provided by Bing.
         * Attached to the {@link DrawContext} and added to the {@link WorldWindow} as an 'internal' Layer. It's
         * disabled by default and meant to be commanded to draw the Bing logo by {@link BingTiledImageLayer}
         * and its subclasses.
         */
        var BingLogoLayer = function () {
            Layer.call(this, "BingLogoLayer");

            this.attributionImage = WorldWind.configuration.baseUrl + "images/powered-by-bing.png";

            this.enabled = false;

            /**
             * An {@link Offset} indicating where to place the Bing logo on the screen.
             * @type {Offset}
             * @default A value of (WorldWind.OFFSET_INSET_PIXELS, 5, WorldWind.OFFSET_PIXELS, 5) provides a
             * 5px margin inset from the lower right corner of the screen.
             */
            this.logoPlacement = new Offset(WorldWind.OFFSET_INSET_PIXELS, 5, WorldWind.OFFSET_PIXELS, 5);

            /**
             * An {@link Offset} indicating the alignment of the Bing logo relative to the placement position.
             * @type {Offset}
             * @default Lower right corner of the logo.
             */
            this.logoAlignment = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);

            this.attribution = new ScreenImage(this.logoPlacement, this.attributionImage);

            // Make Bing logo semi-transparent.
            this.attribution.imageColor = new Color(1, 1, 1, 0.5);
        };

        BingLogoLayer.prototype = Object.create(Layer.prototype);

        BingLogoLayer.prototype.doRender = function (dc) {
            Layer.prototype.doRender.call(this, dc);
            this.attribution.screenOffset = this.logoPlacement;
            this.attribution.imageOffset = this.logoAlignment;
            this.attribution.render(dc);
        };

        return BingLogoLayer;
    }
)
;