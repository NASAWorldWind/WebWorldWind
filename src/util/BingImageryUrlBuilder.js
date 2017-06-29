/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BingImageryUrlBuilder
 * @version $Id: BingImageryUrlBuilder.js 3094 2015-05-14 23:02:03Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../util/WWUtil'
    ],
    function (ArgumentError,
              Logger,
              WWUtil) {
        "use strict";

        /**
         * Constructs a URL builder for Bing imagery.
         * @alias BingImageryUrlBuilder
         * @constructor
         * @classdesc Provides a factory to create URLs for Bing image requests.
         * @param {String} imagerySet The name of the imagery set to display.
         * @param {String} bingMapsKey The Bing Maps key to use for the image requests. If null or undefined, the key at
         * [WorldWind.BingMapsKey]{@link WorldWind#BingMapsKey} is used. If that is null or undefined, the default
         * World Wind Bing Maps key is used,
         * but this fallback is provided only for non-production use. If you are using Web World Wind in an app or a
         * web page, you must obtain your own key from the
         * [Bing Maps Portal]{@link https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx}
         * and either pass it as a parameter to this constructor or specify it as the property
         * [WorldWind.BingMapsKey]{@link WorldWind#BingMapsKey}.
         */
        var BingImageryUrlBuilder = function (imagerySet, bingMapsKey) {
            var wwBingMapsKey = "AkttWCS8p6qzxvx5RH3qUcCPgwG9nRJ7IwlpFGb14B0rBorB5DvmXr2Y_eCUNIxH";

            if (!bingMapsKey) {
                this.bingMapsKey = WorldWind.BingMapsKey;

                if (!bingMapsKey) {
                    this.bingMapsKey = wwBingMapsKey;
                }

                if (bingMapsKey === wwBingMapsKey) {
                    this.bingMapsKey = wwBingMapsKey;
                    BingImageryUrlBuilder.showBingMapsKeyWarning();
                }
            }

            this.imagerySet = imagerySet;
        };

        // Intentionally not documented.
        BingImageryUrlBuilder.showBingMapsKeyWarning = function () {
            if (!BingImageryUrlBuilder.keyMessagePrinted) {
                BingImageryUrlBuilder.keyMessagePrinted = true;

                Logger.log(Logger.LEVEL_WARNING, "WARNING: You are using a limited use, non-production Bing Maps key.\n" +
                "If you are developing an app or a web page this violates the Bing Terms of Use.\n" +
                "Please visit https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx to obtain your own key for your application.\n" +
                "Specify that key to World Wind by setting the WorldWind.BingMapsKey property to your key " +
                "prior to creating any Bing Maps layers.\n");
            }
        };

        BingImageryUrlBuilder.prototype.requestMetadata = function () {
            // Retrieve the metadata for the imagery set.

            if (!this.metadataRetrievalInProcess) {
                this.metadataRetrievalInProcess = true;

                var url = "https://dev.virtualearth.net/REST/V1/Imagery/Metadata/" + this.imagerySet + "/0,0?zl=1&uriScheme=https&key="
                    + this.bingMapsKey;

                // Use JSONP to request the metadata. Can't use XmlHTTPRequest because the virtual earth server doesn't
                // allow cross-origin requests for metadata retrieval.

                var thisObject = this;
                WWUtil.jsonp(url, "jsonp", function (jsonData) {
                    thisObject.imageUrl = jsonData.resourceSets[0].resources[0].imageUrl;

                    // Send an event to request a redraw.
                    var e = document.createEvent('Event');
                    e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                    window.dispatchEvent(e);

                    thisObject.metadataRetrievalInProcess = false;
                });

            }
        };

        /**
         * Creates the URL string for a Bing Maps request.
         * @param {Tile} tile The tile for which to create the URL.
         * @param {String} imageFormat This argument is not used.
         * @return {String} The URL for the specified tile.
         * @throws {ArgumentError} If the specified tile is null or undefined.
         */
        BingImageryUrlBuilder.prototype.urlForTile = function (tile, imageFormat) {
            if (!tile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "BingImageryUrlBuilder", "urlForTile", "missingTile"));
            }

            if (!this.imageUrl) {
                // Can't do anything until we get the metadata back from the server.
                this.requestMetadata();
                return null;
            }

            // The quad key identifies the specific image tile for the requested tile.
            var quadKey = this.quadKeyFromLevelRowColumn(tile.level.levelNumber, tile.row, tile.column),
                url;

            // Modify the original image URL to request the tile.
            if (this.imagerySet === "Aerial") {
                url = this.imageUrl.replace(/a3/, "a" + quadKey);
            } else if (this.imagerySet === "AerialWithLabels") {
                url = this.imageUrl.replace(/h3/, "h" + quadKey);
            } else if (this.imagerySet === "Road") {
                url = this.imageUrl.replace(/r3/, "r" + quadKey);
            }

            return url;
        };

        // Intentionally not documented.
        BingImageryUrlBuilder.prototype.quadKeyFromLevelRowColumn = function (levelNumber, row, column) {
            var digit, mask, key = "";

            for (var i = levelNumber + 1; i > 0; i--) {
                digit = 0;
                mask = 1 << (i - 1);

                if ((column & mask) != 0) {
                    digit += 1;
                }

                if ((row & mask) != 0) {
                    digit += 2;
                }

                key += digit.toString();
            }

            return key;
        };

        return BingImageryUrlBuilder;
    });