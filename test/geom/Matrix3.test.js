/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Matrix3',
    'src/geom/Sector'
], function (Matrix3, Sector) {
    "use strict";

    describe("Matrix3 Tests", function () {

        it("Should construct a 3x3 matrix correctly", function () {
            var matrix = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);

            for (var i = 0; i < 9; i++) {
                expect(matrix[i]).toEqual(i);
            }
        });

        it("Matrix prototype", function () {
            var matrix = Matrix3.prototype;
            for (var i = 0; i < 9; i++) {
                expect(matrix[i]).toEqual(0);
            }
        });

        it("Should create an identity Matrix", function () {
            var identity = Matrix3.fromIdentity();

            expect(identity[0]).toEqual(1);
            expect(identity[1]).toEqual(0);
            expect(identity[2]).toEqual(0);
            expect(identity[3]).toEqual(0);
            expect(identity[4]).toEqual(1);
            expect(identity[5]).toEqual(0);
            expect(identity[6]).toEqual(0);
            expect(identity[7]).toEqual(0);
            expect(identity[8]).toEqual(1);
        });

        it("Sets this matrix to one that flips and shifts the y-axis", function () {
            var matrix = Matrix3.prototype;

            matrix.setToUnitYFlip();
            expect(matrix[0]).toEqual(1);
            expect(matrix[1]).toEqual(0);
            expect(matrix[2]).toEqual(0);
            expect(matrix[3]).toEqual(0);
            expect(matrix[4]).toEqual(-1);
            expect(matrix[5]).toEqual(1);
            expect(matrix[6]).toEqual(0);
            expect(matrix[7]).toEqual(0);
            expect(matrix[8]).toEqual(1);
        });

        describe("Multiplies this matrix by a specified matrix", function () {

            it("Multiplies the matrix", function () {
                var matrixA = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);
                var matrixB = new Matrix3(16, 17, 18, 19, 20, 21, 22, 23, 24);
                matrixA.multiplyMatrix(matrixB);

                expect(matrixA[0]).toEqual(63);
                expect(matrixA[1]).toEqual(66);
                expect(matrixA[2]).toEqual(69);
                expect(matrixA[3]).toEqual(234);
                expect(matrixA[4]).toEqual(246);
                expect(matrixA[5]).toEqual(258);
                expect(matrixA[6]).toEqual(405);
                expect(matrixA[7]).toEqual(426);
                expect(matrixA[8]).toEqual(447);
            });

            it("Missing multiplier matrix", function () {
                expect(function () {
                    var matrixA = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);
                    var matrixB = null;
                    matrixA.multiplyMatrix(matrixB);
                }).toThrow();
            });
        });

        it("Multiplies this matrix by a tile transformation", function () {
            var matrix = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);
            var source = new Sector(34, 37, 14, 15);
            var destination = new Sector(44, 47, 18, 19);
            matrix.multiplyByTileTransform(source,destination);

            expect(matrix[0]).toBeCloseTo(0);
            expect(matrix[1]).toBeCloseTo(1);
            expect(matrix[2]).toBeCloseTo(-1.333);
            expect(matrix[3]).toBeCloseTo(3);
            expect(matrix[4]).toBeCloseTo(4);
            expect(matrix[5]).toBeCloseTo(-20.333);
            expect(matrix[6]).toBeCloseTo(6);
            expect(matrix[7]).toBeCloseTo(7);
            expect(matrix[8]).toBeCloseTo(-36);
        });

        describe("Stores this matrix's components in column-major order in a specified array", function () {

            it("Multiplies the matrix", function () {
                var matrix = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);
                var result = new Float32Array(9);
                matrix.columnMajorComponents(result);

                expect(result[0]).toEqual(0);
                expect(result[1]).toEqual(3);
                expect(result[2]).toEqual(6);
                expect(result[3]).toEqual(1);
                expect(result[4]).toEqual(4);
                expect(result[5]).toEqual(7);
                expect(result[6]).toEqual(2);
                expect(result[7]).toEqual(5);
                expect(result[8]).toEqual(8);
            });

            it("Missing result", function () {
                expect(function () {
                    var matrixA = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);
                    var result = null;
                    matrixA.columnMajorComponents(result);
                }).toThrow();
            });
        });

        describe("Multiplies this matrix by a specified matrix", function () {

            it("Multiplies the matrix", function () {
                var matrixA = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);
                var matrixB = new Matrix3(16, 17, 18, 19, 20, 21, 22, 23, 24);
                matrixA.multiplyMatrix(matrixB);

                expect(matrixA[0]).toEqual(63);
                expect(matrixA[1]).toEqual(66);
                expect(matrixA[2]).toEqual(69);
                expect(matrixA[3]).toEqual(234);
                expect(matrixA[4]).toEqual(246);
                expect(matrixA[5]).toEqual(258);
                expect(matrixA[6]).toEqual(405);
                expect(matrixA[7]).toEqual(426);
                expect(matrixA[8]).toEqual(447);
            });

            it("Missing multiplier matrix", function () {
                expect(function () {
                    var matrixA = new Matrix3(0, 1, 2, 3, 4, 5, 6, 7, 8);
                    var matrixB = null;
                    matrixA.multiplyMatrix(matrixB);
                }).toThrow();
            });
        });

    });
});
