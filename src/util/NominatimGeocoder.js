/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports NominatimGeocoder
 * @version $Id: NominatimGeocoder.js 3133 2015-06-02 16:48:25Z tgaskins $
 */
define([
        '../util/Logger'
    ],
    function (Logger) {
        "use strict";

        /**
         * Constructs a Nominatim geocoder.
         * @alias NominatimGeocoder
         * @constructor
         * @classdesc Provides a gazetteer that uses Open Street Map Nominatim geocoder at Mapquest.
         */
        var NominatimGeocoder = function () {
            /**
             * The URL of the geocoder service.
             * @type {String}
             * @default http://open.mapquestapi.com/nominatim/v1/search/
             */
            this.service = "http://open.mapquestapi.com/nominatim/v1/search/";
        };

        /**
         * Queries the geocoder service with a specified query string.
         * @param {String} queryString The query string.
         * @param {Function} callback The function to call when the service returns the query results. This
         * function is passed two arguments: this geocoder and an array containing the query results. See
         * [the OpenStreetMap Nominatim Wiki] {@link http://wiki.openstreetmap.org/wiki/Nominatim} for a description
         * of the results. The result passed to the callback is parsed JSON.
         */
        NominatimGeocoder.prototype.lookup = function (queryString, callback) {
            var url = this.service + queryString.replace(" ", "%20") + "?format=json",
                xhr = new XMLHttpRequest(),
                thisGeocoder = this;

            xhr.open("GET", url, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var results = JSON.parse(xhr.responseText);

                    callback(thisGeocoder, results);
                }
            };

            xhr.send(null);
        };

        return NominatimGeocoder;
    });