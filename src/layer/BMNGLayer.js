/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BMNGLayer
 * @version $Id: BMNGLayer.js 3403 2015-08-15 02:00:01Z tgaskins $
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../layer/TiledImageLayer',
        '../util/WmsUrlBuilder'
    ],
    function (Location,
              Sector,
              TiledImageLayer,
              WmsUrlBuilder) {
        "use strict";

        /**
         * Constructs a Blue Marble image layer.
         * @alias BMNGLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Displays a Blue Marble image layer that spans the entire globe.
         * @param {String} layerName The name of the layer to display, in the form "BlueMarble-200401"
         * "BlueMarble-200402", ... "BlueMarble-200412". "BlueMarble-200405" is used if the argument is null
         * or undefined.
         */
        var BMNGLayer = function (layerName) {
            TiledImageLayer.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 5, "image/jpeg", layerName || "BMNG256", 256, 256);

            this.displayName = "Blue Marble";
            this.pickEnabled = false;

            this.urlBuilder = new WmsUrlBuilder("https://worldwind25.arc.nasa.gov/wms",
                layerName || "BlueMarble-200405", "", "1.3.0");
        };

        BMNGLayer.prototype = Object.create(TiledImageLayer.prototype);

        return BMNGLayer;
    });