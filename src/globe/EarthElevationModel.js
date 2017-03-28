/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports EarthElevationModel
 * @version $Id: EarthElevationModel.js 2936 2015-03-27 22:04:59Z tgaskins $
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../globe/ElevationModel',
        '../util/WmsUrlBuilder'
    ],
    function (Location,
              Sector,
              ElevationModel,
              WmsUrlBuilder) {
        "use strict";

        /**
         * Constructs an Earth elevation model.
         * @alias EarthElevationModel
         * @constructor
         * @augments ElevationModel
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA World Wind elevation service.
         */
        var EarthElevationModel = function () {
            ElevationModel.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 12, "application/bil16", "EarthElevations256", 256, 256);

            this.displayName = "Earth Elevation Model";
            this.minElevation = -11000; // Depth of Marianas Trench, in meters
            this.maxElevation = 8850; // Height of Mt. Everest
            this.pixelIsPoint = false; // World Wind WMS elevation layers return pixel-as-area images

            this.urlBuilder = new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev",
                "GEBCO,aster_v2,USGS-NED", "", "1.3.0");
        };

        EarthElevationModel.prototype = Object.create(ElevationModel.prototype);

        return EarthElevationModel;
    });