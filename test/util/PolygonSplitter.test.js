/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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