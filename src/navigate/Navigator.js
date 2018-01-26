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
 * @exports Navigator
 */
define(['../error/ArgumentError',
        '../util/Logger',
        '../LookAtView'
    ],
    function (ArgumentError,
              Logger,
              LookAtView) {
        "use strict";

        /**
         * Constructs a base navigator.
         * @deprecated
         * @alias Navigator
         * @constructor
         * @classdesc Provides an abstract base class for navigators. This class is not meant to be instantiated
         * directly. Deprecated, see {@Link LookAtView} and {@Link CameraView}.
         * @param {WorldWindow} worldWindow The WorldWindow to associate with this navigator.
         */
        var Navigator = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Navigator", "constructor", "missingWorldWindow"));
            }

            this.wwd = worldWindow;

            this.scratchLookAtView = new LookAtView(this.wwd);
        };

        Object.defineProperties(Navigator.prototype, {
            /**
             * This navigator's heading, in degrees clockwise from north.
             * @type {Number}
             * @default 0
             */
            heading: {
                get: function () {
                    return LookAtView.fromView(this.wwd.worldWindowView, this.scratchLookAtView).heading;
                },
                set: function (value) {
                    var view = LookAtView.fromView(this.wwd.worldWindowView, this.scratchLookAtView);
                    view.heading = value;
                    this.wwd.worldWindowView = view;
                }
            },

            /**
             * This navigator's tilt, in degrees.
             * @type {Number}
             * @default 0
             */
            tilt: {
                get: function () {
                    return LookAtView.fromView(this.wwd.worldWindowView, this.scratchLookAtView).tilt;
                },
                set: function (value) {
                    var view = LookAtView.fromView(this.wwd.worldWindowView, this.scratchLookAtView);
                    view.tilt = value;
                    this.wwd.worldWindowView = view;
                }
            },

            /**
             * This navigator's roll, in degrees.
             * @type {Number}
             * @default 0
             */
            roll: {
                get: function () {
                    return LookAtView.fromView(this.wwd.worldWindowView, this.scratchLookAtView).roll;
                },
                set: function (value) {
                    var view = LookAtView.fromView(this.wwd.worldWindowView, this.scratchLookAtView);
                    view.roll = value;
                    this.wwd.worldWindowView = view;
                }
            }
        });

        return Navigator;
    });