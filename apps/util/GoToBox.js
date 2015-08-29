/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GoToBox
 * @version $Id: GoToBox.js 3185 2015-06-12 19:12:09Z tgaskins $
 */
define(function () {
    "use strict";

    /**
     * Constructs a GoToBox.
     * @alias GoToBox
     * @constructor
     * @classdesc Provides a search box enabling the user to find and move to specified locations.
     * @param {WorldWindow} worldWindow The World Window to associate this GoToBox with.
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