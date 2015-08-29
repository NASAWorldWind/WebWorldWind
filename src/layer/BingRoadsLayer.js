/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BingRoadsLayer
 * @version $Id: BingRoadsLayer.js 2883 2015-03-06 19:04:42Z tgaskins $
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
         * Constructs a Bing Roads layer.
         * @alias BingRoadsLayer
         * @constructor
         * @augments BingTiledImageLayer
         * @classdesc Displays a Bing Roads layer.
         * See also {@link BingAerialLayer} and {@link BingAerialWithLabelsLayer}.
         *
         * @param {String} bingMapsKey The Bing Maps key to use for the image requests. If null or undefined, the key at
         * WorldWind.BingMapsKey is used. If that is null or undefined, the default World Wind Bing Maps key is used,
         * but this fallback is provided only for non-production use. If you are using Web World Wind in an app or a
         * web page, you must obtain your own key from the
         * [Bing Maps Portal]{@link https://www.microsoft.com/maps/choose-your-bing-maps-API.aspx}
         * and either pass it as a parameter to this constructor or specify it as the property WorldWind.BingMapsKey.
         */
        var BingRoadsLayer = function (bingMapsKey) {
            BingTiledImageLayer.call(this, "Bing Roads");

            this.urlBuilder = new BingImageryUrlBuilder("Road", bingMapsKey);

            // Disable blank-image detection.
            this.detectBlankImages = false;
        };

        BingRoadsLayer.prototype = Object.create(BingTiledImageLayer.prototype);

        return BingRoadsLayer;
    });