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
 * @exports EarthElevationModel
 */
define([
        '../globe/AsterV2EarthElevationCoverage',
        '../globe/ElevationModel',
        '../globe/GebcoEarthElevationCoverage',
        '../globe/UsgsNedEarthElevationCoverage'
    ],
    function (AsterV2EarthElevationCoverage,
              ElevationModel,
              GebcoEarthElevationCoverage,
              UsgsNedEarthElevationCoverage) {
        "use strict";

        /**
         * Constructs an EarthElevationModel consisting of three elevation coverages GEBCO, Aster V2, and USGS NED.
         * @alias EarthElevationModel
         * @constructor
         */
        var EarthElevationModel = function () {
            ElevationModel.call(this);

            this.addCoverage(new GebcoEarthElevationCoverage());
            this.addCoverage(new AsterV2EarthElevationCoverage());
            this.addCoverage(new UsgsNedEarthElevationCoverage());
        };

        EarthElevationModel.prototype = Object.create(ElevationModel.prototype);

        return EarthElevationModel;
    });