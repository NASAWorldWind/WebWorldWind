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
    function (Location) {
        "use strict";

        /**
         * Constructs a look-at location proxy
         * @deprecated
         * @alias LookAtPositionProxy
         * @constructor
         * @classdesc A Position proxy class that is used for backward compatibility purposes by the deprecated LookAtNavigator class.
         */
        var LookAtPositionProxy = function (navigator) {
            this.position = new Position(0, 0, 0);
            this.navigator = navigator;
        };

        Object.defineProperties(LookAtPositionProxy.prototype, {
            latitude: {
                get: function () {
                    return this.location.latitude;
                },
                set: function (value) {
                    this.location.latitude = value;
                    this.navigator.lookAtLocation = this.location;
                }
            },

            longitude: {
                get: function () {
                    return this.location.longitude;
                },
                set: function (value) {
                    this.location.longitude = value;
                    this.navigator.lookAtLocation = this.location;
                }
            }
        });

        return LookAtPositionProxy;
    });