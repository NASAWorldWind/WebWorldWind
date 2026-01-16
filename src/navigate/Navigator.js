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
 * @exports Navigator
 */
define(['../error/ArgumentError',
        '../util/Logger',
        '../geom/LookAt'
    ],
    function (ArgumentError,
              Logger,
              LookAt) {
        "use strict";

        /**
         * Constructs a base navigator.
         * @deprecated
         * @alias Navigator
         * @constructor
         * @classdesc Provides an abstract base class for navigators. This class is not meant to be instantiated
         * directly. Deprecated, see  {@Link Camera}.
         * @param {WorldWindow} worldWindow The WorldWindow to associate with this navigator.
         */
        var Navigator = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "constructor", "missingWorldWindow"));
            }

            this.wwd = worldWindow;

            /**
             * Internal use only.
             * A temp variable used to hold the look view during calculations. Using an object level temp property
             * negates the need for ad-hoc allocations and reduces load on the garbage collector.
             * @ignore
             */
            this.scratchLookAt = new LookAt();
        };

        Object.defineProperties(Navigator.prototype, {
            /**
             * This navigator's heading, in degrees clockwise from north.
             * @type {Number}
             * @default 0
             */
            heading: {
                get: function () {
                    return this.wwd.cameraAsLookAt(this.scratchLookAt).heading;
                },
                set: function (value) {
                    var lookAt = this.wwd.cameraAsLookAt(this.scratchLookAt);
                    lookAt.heading = value;
                    this.wwd.cameraFromLookAt(lookAt);
                }
            },

            /**
             * This navigator's tilt, in degrees.
             * @type {Number}
             * @default 0
             */
            tilt: {
                get: function () {
                    return this.wwd.cameraAsLookAt(this.scratchLookAt).tilt;
                },
                set: function (value) {
                    var lookAt = this.wwd.cameraAsLookAt(this.scratchLookAt);
                    lookAt.tilt = value;
                    this.wwd.cameraFromLookAt(lookAt);
                }
            },

            /**
             * This navigator's roll, in degrees.
             * @type {Number}
             * @default 0
             */
            roll: {
                get: function () {
                    return this.wwd.cameraAsLookAt(this.scratchLookAt).roll;
                },
                set: function (value) {
                    var lookAt = this.wwd.cameraAsLookAt(this.scratchLookAt);
                    lookAt.roll = value;
                    this.wwd.cameraFromLookAt(lookAt);
                }
            }
        });

        return Navigator;
    });