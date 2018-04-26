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
define([], function () {
    "use strict";

    var CustomMatchers = function () {
    };

    CustomMatchers.toEqualNumber = function (util, customEqualityTesters) {
        return {
            compare: function (actual, expected, delta) {
                var difference = Math.abs(actual - expected);
                return {
                    pass: difference <= delta,
                    message: "Expected " + actual + " to equal " + expected + ", but the difference is " + difference
                };
            }
        };
    };

    CustomMatchers.toEqualVec3 = function (util, customEqualityTesters) {
        return {
            compare: function (actual, expected, delta) {
                var difference = actual.distanceTo(expected);
                return {
                    pass: difference <= delta,
                    message: "Expected " + actual + " to equal " + expected + ", but the difference is " + difference
                };
            }
        };
    };

    CustomMatchers.toBeSector = function (util, customEqualityTesters) {
        return {
            compare: function (actual, expected, delta) {
                var difference = Math.abs(actual.minLatitude - expected.minLatitude);
                difference += Math.abs(actual.maxLatitude - expected.maxLatitude);
                difference += Math.abs(actual.minLongitude - expected.minLongitude);
                difference += Math.abs(actual.maxLongitude - expected.maxLongitude);
                return {
                    pass: difference <= Math.abs(delta),
                    message: "Expected minLat: " + actual.minLatitude + ", maxLat: " + actual.maxLatitude
                        + ", minLon: " + actual.minLongitude + ", maxLon: " + actual.maxLongitude
                        + " to equal " + "minLat: " + expected.minLatitude + ", maxLat: " + expected.maxLatitude
                        + ", minLon: " + expected.minLongitude + ", maxLon: " + expected.maxLongitude
                }
            }
        }
    };

    return CustomMatchers;
});