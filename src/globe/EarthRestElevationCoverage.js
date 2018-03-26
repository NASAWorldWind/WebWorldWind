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
 * @exports EarthRestElevationCoverage
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../util/LevelRowColumnUrlBuilder',
        '../globe/TiledElevationCoverage'
    ],
    function (Location,
              Sector,
              LevelRowColumnUrlBuilder,
              TiledElevationCoverage) {
        "use strict";

        ///**
        // * Constructs an elevation coverage for Earth using a REST interface to retrieve the elevations from the server.
        // * @alias EarthRestElevationCoverage
        // * @constructor
        // * @classdesc Represents an Earth elevation coverage spanning the globe and using a REST interface to retrieve
        // * the elevations from the server.
        // * See [LevelRowColumnUrlBuilder]{@link LevelRowColumnUrlBuilder} for a description of the REST interface.
        // * @param {String} serverAddress The server address of the tile service. May be null, in which case the
        // * current origin is used (see <code>window.location</code>.
        // * @param {String} pathToData The path to the data directory relative to the specified server address.
        // * May be null, in which case the server address is assumed to be the full path to the data directory.
        // * @param {String} displayName The display name to associate with this elevation coverage.
        // */
        var EarthRestElevationCoverage = function (serverAddress, pathToData, displayName, resolution) {
            TiledElevationCoverage.call(this,
                Sector.FULL_SPHERE, new Location(60, 60), 5, "application/bil16", "EarthElevations", 512, 512, resolution);

            this.displayName = displayName;
            this.minElevation = -11000; // Depth of Marianas Trench, in meters
            this.maxElevation = 8850; // Height of Mt. Everest
            this.urlBuilder = new LevelRowColumnUrlBuilder(serverAddress, pathToData);
        };

        EarthRestElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

        return EarthRestElevationCoverage;
    });