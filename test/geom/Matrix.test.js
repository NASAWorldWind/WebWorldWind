/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Matrix',
    'src/geom/Vec3'
], function (Matrix,
             Vec3) {
    "use strict";

    describe("Matrix", function () {
        describe('#equalsWithPrecision', function () {
            it('equals when the matrices are the same except for one of them having better precision', function () {
                var matrix1 = new Matrix(
                    0.002, 0.0019, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0
                );
                var matrix2 = new Matrix(
                    0.0024, 0.002, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0
                );

                expect(matrix1.equalsWithPrecision(matrix2, 3)).toBe(true);
            });
        });

        describe('#extractEyePoint', function () {
            it('correctly extracts the eye point.', function () {
                var matrix = matrixUnderTest();

                var result = new Vec3();
                var expected = new Vec3(-1712.0, -1784.0, -1856.0);
                matrix.extractEyePoint(result);

                expect(expected.equals(result)).toBe(true);
            });
        });

        describe('#extractForwardVector', function(){
            it('correctly extracts the forward vector', function(){
                var matrix = matrixUnderTest();

                var result = new Vec3();
                var expected = new Vec3(-31.0, -32.0, -33.0);
                matrix.extractForwardVector(result);

                expect(expected.equals(result)).toBe(true);
            });
        });

        describe('#invertOrthonormalMatrix', function(){
            it('correctly counts orthonormal matrix, when such exists.', function(){
                var matrix = Matrix.fromIdentity();
                var orthonormalTranslation = new Matrix(
                    0.5, 0.866025, 0.0, 2.0,
                    0.866025, -0.5, 0.0, 3.0,
                    0.0, 0.0, 1.0, 5.0,
                    0.0, 0.0, 0.0, 1.0);
                var expected = new Matrix(
                    0.5, 0.866025, 0.0, -3.598075,
                    0.866025, -0.5, 0.0, -0.2320500000000001,
                    0.0, 0.0, 1.0, -5.0,
                    0.0, 0.0, 0.0, 1.0
                );

                var result = matrix.invertOrthonormal(orthonormalTranslation);
                expect(expected.equals(result)).toBe(true);
            });

            it('correctly transforms example matrix from camera to lookAt', function(){
                var matrix = new Matrix(
                    0.97130427063354, 0.23620624315079436, 0.027832077637773192, 547587.1239615995,
                    -0.2365642216731213, 0.9715611188002498, 0.010313169241199488, 1100422.1959130284,
                    -0.024604529526848273, -0.01660129911166929, 0.999559409937482, 6258949.467199742,
                    0.0, 0.0, 0.0, 1.0
                );
                var expected = new Matrix(
                    0.97130427063354, -0.2365642216731213, -0.024604529526848273, -117554.68478707943,
                    0.23620624315079436, 0.9715611188002498, -0.01660129911166929, -1094564.2249328012,
                    0.027832077637773192, 0.010313169241199488, 0.999559409937482, -6282781.16395346,
                    0.0, 0.0, 0.0, 1.0
                );
                var result = matrix.invertOrthonormal(matrix);

                expect(expected.equals(result)).toBe(true);
            });
        });

        function matrixUnderTest() {
            return new Matrix(
                11, 12, 13, 14,
                21, 22, 23, 24,
                31, 32, 33, 34,
                41, 42, 43, 44
            )
        }
    });
});