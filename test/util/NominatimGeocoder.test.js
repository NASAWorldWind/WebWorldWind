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
 *    ES6-Promise - under MIT License
 *    libtess.js - SGI Free Software License B
 *    Proj4 - under MIT License
 *    JSZip - under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
require([
    'src/util/NominatimGeocoder'
], function (
    NominatimGeocoder
) {
    "use strict";

    describe("NominatimGeocoder", function () {
        it("builds a query URL with encoded input", function () {
            var geocoder = new NominatimGeocoder(),
                xhr = {
                    open: jasmine.createSpy("open"),
                    send: jasmine.createSpy("send")
                };

            spyOn(window, "XMLHttpRequest").and.returnValue(xhr);

            geocoder.lookup("Washington, DC", function () {
            });

            expect(xhr.open).toHaveBeenCalledWith(
                "GET",
                "https://nominatim.openstreetmap.org/search?format=json&q=Washington%2C%20DC",
                true
            );
            expect(xhr.send).toHaveBeenCalledWith(null);
        });

        it("passes results to callback after a successful response", function () {
            var geocoder = new NominatimGeocoder(),
                callback = jasmine.createSpy("callback"),
                xhr = {
                    open: jasmine.createSpy("open"),
                    send: jasmine.createSpy("send")
                };

            spyOn(window, "XMLHttpRequest").and.returnValue(xhr);

            geocoder.lookup("Madrid", callback, "key-123");

            expect(xhr.open).toHaveBeenCalledWith(
                "GET",
                "https://nominatim.openstreetmap.org/search?format=json&q=Madrid&key=key-123",
                true
            );

            xhr.readyState = 4;
            xhr.status = 200;
            xhr.responseText = '[{"lat":"40.4167","lon":"-3.7036"}]';
            xhr.onreadystatechange();

            expect(callback).toHaveBeenCalledWith(geocoder, [{lat: "40.4167", lon: "-3.7036"}]);
        });
    });
});
