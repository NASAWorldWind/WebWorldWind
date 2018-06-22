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
define([
    'src/formats/geotiff/GeoTiffReader'
], function (GeoTiffReader) {
    "use strict";

    describe("GeoTiffReader RGB Parsing", function () {
        var geoTiff;

        beforeEach(function (done) {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/formats/geotiff/rgb-test.tif", true);
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        geoTiff = new GeoTiffReader(xhr.response);
                        done();
                    } else {
                        done("Test GeoTiff Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        it("Should retrieve the expected rgb values from the center of the image", function () {

            var canvas = geoTiff.getImage();
            var ctx = canvas.getContext('2d');
            var imgData = ctx.getImageData(50, 50, 1, 1);

            // Check canvas parameters match expected output
            expect(canvas.height).toBe(100);
            expect(canvas.width).toBe(100);

            // Check rgb values
            expect(imgData.data[0]).toBe(66);
            expect(imgData.data[1]).toBe(92);
            expect(imgData.data[2]).toBe(81);
        });

        it("Should retrieve the expected rgb values from the 25, 25 position of the image", function () {

            var canvas = geoTiff.getImage();
            var ctx = canvas.getContext('2d');
            var imgData = ctx.getImageData(25, 25, 1, 1);

            // Check canvas parameters match expected output
            expect(canvas.height).toBe(100);
            expect(canvas.width).toBe(100);

            // Check rgb values
            expect(imgData.data[0]).toBe(114);
            expect(imgData.data[1]).toBe(142);
            expect(imgData.data[2]).toBe(119);
        });
    });

    describe("GeoTiffReader Grayscale Parsing", function () {
        var geoTiff;

        beforeEach(function (done) {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/formats/geotiff/grayscale-test.tif", true);
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        geoTiff = new GeoTiffReader(xhr.response);
                        done();
                    } else {
                        done("Test GeoTiff Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        it("Should retrieve the expected elevation/single-band value from the center", function () {

            var elevationArray = geoTiff.getImageData();

            // Check the array parameters
            expect(elevationArray.length).toBe(100 * 100);

            // Check elevation value
            expect(elevationArray[50 * 100 + 50]).toBe(875);
        });

        it("Should retrieve the expected elevation/single-band value from the 25, 25 position", function () {

            var elevationArray = geoTiff.getImageData();

            // Check the array parameters
            expect(elevationArray.length).toBe(100 * 100);

            // Check elevation value
            expect(elevationArray[25 * 100 + 25]).toBe(2888);
        });
    });
});
