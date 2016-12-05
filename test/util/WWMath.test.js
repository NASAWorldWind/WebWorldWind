/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/util/WWMath'
], function (WWMath) {
    describe ("WWMath", function () {
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
