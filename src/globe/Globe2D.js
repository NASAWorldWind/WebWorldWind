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
 * @exports Globe2D
 */
define([
        '../globe/Globe',
        '../projections/ProjectionEquirectangular',
        '../globe/ZeroElevationModel'
    ],
    function (Globe,
              ProjectionEquirectangular,
              ZeroElevationModel) {
        "use strict";

        /**
         * Constructs a 2D globe with a default {@link ZeroElevationModel} and
         * [equirectangular projection]{@link ProjectionEquirectangular}.
         * @alias Globe2D
         * @constructor
         * @augments Globe
         * @classdesc Represents a 2D flat globe with a configurable projection.
         * The default rectangular projection scrolls longitudinally.
         */
        var Globe2D = function () {
            Globe.call(this, new ZeroElevationModel(), new ProjectionEquirectangular());
        };

        Globe2D.prototype = Object.create(Globe.prototype);

        return Globe2D;
    });