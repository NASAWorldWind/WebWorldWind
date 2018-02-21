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
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
         */
        var WcsEarthElevationModel = function () {
            ElevationModel.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 12, "image/tiff", "EarthElevations256", 256, 256);

            this.displayName = "WCS Earth Elevation Model";
            this.minElevation = -11000; // Depth of Marianas Trench, in meters
            this.maxElevation = 8850; // Height of Mt. Everest
            this.pixelIsPoint = false; // WorldWind WMS elevation layers return pixel-as-area images

            this.urlBuilder = new WcsTileUrlBuilder("https://worldwind26.arc.nasa.gov/wms2",
                "NASA_SRTM30_900m_Tiled", "1.0.0");
        };

        WcsEarthElevationModel.prototype = Object.create(ElevationModel.prototype);

        return WcsEarthElevationModel;
    });