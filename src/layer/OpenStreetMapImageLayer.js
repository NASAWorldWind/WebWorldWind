/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenStreetMapImageLayer
 * @version $Id: OpenStreetMapImageLayer.js 3120 2015-05-28 02:32:45Z tgaskins $
 */
define([
        '../geom/Angle',
        '../util/Color',
        '../geom/Location',
        '../geom/Sector',
        '../layer/MercatorTiledImageLayer'
    ],
    function (Angle,
              Color,
              Location,
              Sector,
              MercatorTiledImageLayer) {
        "use strict";

        /**
         * Constructs an Open Street Map layer.
         * @alias OpenStreetMapImageLayer
         * @constructor
         * @augments MercatorTiledImageLayer
         * @classdesc Provides a layer that shows Open Street Map imagery.
         *
         * @param {String} displayName This layer's display name. "Open Street Map" if this parameter is
         * null or undefined.
         */
        var OpenStreetMapImageLayer = function (displayName) {
            this.imageSize = 256;
            displayName = displayName || "Open Street Map";

            MercatorTiledImageLayer.call(this,
                new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 19, "image/png", displayName,
                this.imageSize, this.imageSize);

            this.displayName = displayName;
            this.pickEnabled = false;

            // Create a canvas we can use when unprojecting retrieved images.
            this.destCanvas = document.createElement("canvas");
            this.destContext = this.destCanvas.getContext("2d");

            this.urlBuilder = {
                urlForTile: function (tile, imageFormat) {
                    //var url = "http://a.tile.openstreetmap.org/" +
                    return "http://otile1.mqcdn.com/tiles/1.0.0/osm/" +
                        (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
                }
            };
        };

        OpenStreetMapImageLayer.prototype = Object.create(MercatorTiledImageLayer.prototype);

        OpenStreetMapImageLayer.prototype.doRender = function (dc) {
            MercatorTiledImageLayer.prototype.doRender.call(this, dc);
            if (this.inCurrentFrame) {
                dc.screenCreditController.addStringCredit("\u00A9OpenStreetMap", Color.DARK_GRAY);
                dc.screenCreditController.addStringCredit("Tiles Courtesy of MapQuest", Color.DARK_GRAY);
            }
        };

        // Overridden from TiledImageLayer.
        OpenStreetMapImageLayer.prototype.createTopLevelTiles = function (dc) {
            this.topLevelTiles = [];

            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
            this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
        };

        // Determines the Bing map size for a specified level number.
        OpenStreetMapImageLayer.prototype.mapSizeForLevel = function (levelNumber) {
            return 256 << (levelNumber + 1);
        };

        return OpenStreetMapImageLayer;
    }
)
;