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
 * @exports NominatimGeocoder
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
         * @classdesc Provides a gazetteer that uses the OpenStreetMap Nominatim geocoder.
         */
        var NominatimGeocoder = function () {
            /**
             * The URL of the geocoder service.
             * @type {String}
             * @default https://nominatim.openstreetmap.org/search
             */
            this.service = "https://nominatim.openstreetmap.org/search";
        };

        /**
         * Queries the geocoder service with a specified query string.
         * @param {String} queryString The query string.
         * @param {Function} callback The function to call when the service returns the query results. This
         * function is passed two arguments: this geocoder and an array containing the query results. See
         * [the OpenStreetMap Nominatim Wiki] {@link http://wiki.openstreetmap.org/wiki/Nominatim} for a description
         * of the results. The result passed to the callback is parsed JSON.
         * @param {String} accessKey An optional API access key for geocoder services that require one.
         */
        NominatimGeocoder.prototype.lookup = function (queryString, callback, accessKey) {
            var url = this.service + "?format=json&q=" + encodeURIComponent(queryString),
                xhr = new XMLHttpRequest(),
                thisGeocoder = this;

            if (accessKey) {
                url += "&key=" + encodeURIComponent(accessKey);
            }

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
