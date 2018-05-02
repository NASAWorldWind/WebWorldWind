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
        '../layer/MercatorTiledImageLayer',
        '../layer/ViewControlsLayer'
    ],
    function (Angle,
              Color,
              Location,
              Offset,
              ScreenImage,
              Sector,
              MercatorTiledImageLayer,
              ViewControlsLayer) {
        "use strict";

        /**
         * Constructs a base Bing layer. This constructor is meant to be called only by subclasses.
         * @alias BingTiledImageLayer
         * @constructor
         * @augments MercatorTiledImageLayer
         * @classdesc Provides an abstract base layer for Bing imagery. This class is not intended to be constructed
         * independently but as a base layer for subclasses.
         * @param (logoOffset) Offset Optional offset indicating the Bing logo attribution placement on the screen.
         * @param (logoPosition) String Optional positioning of the Bing logo in the left canvas side, either top or
         * bottom of the canvas. Defaults to top.
         * See {@link BingAerialLayer}, {@link BingAerialWithLabelsLayer} and {@link BingRoadsLayer}.
         *
         * @param {String} displayName This layer's display name.
         */
        var BingTiledImageLayer = function (displayName, logoPosition) {

            var logotypePosition = logoPosition ? logoPosition : "top";

            this.imageSize = 256;

            MercatorTiledImageLayer.call(this,
                new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 23, "image/jpeg", displayName,
                this.imageSize, this.imageSize);

            this.displayName = displayName;

            // TODO: Picking is enabled as a temporary measure for screen credit hyperlinks to work (see Layer.render)
            this.pickEnabled = true;

            this.detectBlankImages = true;

            this.logoImage = WorldWind.configuration.baseUrl + "images/powered-by-bing.png";

            this.logo = this.createLogotype();

            this.logoPosition = logotypePosition;
        };

        BingTiledImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        BingTiledImageLayer.prototype.doRender = function (dc) {
            var canvasWidth = dc.currentGlContext.canvas.clientWidth;

            // Draw Bing logo in selected position.
            if (this.logoPosition = "top") {
                // Top left was selected. Draw in top left corner when CoordinatesDisplayLayer is being drawn at the
                // bottom of the screen

                this.logo.screenOffset.xUnits = WorldWind.OFFSET_FRACTION;
                this.logo.screenOffset.x = 0;
                this.logo.screenOffset.yUnits = WorldWind.OFFSET_INSET_PIXELS;
                this.logo.imageOffset.y = 1;
                this.logo.imageOffset.x = 0;

                if (canvasWidth >= 650) { // Large canvas, draw logo in upper left corner
                    this.logo.screenOffset.y = 0;
                } else { // Medium/Small canvas, offset vertically to avoid cluttering with CoordinatesDisplayLayer
                    this.logo.screenOffset.y = 21;
                }

            } else if (this.logoPosition = "bottom") {
                // Bottom left was selected. Draw in lower left corner when the view controls are not visible, or
                // right above them when they are.
                // dc.layers.indexOf("ViewControlsLayer")

            }



            MercatorTiledImageLayer.prototype.doRender.call(this, dc);
            if (this.inCurrentFrame) {
                this.logo.render(dc);
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

        BingTiledImageLayer.prototype.createLogotype = function () {
            var offset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);
            var logotype = new ScreenImage(offset, this.logoImage);

            logotype.imageColor = new Color(1, 1, 1, 0.5);


            return logotype;
        };

        return BingTiledImageLayer;
    }
)
;