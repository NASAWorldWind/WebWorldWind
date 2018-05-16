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
 * @exports WcsEarthElevationCoverage
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../globe/TiledElevationCoverage',
        '../util/WcsTileUrlBuilder'
    ],
    function (Location,
              Sector,
              TiledElevationCoverage,
              WcsTileUrlBuilder) {
        "use strict";

        /**
         * Constructs an Earth elevation model.
         * @alias WcsEarthElevationCoverage
         * @constructor
         * @augments TiledElevationCoverage
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
         * @deprecated
         */
        var WcsEarthElevationCoverage = function () {
            TiledElevationCoverage.call(this, {
                coverageSector: Sector.FULL_SPHERE,
                resolution: 0.008333333333333,
                retrievalImageFormat: "image/tiff",
                minElevation: -11000,
                maxElevation: 8850,
                urlBuilder: new WcsTileUrlBuilder("https://worldwind26.arc.nasa.gov/wms2",
                    "NASA_SRTM30_900m_Tiled", "1.0.0")
            });

            this.displayName = "WCS Earth Elevation Coverage";
        };

        WcsEarthElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

        return WcsEarthElevationCoverage;
    });