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
 * @exports LookAtNavigator
 */
define([
        '../geom/Location',
        '../navigate/Navigator',
        '../geom/Vec2'
    ],
    function (Location,
              Navigator,
              Vec2) {
        "use strict";

        /**
         * Constructs a look-at navigator.
         * @alias LookAtNavigator
         * @constructor
         * @augments Navigator
         * @classdesc Represents a navigator containing the required variables to enable the user to pan, zoom and tilt
         * the globe.
         * @param {WorldWindow} worldWindow The WorldWindow to associate with this navigator.
         */
        var LookAtNavigator = function (worldWindow) {
            Navigator.call(this, worldWindow);

            /**
             * The geographic location at the center of the viewport.
             * @type {Location}
             */
            this.lookAtLocation = new Location(30, -110);

            /**
             * The distance from this navigator's eye point to its look-at location.
             * @type {Number}
             * @default 10,000 kilometers
             */
            this.range = 10e6; // TODO: Compute initial range to fit globe in viewport.

            // Development testing only. Set this to false to suppress default navigator limits on 2D globes.
            this.enable2DLimits = true;

            // Intentionally not documented.
            this.beginPoint = new Vec2(0, 0);
            this.lastPoint = new Vec2(0, 0);
            this.beginHeading = 0;
            this.beginTilt = 0;
            this.beginRange = 0;
            this.lastRotation = 0;
        };

        LookAtNavigator.prototype = Object.create(Navigator.prototype);

        return LookAtNavigator;
    });