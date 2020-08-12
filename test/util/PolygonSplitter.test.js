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
        'src/util/PolygonSplitter',
        './PolygonSplitterData.test'
    ],
    function (PolygonSplitter,
              PolygonSplitterData) {
        'use strict';

        describe('spilt polygons', function () {

            it('split a square like polygon', function () {
                var inputContours = PolygonSplitterData.simpleSquareInput;
                var expectedResult = PolygonSplitterData.simpleSquareOutput;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(true);
            });

            it('split a spiral like polygon', function () {
                var inputContours = PolygonSplitterData.spiralPolyInput;
                var expectedResult = PolygonSplitterData.spiralPolyOutput;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(true);
            });

            it('split a polygon over the globe ending in a concave polygon', function () {
                var inputContours = PolygonSplitterData.polygonOverTheGlobeInput;
                var expectedResult = PolygonSplitterData.polygonOverTheGlobeOutput;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(true);
            });

            it('splits a polygon that contains the south pole and intersects the anti-meridian', function(){
                var inputContours = PolygonSplitterData.polygonSouthPoleAndIntersectionInput;
                var expectedResult = PolygonSplitterData.polygonSouthPoleAndIntersectionOutput;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(true);
            });

            it('splits a polygon that contains the north pole and intersects the anti-meridian', function(){
                var inputContours = PolygonSplitterData.polygonNorthPoleAndIntersectionInput;
                var expectedResult = PolygonSplitterData.polygonNorthPoleAndIntersectionOutput;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(true);
            });

            it('split a polygon with a hole, the hole crosses the anti-meridian', function(){
                var inputContours = PolygonSplitterData.polygonHoleInput;
                var expectedResult = PolygonSplitterData.polygonHoleOutput;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(true);
            });

            it('split a polygon with a hole, the hole does not cross the anti-meridian', function(){
                var inputContours = PolygonSplitterData.polygonHole2Input;
                var expectedResult = PolygonSplitterData.polygonHole2Output;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(true);
            });

            it('doesn\'t split a full sphere sector', function() {
                var inputContours = PolygonSplitterData.fullSphereSectorInput;
                var expectedResult = PolygonSplitterData.fullSphereSectorOutput;
                var result = [];
                var doesCross = PolygonSplitter.splitContours(inputContours, result);
                expect(expectedResult).toEqual(result);
                expect(doesCross).toEqual(false);
            });

        });

    });