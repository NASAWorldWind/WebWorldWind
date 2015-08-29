/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BingAerialLayer
 * @version $Id: BingAerialLayer.js 2883 2015-03-06 19:04:42Z tgaskins $
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../layer/BingTiledImageLayer',
        '../util/BingImageryUrlBuilder'
    ],
    function (Location,
              Sector,
              BingTiledImageLayer,
              BingImageryUrlBuilder) {
        "use strict";

        /**
         * Constructs a Bing Aerial layer.
         * @alias BingAerialLayer
         * @constructor
         * @augments BingTiledImageLayer
         * @classdesc Displays the Bing Aerial layer.
         * See also {@link BingAerialWithLabelsLayer} and {@link BingRoadsLayer}.
         *
         * @param {String} bingMapsKey The Bing Maps key to use for the image requests. If null or undefined, the key at
         * WorldWind.BingMapsKey is used. If that is null or undefined, the default World Wind Bing Maps key is used,
         * but this fallback is provided only for non-production use. If you are using Web World Wind in an app or a
         * web page, you must obtain your own key from the
         * [Bing Maps Portal]{@link https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx}
         * and either pass it as a parameter to this constructor or specify it as the property WorldWind.BingMapsKey.
         */
        var BingAerialLayer = function (bingMapsKey) {
            BingTiledImageLayer.call(this, "Bing Aerial");

            this.urlBuilder = new BingImageryUrlBuilder("Aerial", bingMapsKey);
        };

        BingAerialLayer.prototype = Object.create(BingTiledImageLayer.prototype);

        return BingAerialLayer;
    });