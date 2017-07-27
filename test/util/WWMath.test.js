/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

define([
        'src/util/WWMath'
    ],
    function (WWMath) {
        'use strict';

        describe('WWMath test', function () {

            describe('normalizeAngle360 test', function () {

                it('Normalize an angle to be between [0, 360)', function () {
                    var angles = [0, -10, 360, 1000];
                    var expectedAngles = [0, 350, 0, 280];
                    var computedAngles = angles.map(function (angle) {
                        return WWMath.normalizeAngle360(angle);
                    });
                    expectedAngles.forEach(function (expectedResult, i) {
                        expect(expectedResult).toBeCloseTo(computedAngles[i]);
                    });
                });

            });

            describe('#toRadians', function() {
                it('returns correct radians', function(){
                    var radians = WWMath.toRadians(90);
                    expect(radians).toBe(1.5707963267948966);
                });
            });

            describe('#toDegrees', function() {
                it('returns correct degrees', function() {
                    var degrees = WWMath.toDegrees(1.5707963267948966);
                    expect(degrees).toBe(90);
                });
            });

        });
    });