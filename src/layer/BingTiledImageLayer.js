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
 * @exports BingTiledImageLayer
 */
define([
        '../geom/Angle',
        '../util/Color',
        '../geom/Location',
        '../util/Offset',
        '../shapes/ScreenImage',
        '../geom/Sector',
        '../layer/MercatorTiledImageLayer'
    ],
    function (Angle,
              Color,
              Location,
              Offset,
              ScreenImage,
              Sector,
              MercatorTiledImageLayer) {
        "use strict";

        /**
         * Constructs a base Bing layer. This constructor is meant to be called only by subclasses.
         * @alias BingTiledImageLayer
         * @constructor
         * @augments MercatorTiledImageLayer
         * @classdesc Provides an abstract base layer for Bing imagery. This class is not intended to be constructed
         * independently but as a base layer for subclasses.
         *
         * See {@link BingAerialLayer}, {@link BingAerialWithLabelsLayer} and {@link BingRoadsLayer}.
         * @param {String} displayName This layer's display name.
         */
        var BingTiledImageLayer = function (displayName) {
            this.imageSize = 256;

            MercatorTiledImageLayer.call(this,
                new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 23, "image/jpeg", displayName,
                this.imageSize, this.imageSize);

            this.displayName = displayName;

            // TODO: Picking is enabled as a temporary measure for screen credit hyperlinks to work (see Layer.render)
            this.pickEnabled = true;

            this.detectBlankImages = true;

            this.attributionImage = WorldWind.configuration.baseUrl + "images/powered-by-bing.png";
            // TODO: CORS issues, insecure protocol
            //this.attributionImage = "http://dev.virtualearth.net/Branding/logo_powered_by.png";

            this.attribution = this.createBingLogotype();
        };

        BingTiledImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        BingTiledImageLayer.prototype.doRender = function (dc) {
            MercatorTiledImageLayer.prototype.doRender.call(this, dc);
            if (this.inCurrentFrame) {
                // Draw Bing attribution in upper right corner. Offset vertically when the coordinates display is placed
                // at the top of the canvas depending on canvas width, as defined in CanvasDisplayLayer.
                if (dc.currentGlContext.canvas.clientWidth >= 650) {
                    // Large canvas, draw attribution in upper left corner.
                    this.attribution.screenOffset.y = 0;
                } else {
                    // Medium/Small canvas, offset vertically to avoid cluttering.
                    this.attribution.screenOffset.y = 21;
                }

                this.attribution.render(dc);
            }
        };

        // Overridden from TiledImageLayer.
        BingTiledImageLayer.prototype.createTopLevelTiles = function (dc) {
            this.topLevelTiles = [];

            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
        };

        // Determines the Bing map size for a specified level number.
        BingTiledImageLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return 256 << (levelNumber + 1);
        };

        BingTiledImageLayer.prototype.createBingLogotype = function () {
            // Locate Bing logo in the upper left corner
            var offset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_INSET_PIXELS, 0);
            var logotype = new ScreenImage(offset, this.attributionImage);
            // Align the logo using as reference point its upper left corner
            logotype.imageOffset.y = 1;
            logotype.imageOffset.x = 0;
            // Make logo semi-transparent
            logotype.imageColor = new Color(1, 1, 1, 0.5);
            return logotype;
        };

        return BingTiledImageLayer;
    }
)
;