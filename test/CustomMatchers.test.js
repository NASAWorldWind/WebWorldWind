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
                var dx = Math.abs(actual[0] - expected[0]),
                    dy = Math.abs(actual[1] - expected[1]),
                    dz = Math.abs(actual[2] - expected[2]),
                    difference = Math.max(dx, dy, dz);
                return {
                    pass: difference <= delta,
                    message: "Expected " + actual + " to equal " + expected + ", but the difference is " + difference
                };
            }
        };
    };

    CustomMatchers.toEqualPosition = function (util, customEqualityTesters) {
        return {
            compare: function (actual, expected, delta) {
                var dlat = Math.abs(actual.latitude - expected.latitude),
                    dlon = Math.abs(actual.longitude - expected.longitude),
                    dalt = Math.abs(actual.altitude - expected.altitude),
                    difference = Math.max(dlat, dlon, dalt);
                return {
                    pass: difference <= delta,
                    message: "Expected " + actual + " to equal " + expected + ", but the difference is " + difference
                };
            }
        };
    };

    return CustomMatchers;
});