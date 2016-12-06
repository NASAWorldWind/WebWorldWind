/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Matrix'
], function (Matrix) {
    "use strict";

    describe("Matrix", function() {
        describe('#equalsWithPrecision', function(){
            it('equals when the matrices are the same except for one of them having better precision', function(){
                var matrix1 = new Matrix(
                    0.002, 0.0019, 0, 0,
                    0,0,0,0,
                    0,0,0,0,
                    0,0,0,0
                );
                var matrix2 = new Matrix(
                    0.0024, 0.002, 0, 0,
                    0,0,0,0,
                    0,0,0,0,
                    0,0,0,0
                );

                expect(matrix1.equalsWithPrecision(matrix2, 3)).toBe(true);
            });

            it('returns false, when they differ on higher order', function(){

            });
        });
    });
});