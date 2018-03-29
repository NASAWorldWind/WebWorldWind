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
 * @exports AsterV2ElevationCoverage
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
         * Constructs an Earth elevation coverage using ASTER V2 data.
         * @alias AsterV2ElevationCoverage
         * @constructor
         * @augments TiledElevationCoverage
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
         */
        var AsterV2ElevationCoverage = function () {
            TiledElevationCoverage.call(this,
                new Sector(-83.0001, 83.0001, -180, 180), new Location(45, 45), 11, "application/bil16",
                "AsterV2Elevations256", 256, 256, 0.000277777777778);

            this.displayName = "ASTER V2 Earth Elevation Coverage";
            this.minElevation = -11000;
            this.maxElevation = 8850;
            this.pixelIsPoint = false;
            this.urlBuilder = new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev", "aster_v2", "", "1.3.0");
        };

        AsterV2ElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

        return AsterV2ElevationCoverage;
    });