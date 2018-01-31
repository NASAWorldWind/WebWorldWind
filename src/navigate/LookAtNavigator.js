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
        '../LookAt',
        '../navigate/Navigator'
    ],
    function (Location,
              LookAt,
              Navigator) {
        "use strict";

        /**
         * Constructs a look-at navigator.
         * @deprecated
         * @alias LookAtNavigator
         * @constructor
         * @augments Navigator
         * @classdesc Represents a navigator containing the required variables to enable the user to pan, zoom and tilt
         * the globe. Deprecated, see {@Link LookAt}.
         */
        var LookAtNavigator = function (worldWindow) {
            Navigator.call(this,worldWindow);
            // Development testing only. Set this to false to suppress default navigator limits on 2D globes.
            this.enable2DLimits = true;
        };

        LookAtNavigator.prototype = Object.create(Navigator.prototype);

        Object.defineProperties(LookAtNavigator.prototype, {
            /**
             * The geographic location at the center of the viewport.
             * @type {Location}
             */
            lookAtLocation: {
                get: function () {
                    return this.wwd.camera.getAsLookAt(this.scratchLookAt).lookAtPosition;
                },
                set: function (value) {
                    var lookAt=this.wwd.camera.getAsLookAt(this.scratchLookAt);
                    lookAt.lookAtPosition = value;
                    this.wwd.camera.setFromLookAt(lookAt);
                }
            },

            /**
             * The distance from this navigator's eye point to its look-at location.
             * @type {Number}
             * @default 10,000 kilometers
             */
            range: {
                get: function () {
                    return this.wwd.camera.getAsLookAt(this.scratchLookAt).range;
                },
                set: function (value) {
                    var lookAt=this.wwd.camera.getAsLookAt(this.scratchLookAt);
                    lookAt.range = value;
                    this.wwd.camera.setFromLookAt(lookAt);
                }
            }
        });

        return LookAtNavigator;
    });