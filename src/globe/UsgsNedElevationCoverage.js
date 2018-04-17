/*
 * Copyright 2015-2018 WorldWind Contributors
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
 * @exports UsgsNedElevationCoverage
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../globe/TiledElevationCoverage',
        '../util/WmsUrlBuilder'
    ],
    function (Location,
              Sector,
              TiledElevationCoverage,
              WmsUrlBuilder) {
        "use strict";

        /**
         * Constructs an Earth elevation coverage using USGS NED data.
         * @alias UsgsNedElevationCoverage
         * @constructor
         * @augments TiledElevationCoverage
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
         */
        var UsgsNedElevationCoverage = function () {
            // CONUS Extent: (-124.848974, 24.396308) - (-66.885444, 49.384358)
            // TODO: Expand this extent to cover HI when the server NO_DATA value issue is resolved.
            TiledElevationCoverage.call(this,
                new Sector(24.396308, 49.384358, -124.848974, -66.885444), new Location(45, 45), 12, "application/bil16",
                "UsgsNedElevations256", 256, 256, 0.000092592592593);

            this.displayName = "USGS NED Earth Elevation Coverage";
            this.minElevation = -11000;
            this.maxElevation = 8850;
            this.pixelIsPoint = false;
            this.urlBuilder = new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev", "USGS-NED", "", "1.3.0");
        };

        UsgsNedElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

        return UsgsNedElevationCoverage;
    });