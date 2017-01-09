/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WcsEarthElevationModel
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../globe/ElevationModel',
        '../util/WcsTileUrlBuilder'
    ],
    function (Location,
              Sector,
              ElevationModel,
              WcsTileUrlBuilder) {
        "use strict";

        /**
         * Constructs an Earth elevation model.
         * @alias WcsEarthElevationModel
         * @constructor
         * @augments ElevationModel
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA World Wind elevation service.
         */
        var WcsEarthElevationModel = function () {
            ElevationModel.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 12, "image/tiff", "EarthElevations256", 256, 256);

            this.displayName = "WCS Earth Elevation Model";
            this.minElevation = -11000; // Depth of Marianas Trench, in meters
            this.maxElevation = 8850; // Height of Mt. Everest
            this.pixelIsPoint = false; // World Wind WMS elevation layers return pixel-as-area images

            this.urlBuilder = new WcsTileUrlBuilder("https://worldwind26.arc.nasa.gov/wms2",
                "NASA_SRTM30_900m_Tiled", "1.0.0");
        };

        WcsEarthElevationModel.prototype = Object.create(ElevationModel.prototype);

        return WcsEarthElevationModel;
    });