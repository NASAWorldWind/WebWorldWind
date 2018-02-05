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
 * @exports LookAtLocationProxy
 */
define([
        '../geom/Location'
    ],
    function (Location) {
        "use strict";

        /**
         * Constructs a look-at location proxy
         * @deprecated
         * @alias LookAtLocationProxy
         * @constructor
         * @classdesc A Location proxy class that is used for backward compatibility purposes by the deprecated LookAtNavigator class.
         */
        var LookAtLocationProxy = function (navigator, latitude, longitude) {
            this.location=new Location(latitude,longitude);
            this.navigator = navigator;
        };

        Object.defineProperties(LookAtLocationProxy.prototype, {
            /**
             * The geographic location at the center of the viewport.
             * @type {Location}
             */
            latitude: {
                get: function () {
                    return this.location.latitude;
                },
                set: function (value) {
                    this.location.latitude=value;
                    navigator.lookAtLocation=this.location;
                }
            },

            longitude: {
                get: function () {
                    return this.location.longitude;
                },
                set: function (value) {
                    this.location.longitude=value;
                    navigator.lookAtLocation=this.location;
                }
            }
        });

        return LookAtLocationProxy;
    });