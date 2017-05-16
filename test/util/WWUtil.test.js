/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require([
    'src/util/WWUtil'
], function (
    WWUtil
) {
    "use strict";
    describe("WWUtil-arrayEquals", function() {
        if("testEqualArrays", function() {
            var array1 = [1,2,3];
            var array2 = [1,2,3];

            assertTrue(WWUtil.arrayEquals(array1, array2));
        });

        if("testDifferentArraysDifferentLength", function() {
            var array1 = [1,2,3];
            var array2 = [1,2,3,4];

            assertFalse(WWUtil.arrayEquals(array1, array2));
        });

        if("testDifferentArraysSameLength", function() {
            var array1 = [1,2,3];
            var array2 = [1,5,3];

            assertFalse(WWUtil.arrayEquals(array1, array2));
        });

        if("testObjectsWithEquals", function() {
            var array1 = [{equals: function(){return true}}];
            var array2 = [1];

            assertTrue(WWUtil.arrayEquals(array1, array2));
        });
    });

    describe("WWUtil-transformToBoolean", function() {
        if("testTransformToBoolean0", function() {
            expect(WWUtil.transformToBoolean(0)).toBe(false);
            expect(WWUtil.transformToBoolean("0")).toBe(false);
        });

        if("testTransformToBooleanFalse", function() {
            expect(WWUtil.transformToBoolean("false")).toBe(false);
            expect(WWUtil.transformToBoolean(false)).toBe(false);
        });

        if("testTransformToBooleanTrue", function() {
            expect(WWUtil.transformToBoolean(true)).toBe(true);
            expect(WWUtil.transformToBoolean("true")).toBe(true);
            expect(WWUtil.transformToBoolean("1")).toBe(true);
            expect(WWUtil.transformToBoolean(1)).toBe(true);
        });
    });

    describe('WWUtil', function(){
        describe('#endsWith', function(){
            it('recognizes correctly that string ends with given token', function(){
                var textToTry = 'someTextEndingWithTest';
                var searchString = 'Test';

                expect(WWUtil.endsWith(textToTry, searchString)).toBe(true);
            });

            it('recognizes correctly that string minus position ends with given token', function(){
                var textToTry = 'someTextEndingWithTestGarbage';
                var searchString = 'Text';

                expect(WWUtil.endsWith(textToTry, searchString, 8)).toBe(true);
            });

            it('recognizes correctly that string doesnt end with given token', function(){
                var textToTry = 'someTextEndingWithTest';
                var searchString = 'Random';

                expect(WWUtil.endsWith(textToTry, searchString)).toBe(false);
            });

            it('recognizes correctly that string minus position doesnt end with given token', function(){
                var textToTry = 'someTextEndingWithTestGarbage';
                var searchString = 'Random';

                expect(WWUtil.endsWith(textToTry, searchString, 7)).toBe(false);
            });
        });

        describe('#startsWith', function(){
            it('recognizes correctly that string starts with given token', function(){
                var textToTry = 'TestIsAtTheBeginning';
                var searchString = 'Test';

                expect(WWUtil.startsWith(textToTry, searchString)).toBe(true);
            });

            it('recognizes correctly that string minus position starts with given token', function(){
                var textToTry = 'GarbageTestIsAtTheBeginning';
                var searchString = 'Test';

                expect(WWUtil.startsWith(textToTry, searchString, 7)).toBe(true);
            });

            it('recognizes correctly that string doesnt start with given token', function(){
                var textToTry = 'TestIsAtTheBeginning';
                var searchString = 'Random';

                expect(WWUtil.startsWith(textToTry, searchString)).toBe(false);
            });

            it('recognizes correctly that string minus position doesnt start with given token', function(){
                var textToTry = 'GarbageTestIsAtTheBeginning';
                var searchString = 'Random';

                expect(WWUtil.startsWith(textToTry, searchString, 7)).toBe(false);
            });
        });
    })
});