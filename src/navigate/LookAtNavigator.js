/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports LookAtNavigator
 */
define([
        '../geom/Location',
        '../geom/LookAt',
        '../navigate/LookAtPositionProxy',
        '../navigate/Navigator'
    ],
    function (Location,
              LookAt,
              LookAtPositionProxy,
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
            Navigator.call(this, worldWindow);


            /**
             * Internal use only.
             * A temp variable used to hold the position during calculations and property retrieval. Using an object
             * level temp property negates the need for ad-hoc allocations and reduces load on the garbage collector.
             * @ignore
             */
            this.scratchLookAtPositionProxy = new LookAtPositionProxy(this);
        };

        LookAtNavigator.prototype = Object.create(Navigator.prototype);

        Object.defineProperties(LookAtNavigator.prototype, {
            /**
             * The geographic location at the center of the viewport.
             * @type {Location}
             */
            lookAtLocation: {
                get: function () {
                    this.wwd.cameraAsLookAt(this.scratchLookAt);
                    this.scratchLookAtPositionProxy.position.copy(this.scratchLookAt.position);
                    return this.scratchLookAtPositionProxy;
                },
                set: function (value) {
                    var lookAt = this.wwd.cameraAsLookAt(this.scratchLookAt);
                    lookAt.position.latitude = value.latitude;
                    lookAt.position.longitude = value.longitude;
                    if (value.altitude) {
                        lookAt.position.altitude = value.altitude;
                    }
                    else {
                        lookAt.position.altitude = 0;
                    }
                    this.wwd.cameraFromLookAt(lookAt);
                }
            },

            /**
             * The distance from this navigator's eye point to its look-at location.
             * @type {Number}
             * @default 10,000 kilometers
             */
            range: {
                get: function () {
                    return this.wwd.cameraAsLookAt(this.scratchLookAt).range;
                },
                set: function (value) {
                    var lookAt = this.wwd.cameraAsLookAt(this.scratchLookAt);
                    lookAt.range = value;
                    this.wwd.cameraFromLookAt(lookAt);
                }
            }
        });

        return LookAtNavigator;
    });