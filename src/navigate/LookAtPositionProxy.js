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
 * @exports LookAtPositionProxy
 */
define([
        '../geom/Position'
    ],
    function (Position) {
        "use strict";

        /**
         * Constructs a look-at position proxy
         * @deprecated
         * @alias LookAtPositionProxy
         * @constructor
         * @classdesc A Position proxy class that is used for backward compatibility purposes by the deprecated LookAtNavigator class.
         */
        var LookAtPositionProxy = function (navigator) {
            this.position = new Position(0, 0, 0);
            this.lookAtNavigator = navigator;
        };

        Object.defineProperties(LookAtPositionProxy.prototype, {
            latitude: {
                get: function () {
                    return this.position.latitude;
                },
                set: function (value) {
                    this.position.latitude = value;
                    this.lookAtNavigator.lookAtLocation = this.position;
                }
            },

            longitude: {
                get: function () {
                    return this.position.longitude;
                },
                set: function (value) {
                    this.position.longitude = value;
                    this.lookAtNavigator.lookAtLocation = this.position;
                }
            },

            altitude: {
                get: function () {
                    return this.position.altitude;
                },
                set: function (value) {
                    this.position.altitude = value;
                    this.lookAtNavigator.lookAtLocation = this.position;
                }
            }
        });

        return LookAtPositionProxy;
    });