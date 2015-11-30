/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BMNGOneImageLayer
 * @version $Id: BMNGOneImageLayer.js 2942 2015-03-30 21:16:36Z tgaskins $
 */
define([
        '../layer/RenderableLayer',
        '../geom/Sector',
        '../shapes/SurfaceImage',
        '../util/WWUtil'
    ],
    function (RenderableLayer,
              Sector,
              SurfaceImage,
              WWUtil) {
        "use strict";

        /**
         * Constructs a Blue Marble image layer that spans the entire globe.
         * @alias BMNGOneImageLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Displays a Blue Marble image layer that spans the entire globe with a single image.
         */
        var BMNGOneImageLayer = function () {
            RenderableLayer.call(this, "Blue Marble Image");

            var surfaceImage = new SurfaceImage(Sector.FULL_SPHERE,
                WorldWind.configuration.baseUrl + "images/BMNG_world.topo.bathy.200405.3.2048x1024.jpg");

            this.addRenderable(surfaceImage);

            this.pickEnabled = false;
            this.minActiveAltitude = 3e6;
        };

        BMNGOneImageLayer.prototype = Object.create(RenderableLayer.prototype);

        return BMNGOneImageLayer;
    });