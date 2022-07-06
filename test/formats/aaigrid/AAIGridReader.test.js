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
define([
    'src/formats/aaigrid/AAIGridReader'
], function (AAIGridReader) {
    'use strict';

    describe('AAIGridReader parsing', function () {

        it('should parse a string data source with int values', function () {
            var dataSource =
                'ncols        5\n' +
                'nrows        5\n' +
                'xllcorner    10.000000000000\n' +
                'yllcorner    10.000000000000\n' +
                'cellsize     1.090909090909\n' +
                'NODATA_value -500\n' +
                ' 30 0 -500 -500 484 \n' +
                '40 782 133 -500 -500\n' +
                '-500 302 1027 -500 -500\n' +
                ' -500 -500 288 277 155\n' +
                '-500 -500 -500 -500 439 \n';

            var expectedValues = new Int16Array([
                30, 0, -500, -500, 484,
                40, 782, 133, -500, -500,
                -500, 302, 1027, -500, -500,
                -500, -500, 288, 277, 155,
                -500, -500, -500, -500, 439
            ]);

            var reader = new AAIGridReader(dataSource);

            expect(reader.metadata.ncols).toBe(5);
            expect(reader.metadata.nrows).toBe(5);
            expect(reader.metadata.xllcorner).toBe(10);
            expect(reader.metadata.yllcorner).toBe(10);
            expect(reader.metadata.cellsize).toBe(1.090909090909);
            expect(reader.metadata.NODATA_value).toBe(-500);
            expect(reader.getImageData() instanceof Int16Array).toBe(true);
            expect(reader.getImageData()).toEqual(expectedValues);
        });

        it('should parse a string data source with float values', function () {
            var dataSource =
                'ncols        5\n' +
                'nrows        5\n' +
                'xllcorner    10.000000000000\n' +
                'yllcorner    10.000000000000\n' +
                'cellsize     1.090909090909\n' +
                'NODATA_value -500\n' +
                ' 30 0 -500 -500 484.3 \n' +
                '40 782 133 -500 -500\n' +
                '-500 302 1027 -500 -500\n' +
                ' -500 -500 288.5 277 155\n' +
                '-500 -500 -500 -500 439 \n';

            var expectedValues = new Float32Array([
                30, 0, -500, -500, 484.3,
                40, 782, 133, -500, -500,
                -500, 302, 1027, -500, -500,
                -500, -500, 288.5, 277, 155,
                -500, -500, -500, -500, 439
            ]);

            var reader = new AAIGridReader(dataSource);

            expect(reader.metadata.ncols).toBe(5);
            expect(reader.metadata.nrows).toBe(5);
            expect(reader.metadata.xllcorner).toBe(10);
            expect(reader.metadata.yllcorner).toBe(10);
            expect(reader.metadata.cellsize).toBe(1.090909090909);
            expect(reader.metadata.NODATA_value).toBe(-500);
            expect(reader.getImageData() instanceof Float32Array).toBe(true);
            expect(reader.getImageData()).toEqual(expectedValues);
        });

        it('should parse an array buffer data source', function (done) {
            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                var reader = new AAIGridReader(this.response);
                var imageData = reader.getImageData();

                expect(reader.metadata.ncols).toBe(33);
                expect(reader.metadata.nrows).toBe(33);
                expect(reader.metadata.xllcorner).toBe(10);
                expect(reader.metadata.yllcorner).toBe(10);
                expect(reader.metadata.cellsize).toBe(1.090909090909);
                expect(reader.metadata.NODATA_value).toBe(undefined);
                expect('NODATA_value' in reader.metadata).toBe(true);
                expect(imageData instanceof Int16Array).toBe(true);
                expect(imageData.length).toBe(33 * 33);
                expect(imageData[0]).toBe(30);
                expect(imageData[33 * 33 - 1]).toBe(-500);

                done();
            };

            xhr.open('GET', '../base/test/formats/aaigrid/aaigrid-tile.asc', true);
            xhr.responseType = 'arraybuffer';

            xhr.send();
        });

    });

    describe('AAIGridReader retrieve from url', function () {

        it('should fetch and parse a file', function (done) {
            var url = '../base/test/formats/aaigrid/aaigrid-tile.asc';
            AAIGridReader.retrieveFromUrl(url, function (reader) {
                var imageData = reader.getImageData();

                expect(reader.metadata.ncols).toBe(33);
                expect(reader.metadata.nrows).toBe(33);
                expect(reader.metadata.xllcorner).toBe(10);
                expect(reader.metadata.yllcorner).toBe(10);
                expect(reader.metadata.cellsize).toBe(1.090909090909);
                expect(reader.metadata.NODATA_value).toBe(undefined);
                expect('NODATA_value' in reader.metadata).toBe(true);
                expect(imageData instanceof Int16Array).toBe(true);
                expect(imageData.length).toBe(33 * 33);
                expect(imageData[0]).toBe(30);
                expect(imageData[33 * 33 - 1]).toBe(-500);

                done();
            });
        });

    });
});