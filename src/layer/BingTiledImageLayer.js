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
         * See {@link BingAerialLayer}, {@link BingAerialWithLabelsLayer} and {@link BingRoadsLayer}.
         *
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

            // Bing logo placement on the screen. Lower right corner by default.
            this.logoPlacement = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);

            // Bing logo alignment relative to its placement position. Replicates alignment
            // by ScreenCreditController by default.
            this.logoAlignment = new Offset(WorldWind.OFFSET_INSET_PIXELS, -5, WorldWind.OFFSET_INSET_PIXELS, 36);

            this.attribution = new ScreenImage(this.logoPlacement, this.attributionImage);

            // Make Bing logo semi transparent.
            this.attribution.imageColor = new Color(1, 1, 1, 0.5);
        };

        BingTiledImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        BingTiledImageLayer.prototype.doRender = function (dc) {
            MercatorTiledImageLayer.prototype.doRender.call(this, dc);
            if (this.inCurrentFrame) {
                this.attribution.screenOffset = this.logoPlacement;
                this.attribution.imageOffset = this.logoAlignment;
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

        return BingTiledImageLayer;
    }
)
;