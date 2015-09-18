/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BingWMSLayer
 * @version $Id: BingWMSLayer.js 2939 2015-03-30 16:50:49Z tgaskins $
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

        // Intentionally not documented. For diagnostic use only.
        var BingWMSLayer = function () {
            TiledImageLayer.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 16, "image/png", "BingWMS", 256, 256);

            this.displayName = "Bing WMS";
            this.pickEnabled = false;
            this.maxActiveAltitude = 10e3;

            this.urlBuilder = new WmsUrlBuilder("http://worldwind27.arc.nasa.gov/wms/virtualearth", "ve", "", "1.3.0");
        };

        BingWMSLayer.prototype = Object.create(TiledImageLayer.prototype);

        return BingWMSLayer;
    });