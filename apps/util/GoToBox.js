/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
 * @exports GoToBox
 */
define(function () {
    "use strict";

    /**
     * Constructs a GoToBox.
     * @alias GoToBox
     * @constructor
     * @classdesc Provides a search box enabling the user to find and move to specified locations.
     * @param {WorldWindow} worldWindow The WorldWindow to associate this GoToBox with.
     */
    var GoToBox = function (worldWindow) {
        var thisGoToBox = this;

        this.wwd = worldWindow;
        $("#searchBox").find("button").on("click", function (e) {
            thisGoToBox.onSearchButton(e);
        });

        this.geocoder = new WorldWind.NominatimGeocoder();
        $("#searchText").on("keypress", function (e) {
            thisGoToBox.onSearchTextKeyPress($(this), e);
        });
    };

    GoToBox.prototype.onSearchButton = function (event) {
        this.performSearch($("#searchText")[0].value)
    };

    GoToBox.prototype.onSearchTextKeyPress = function (searchInput, event) {
        if (event.keyCode === 13) {
            searchInput.blur();
            this.performSearch($("#searchText")[0].value)
        }
    };

    GoToBox.prototype.performSearch = function (queryString) {
        if (queryString) {
            var thisGoToBox = this,
                latitude, longitude;

            if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
                var tokens = queryString.split(",");
                latitude = parseFloat(tokens[0]);
                longitude = parseFloat(tokens[1]);
                thisGoToBox.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
            } else {
                this.geocoder.lookup(queryString, function (geocoder, result) {
                    if (result.length > 0) {
                        latitude = parseFloat(result[0].lat);
                        longitude = parseFloat(result[0].lon);

                        WorldWind.Logger.log(
                            WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);

                        thisGoToBox.wwd.goTo(new WorldWind.Location(latitude, longitude));
                    }
                });
            }
        }
    };

    return GoToBox;
});