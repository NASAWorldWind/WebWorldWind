/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Matrix',
    'src/geom/Angle',
    'src/globe/Globe',
    'src/globe/EarthElevationModel',
    'src/geom/Plane',
    'src/geom/Vec3'
], function (Matrix, Angle, Globe, EarthElevationModel, Plane, Vec3) {
    "use strict";

    describe("Matrix Tests", function () {

        it("Should construct a matrix correctly", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            for (var i = 0; i < 16; i++) {
                expect(matrix[i]).toEqual(i);
            }
        });

        it("Matrix prototype", function () {
            var matrix = Matrix.prototype;
            for (var i = 0; i < 16; i++) {
                expect(matrix[i]).toEqual(0);
            }
        });

        it("Should create an identity Matrix", function () {
            var identity = Matrix.fromIdentity();

            for (var i = 0; i < 16; i++) {
                if (i % 5 == 0)
                    expect(identity[i]).toEqual(1);
                else
                    expect(identity[i]).toEqual(0);
            }
        });

        describe("Computes the principal axes of a point collection expressed in a typed array", function () {
            var axis1 = new Vec3(1, 0, 0), axis2 = new Vec3(0, 1, 0), axis3 = new Vec3(0, 0, 1);
            var points = new Float32Array(48);

            it("Computes axes correctly", function () {
                for (var i = 4; i < 48; i++) {
                    points[i] = i * 1000 * Math.PI;
                }
                Matrix.principalAxesFromPoints(points, axis1, axis2, axis3);

                expect(axis1[0]).toBeCloseTo(0.580, 2);
                expect(axis1[1]).toBeCloseTo(0.573, 2);
                expect(axis1[2]).toBeCloseTo(0.577, 2);
                expect(axis2[0]).toBeCloseTo(-0.805, 2);
                expect(axis2[1]).toBeCloseTo(0.303, 2);
                expect(axis2[2]).toBeCloseTo(0.508, 2);
                expect(axis3[0]).toBeCloseTo(0.116, 2);
                expect(axis3[1]).toBeCloseTo(-0.760, 2);
                expect(axis3[2]).toBeCloseTo(0.638, 2);
            });

            it("Should throw an exception on missing points", function () {
                expect(function () {
                    Matrix.principalAxesFromPoints(null, axis1, axis2, axis3);
                }).toThrow();
            });

            it("Should throw an exception on missing axis 1", function () {
                expect(function () {
                    Matrix.principalAxesFromPoints(points, null, axis2, axis3);
                }).toThrow();
            });

            it("Should throw an exception on missing axis 2", function () {
                expect(function () {
                    Matrix.principalAxesFromPoints(points, axis1, null, axis3);
                }).toThrow();
            });

            it("Should throw an exception on missing axis 3", function () {
                expect(function () {
                    Matrix.principalAxesFromPoints(points, axis1, axis2, null);
                }).toThrow();
            });
        });

        it("Sets the components of a matrix to specified values", function () {
            var matrix = new Matrix.fromIdentity();
            matrix.set(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            for (var i = 0; i < 16; i++) {
                expect(matrix[i]).toEqual(i);
            }
        });

        it("Sets a matrix to the identity one", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.setToIdentity();
            for (var i = 0; i < 16; i++) {
                if (i % 5 == 0)
                    expect(matrix[i]).toEqual(1);
                else
                    expect(matrix[i]).toEqual(0);
            }
        });

        describe("Copies the components of a specified matrix to this matrix", function () {

            it("Copies successfully", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(15, 14, 13, 12, 11, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

                matrixB.copy(matrixA);
                expect(matrixB).toEqual(matrixA);
            });

            it("Should throw an exception on missing target matrix", function () {
                expect(function () {
                    var matrix = Matrix.fromIdentity();
                    matrix.copy(null);
                }).toThrow();
            });
        });

        describe("Indicates whether the components of two matrices are equal", function () {

            it("Equal matrices", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                expect(matrixA.equals(matrixB)).toBe(true);
            });

            it("Not equal matrices", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(15, 14, 13, 12, 11, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                expect(matrixA.equals(matrixB)).toBe(false);
            });
        });

        describe("Stores this matrix's components in column-major order in a specified array", function () {

            it("Equal matrices", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var result = new Array(16);
                matrix.columnMajorComponents(result);

                expect(result).toEqual([0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15]);
            });

            it("Should throw an exception on missing result", function () {
                expect(function () {
                    var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    matrix.columnMajorComponents(null);
                }).toThrow();
            });
        });

        it("Sets a matrix to a translation matrix with specified components", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.setToTranslation(2, 4, 6);
            expect(matrix[0]).toEqual(1);
            expect(matrix[1]).toEqual(0);
            expect(matrix[2]).toEqual(0);
            expect(matrix[3]).toEqual(2);
            expect(matrix[4]).toEqual(0);
            expect(matrix[5]).toEqual(1);
            expect(matrix[6]).toEqual(0);
            expect(matrix[7]).toEqual(4);
            expect(matrix[8]).toEqual(0);
            expect(matrix[9]).toEqual(0);
            expect(matrix[10]).toEqual(1);
            expect(matrix[11]).toEqual(6);
            expect(matrix[12]).toEqual(0);
            expect(matrix[13]).toEqual(0);
            expect(matrix[14]).toEqual(0);
            expect(matrix[15]).toEqual(1);
        });

        it("Sets the translation components of a matrix to specified values", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.setTranslation(2, 4, 6);
            expect(matrix[3]).toEqual(2);
            expect(matrix[7]).toEqual(4);
            expect(matrix[11]).toEqual(6);
        });

        it("Sets this matrix to a scale matrix with specified scale components", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.setToScale(2, 4, 6);
            expect(matrix[0]).toEqual(2);
            expect(matrix[5]).toEqual(4);
            expect(matrix[10]).toEqual(6);

            expect(matrix[1]).toEqual(0);
            expect(matrix[2]).toEqual(0);
            expect(matrix[3]).toEqual(0);
            expect(matrix[4]).toEqual(0);
            expect(matrix[6]).toEqual(0);
            expect(matrix[7]).toEqual(0);
            expect(matrix[8]).toEqual(0);
            expect(matrix[9]).toEqual(0);
            expect(matrix[11]).toEqual(0);
            expect(matrix[12]).toEqual(0);
            expect(matrix[13]).toEqual(0);
            expect(matrix[14]).toEqual(0);
            expect(matrix[15]).toEqual(1);

        });

        it("Sets the scale components of a matrix to specified values", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.setScale(2, 4, 6);
            expect(matrix[0]).toEqual(2);
            expect(matrix[5]).toEqual(4);
            expect(matrix[10]).toEqual(6);
        });

        describe("Sets this matrix to the transpose of a specified matrix", function () {

            it("Set matrix to the transpose of the matrix", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0);

                matrixA.setToTransposeOfMatrix(matrixB);

                expect(matrixA[0]).toEqual(matrixB[0]);
                expect(matrixA[1]).toEqual(matrixB[4]);
                expect(matrixA[2]).toEqual(matrixB[8]);
                expect(matrixA[3]).toEqual(matrixB[12]);
                expect(matrixA[4]).toEqual(matrixB[1]);
                expect(matrixA[5]).toEqual(matrixB[5]);
                expect(matrixA[6]).toEqual(matrixB[9]);
                expect(matrixA[7]).toEqual(matrixB[13]);
                expect(matrixA[8]).toEqual(matrixB[2]);
                expect(matrixA[9]).toEqual(matrixB[6]);
                expect(matrixA[10]).toEqual(matrixB[10]);
                expect(matrixA[11]).toEqual(matrixB[14]);
                expect(matrixA[12]).toEqual(matrixB[3]);
                expect(matrixA[13]).toEqual(matrixB[7]);
                expect(matrixA[14]).toEqual(matrixB[11]);
                expect(matrixA[15]).toEqual(matrixB[15]);
            });

            it("Should throw an exception on missing target", function () {
                expect(function () {
                    var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    matrix.setToTransposeOfMatrix(null);
                }).toThrow();
            });
        });

        describe("Sets this matrix to the matrix product of two specified matrices", function () {

            it("Sets the matrix correctly", function () {
                var targetMatrix = Matrix.prototype;
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0);

                targetMatrix.setToMultiply(matrixA, matrixB);

                expect(targetMatrix[0]).toEqual(34);
                expect(targetMatrix[1]).toEqual(28);
                expect(targetMatrix[2]).toEqual(22);
                expect(targetMatrix[3]).toEqual(16);
                expect(targetMatrix[4]).toEqual(178);
                expect(targetMatrix[5]).toEqual(156);
                expect(targetMatrix[6]).toEqual(134);
                expect(targetMatrix[7]).toEqual(112);
                expect(targetMatrix[8]).toEqual(322);
                expect(targetMatrix[9]).toEqual(284);
                expect(targetMatrix[10]).toEqual(246);
                expect(targetMatrix[11]).toEqual(208);
                expect(targetMatrix[12]).toEqual(466);
                expect(targetMatrix[13]).toEqual(412);
                expect(targetMatrix[14]).toEqual(358);
                expect(targetMatrix[15]).toEqual(304);
            });

            describe("Exceptions", function () {

                it("Missing matrix A", function () {
                    expect(function () {
                        var targetMatrix = Matrix.prototype;
                        var matrixB = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        targetMatrix.setToMultiply(null, matrixB);
                    }).toThrow();
                });

                it("Missing matrix B", function () {
                    expect(function () {
                        var targetMatrix = Matrix.prototype;
                        var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        targetMatrix.setToMultiply(matrixA, null);
                    }).toThrow();
                });
            });
        });

        describe("Sets this matrix to the symmetric covariance Matrix computed from a point array", function () {

            it("Sets the matrix correctly", function () {
                var targetMatrix = Matrix.prototype;
                targetMatrix.setToCovarianceOfPoints([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);

                expect(targetMatrix[0]).toEqual(26.25);
                expect(targetMatrix[1]).toEqual(26.25);
                expect(targetMatrix[2]).toEqual(26.25);
                expect(targetMatrix[3]).toEqual(0);
                expect(targetMatrix[4]).toEqual(26.25);
                expect(targetMatrix[5]).toEqual(26.25);
                expect(targetMatrix[6]).toEqual(26.25);
                expect(targetMatrix[7]).toEqual(0);
                expect(targetMatrix[8]).toEqual(26.25);
                expect(targetMatrix[9]).toEqual(26.25);
                expect(targetMatrix[10]).toEqual(26.25);
                expect(targetMatrix[11]).toEqual(0);
                expect(targetMatrix[12]).toEqual(0);
                expect(targetMatrix[13]).toEqual(0);
                expect(targetMatrix[14]).toEqual(0);
                expect(targetMatrix[15]).toEqual(0);
            });

            it("Should throw an exception on missing points", function () {
                expect(function () {
                    var targetMatrix = Matrix.prototype;
                    targetMatrix.setToCovarianceOfPoints(null);
                }).toThrow();
            });

        });

        it("Multiplies this matrix by a translation matrix with specified translation values", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.multiplyByTranslation(2, 4, 6);
            expect(matrix[0]).toEqual(0);
            expect(matrix[1]).toEqual(1);
            expect(matrix[2]).toEqual(2);
            expect(matrix[3]).toEqual(19);
            expect(matrix[4]).toEqual(4);
            expect(matrix[5]).toEqual(5);
            expect(matrix[6]).toEqual(6);
            expect(matrix[7]).toEqual(71);
            expect(matrix[8]).toEqual(8);
            expect(matrix[9]).toEqual(9);
            expect(matrix[10]).toEqual(10);
            expect(matrix[11]).toEqual(123);
            expect(matrix[12]).toEqual(12);
            expect(matrix[13]).toEqual(13);
            expect(matrix[14]).toEqual(14);
            expect(matrix[15]).toEqual(175);
        });

        it("Multiplies this matrix by a rotation matrix about a specified axis and angle", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.multiplyByRotation(2, 4, 6, 90);
            expect(matrix[0]).toBeCloseTo(30);
            expect(matrix[1]).toBeCloseTo(68);
            expect(matrix[2]).toBeCloseTo(94);
            expect(matrix[3]).toBeCloseTo(3);
            expect(matrix[4]).toBeCloseTo(134);
            expect(matrix[5]).toBeCloseTo(244);
            expect(matrix[6]).toBeCloseTo(390);
            expect(matrix[7]).toBeCloseTo(7);
            expect(matrix[8]).toBeCloseTo(238);
            expect(matrix[9]).toBeCloseTo(420);
            expect(matrix[10]).toBeCloseTo(686);
            expect(matrix[11]).toBeCloseTo(11);
            expect(matrix[12]).toBeCloseTo(342);
            expect(matrix[13]).toBeCloseTo(596);
            expect(matrix[14]).toBeCloseTo(982);
            expect(matrix[15]).toBeCloseTo(15);
        });

        it("Multiplies this matrix by a scale matrix with specified values", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

            matrix.multiplyByScale(2, 4, 6);
            expect(matrix[0]).toEqual(0);
            expect(matrix[1]).toEqual(4);
            expect(matrix[2]).toEqual(12);
            expect(matrix[3]).toEqual(3);
            expect(matrix[4]).toEqual(8);
            expect(matrix[5]).toEqual(20);
            expect(matrix[6]).toEqual(36);
            expect(matrix[7]).toEqual(7);
            expect(matrix[8]).toEqual(16);
            expect(matrix[9]).toEqual(36);
            expect(matrix[10]).toEqual(60);
            expect(matrix[11]).toEqual(11);
            expect(matrix[12]).toEqual(24);
            expect(matrix[13]).toEqual(52);
            expect(matrix[14]).toEqual(84);
            expect(matrix[15]).toEqual(15);
        });

        it("Sets this matrix to one that flips and shifts the y-axis", function () {
            var matrix = Matrix.prototype;

            matrix.setToUnitYFlip();
            expect(matrix[0]).toEqual(1);
            expect(matrix[1]).toEqual(0);
            expect(matrix[2]).toEqual(0);
            expect(matrix[3]).toEqual(0);
            expect(matrix[4]).toEqual(0);
            expect(matrix[5]).toEqual(-1);
            expect(matrix[6]).toEqual(0);
            expect(matrix[7]).toEqual(1);
            expect(matrix[8]).toEqual(0);
            expect(matrix[9]).toEqual(0);
            expect(matrix[10]).toEqual(1);
            expect(matrix[11]).toEqual(0);
            expect(matrix[12]).toEqual(0);
            expect(matrix[13]).toEqual(0);
            expect(matrix[14]).toEqual(0);
            expect(matrix[15]).toEqual(1);
        });

        describe("Multiplies this matrix by a local coordinate system transform", function () {

            it("Multiplies the matrix correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var origin = new Vec3(37, 15, 10e2);
                var globe = new Globe(new EarthElevationModel());
                matrix.multiplyByLocalCoordinateTransform(origin, globe);

                expect(matrix[0]).toBeCloseTo(-0.073);
                expect(matrix[1]).toBeCloseTo(0.969);
                expect(matrix[2]).toBeCloseTo(2.013);
                expect(matrix[3]).toBeCloseTo(2018);
                expect(matrix[4]).toBeCloseTo(3.775);
                expect(matrix[5]).toBeCloseTo(4.906);
                expect(matrix[6]).toBeCloseTo(6.218);
                expect(matrix[7]).toBeCloseTo(6230);
                expect(matrix[8]).toBeCloseTo(7.624);
                expect(matrix[9]).toBeCloseTo(8.843);
                expect(matrix[10]).toBeCloseTo(10.423);
                expect(matrix[11]).toBeCloseTo(10442);
                expect(matrix[12]).toBeCloseTo(11.474);
                expect(matrix[13]).toBeCloseTo(12.780);
                expect(matrix[14]).toBeCloseTo(14.628);
                expect(matrix[15]).toBeCloseTo(14654);
            });

            describe("Exceptions", function () {

                it("Missing origin", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var globe = new Globe(new EarthElevationModel());

                        matrix.multiplyByLocalCoordinateTransform(null, globe);
                    }).toThrow();
                });

                it("Missing globe", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var origin = new Vec3(37, 15, 10e2);
                        matrix.multiplyByLocalCoordinateTransform(origin, null);
                    }).toThrow();
                });
            });
        });

        describe("Multiplies this matrix by a texture transform for the specified texture", function () {

            it("Multiplies the matrix correctly", function () {
                var targetMatrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var texture = {
                    originalImageWidth: 500,
                    imageWidth: 100,
                    originalImageHeight: 550,
                    imageHeight: 50
                };

                targetMatrix.multiplyByTextureTransform(texture);

                expect(targetMatrix[0]).toEqual(0);
                expect(targetMatrix[1]).toEqual(-11);
                expect(targetMatrix[2]).toEqual(2);
                expect(targetMatrix[3]).toEqual(14);
                expect(targetMatrix[4]).toEqual(20);
                expect(targetMatrix[5]).toEqual(-55);
                expect(targetMatrix[6]).toEqual(6);
                expect(targetMatrix[7]).toEqual(62);
                expect(targetMatrix[8]).toEqual(40);
                expect(targetMatrix[9]).toEqual(-99);
                expect(targetMatrix[10]).toEqual(10);
                expect(targetMatrix[11]).toEqual(110);
                expect(targetMatrix[12]).toEqual(60);
                expect(targetMatrix[13]).toEqual(-143);
                expect(targetMatrix[14]).toEqual(14);
                expect(targetMatrix[15]).toEqual(158);
            });

            it("Should throw an exception on missing texture", function () {
                expect(function () {
                    var targetMatrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    targetMatrix.multiplyByTextureTransform(null);
                }).toThrow();
            });

        });

        describe("Returns the rotation angles of this matrix", function () {

            it("Multiplies the matrix correctly", function () {
                var targetMatrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var result = Vec3.ZERO;

                targetMatrix.extractRotationAngles(result);

                expect(result[0]).toBeCloseTo(30.963);
                expect(result[1]).toBeCloseTo(-63.434);
                expect(result[2]).toBeCloseTo(116.565);
            });

            it("Should throw an exception on missing result", function () {
                expect(function () {
                    var targetMatrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    targetMatrix.extractRotationAngles(null);
                }).toThrow();
            });
        });

        describe("Multiplies this matrix by a first person viewing matrix for the specified globe", function () {

            it("Multiplies the matrix correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var position = {latitude: 37, longitude: 15, altitude: 3e10};
                var heading = 20;
                var tilt = 40;
                var roll = 60;
                var globe = new Globe(new EarthElevationModel());
                matrix.multiplyByFirstPersonModelview(position, heading, tilt, roll, globe);

                expect(matrix[0]).toBeCloseTo(-0.615);
                expect(matrix[1]).toBeCloseTo(0.680);
                expect(matrix[2]).toBeCloseTo(2.039);
                expect(matrix[3]).toBeCloseTo(-55669512258.133);
                expect(matrix[4]).toBeCloseTo(-0.370);
                expect(matrix[5]).toBeCloseTo(6.262);
                expect(matrix[6]).toBeCloseTo(6.134);
                expect(matrix[7]).toBeCloseTo(-252807751836.434);
                expect(matrix[8]).toBeCloseTo(-0.126);
                expect(matrix[9]).toBeCloseTo(11.845);
                expect(matrix[10]).toBeCloseTo(10.230);
                expect(matrix[11]).toBeCloseTo(-449945991414.735);
                expect(matrix[12]).toBeCloseTo(0.118);
                expect(matrix[13]).toBeCloseTo(17.427);
                expect(matrix[14]).toBeCloseTo(14.326);
                expect(matrix[15]).toBeCloseTo(-647084230993.036);
            });

            describe("Exceptions", function () {

                it("Missing eye position", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var globe = new Globe(new EarthElevationModel());
                        var heading = 20;
                        var tilt = 40;
                        var roll = 60;
                        matrix.multiplyByFirstPersonModelview(null, heading, tilt, roll, globe);
                    }).toThrow();
                });

                it("Missing globe", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var position = {latitude: 37, longitude: 15, altitude: 3e10};
                        var heading = 20;
                        var tilt = 40;
                        var roll = 60;
                        matrix.multiplyByFirstPersonModelview(position, heading, tilt, roll, null);
                    }).toThrow();
                });
            });

            describe("Multiplies this matrix by a look at viewing matrix for the specified globe", function () {

                it("Multiplies the matrix correctly", function () {
                    var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    var position = {latitude: 37, longitude: 15, altitude: 3e10};
                    var range = 100;
                    var heading = 20;
                    var tilt = 40;
                    var roll = 60;
                    var globe = new Globe(new EarthElevationModel());
                    matrix.multiplyByLookAtModelview(position, range, heading, tilt, roll, globe);

                    expect(matrix[0]).toBeCloseTo(-0.615);
                    expect(matrix[1]).toBeCloseTo(0.680);
                    expect(matrix[2]).toBeCloseTo(2.039);
                    expect(matrix[3]).toBeCloseTo(-55669512458.133);
                    expect(matrix[4]).toBeCloseTo(-0.370);
                    expect(matrix[5]).toBeCloseTo(6.262);
                    expect(matrix[6]).toBeCloseTo(6.134);
                    expect(matrix[7]).toBeCloseTo(-252807752436.434);
                    expect(matrix[8]).toBeCloseTo(-0.126);
                    expect(matrix[9]).toBeCloseTo(11.845);
                    expect(matrix[10]).toBeCloseTo(10.230);
                    expect(matrix[11]).toBeCloseTo(-449945992414.735);
                    expect(matrix[12]).toBeCloseTo(0.118);
                    expect(matrix[13]).toBeCloseTo(17.427);
                    expect(matrix[14]).toBeCloseTo(14.326);
                    expect(matrix[15]).toBeCloseTo(-647084232393.036);
                });

                describe("Exceptions", function () {
                    it("Missing look-at-position", function () {
                        expect(function () {
                            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                            var globe = new Globe(new EarthElevationModel());
                            var range = 100;
                            var heading = 20;
                            var tilt = 40;
                            var roll = 60;
                            matrix.multiplyByLookAtModelview(null, range, heading, tilt, roll, globe);
                        }).toThrow();
                    });

                    it("Range less than 0", function () {
                        expect(function () {
                            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                            var position = {latitude: 37, longitude: 15, altitude: 3e10};
                            var range = -20;
                            var globe = new Globe(new EarthElevationModel());
                            var heading = 20;
                            var tilt = 40;
                            var roll = 60;
                            matrix.multiplyByLookAtModelview(position, range, heading, tilt, roll, globe);
                        }).toThrow();
                    });

                    it("Missing globe", function () {
                        expect(function () {
                            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                            var position = {latitude: 37, longitude: 15, altitude: 3e10};
                            var range = 100;
                            var heading = 20;
                            var tilt = 40;
                            var roll = 60;
                            matrix.multiplyByLookAtModelview(position, range, heading, tilt, roll, null);
                        }).toThrow();
                    });
                });
            });


        });

        describe("Multiplies this matrix by a look at viewing matrix for the specified globe", function () {

            it("Multiplies the matrix correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var position = {latitude: 37, longitude: 15, altitude: 3e10};
                var range = 100;
                var heading = 20;
                var tilt = 40;
                var roll = 60;
                var globe = new Globe(new EarthElevationModel());
                matrix.multiplyByLookAtModelview(position, range, heading, tilt, roll, globe);

                expect(matrix[0]).toBeCloseTo(-0.615);
                expect(matrix[1]).toBeCloseTo(0.680);
                expect(matrix[2]).toBeCloseTo(2.039);
                expect(matrix[3]).toBeCloseTo(-55669512458.133);
                expect(matrix[4]).toBeCloseTo(-0.370);
                expect(matrix[5]).toBeCloseTo(6.262);
                expect(matrix[6]).toBeCloseTo(6.134);
                expect(matrix[7]).toBeCloseTo(-252807752436.434);
                expect(matrix[8]).toBeCloseTo(-0.126);
                expect(matrix[9]).toBeCloseTo(11.845);
                expect(matrix[10]).toBeCloseTo(10.230);
                expect(matrix[11]).toBeCloseTo(-449945992414.735);
                expect(matrix[12]).toBeCloseTo(0.118);
                expect(matrix[13]).toBeCloseTo(17.427);
                expect(matrix[14]).toBeCloseTo(14.326);
                expect(matrix[15]).toBeCloseTo(-647084232393.036);
            });

            describe("Exceptions", function () {

                it("Missing look-at-position", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var globe = new Globe(new EarthElevationModel());
                        var range = 100;
                        var heading = 20;
                        var tilt = 40;
                        var roll = 60;
                        matrix.multiplyByLookAtModelview(null, range, heading, tilt, roll, globe);
                    }).toThrow();
                });

                it("Range less than 0", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var position = {latitude: 37, longitude: 15, altitude: 3e10};
                        var range = -20;
                        var globe = new Globe(new EarthElevationModel());
                        var heading = 20;
                        var tilt = 40;
                        var roll = 60;
                        matrix.multiplyByLookAtModelview(position, range, heading, tilt, roll, globe);
                    }).toThrow();
                });

                it("Missing globe", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var position = {latitude: 37, longitude: 15, altitude: 3e10};
                        var range = 100;
                        var heading = 20;
                        var tilt = 40;
                        var roll = 60;
                        matrix.multiplyByLookAtModelview(position, range, heading, tilt, roll, null);
                    }).toThrow();
                });
            });

        });

        describe("Sets this matrix to a perspective projection matrix", function () {

            it("Sets the matrix correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var viewportWidth = 500;
                var viewportHeight = 400;
                var nearDistance = 120;
                var farDistance = 600;
                matrix.setToPerspectiveProjection(viewportWidth, viewportHeight, nearDistance, farDistance);

                expect(matrix[0]).toEqual(2);
                expect(matrix[1]).toEqual(0);
                expect(matrix[2]).toEqual(0);
                expect(matrix[3]).toEqual(0);
                expect(matrix[4]).toEqual(0);
                expect(matrix[5]).toEqual(2.5);
                expect(matrix[6]).toEqual(0);
                expect(matrix[7]).toEqual(0);
                expect(matrix[8]).toEqual(0);
                expect(matrix[9]).toEqual(0);
                expect(matrix[10]).toEqual(-1.5);
                expect(matrix[11]).toEqual(-300);
                expect(matrix[12]).toEqual(0);
                expect(matrix[13]).toEqual(0);
                expect(matrix[14]).toEqual(-1);
                expect(matrix[15]).toEqual(0);
            });

            describe("Exceptions", function () {

                it("Negative viewport width", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var viewportWidth = -500;
                        var viewportHeight = 400;
                        var nearDistance = 120;
                        var farDistance = 600;
                        matrix.setToPerspectiveProjection(viewportWidth, viewportHeight, nearDistance, farDistance);
                    }).toThrow();
                });

                it("Negative viewport height", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var viewportWidth = 500;
                        var viewportHeight = -400;
                        var nearDistance = 120;
                        var farDistance = 600;
                        matrix.setToPerspectiveProjection(viewportWidth, viewportHeight, nearDistance, farDistance);
                    }).toThrow();
                });

                it("Near distance equal to far distance", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var viewportWidth = 500;
                        var viewportHeight = 400;
                        var nearDistance = 120;
                        var farDistance = nearDistance;
                        matrix.setToPerspectiveProjection(viewportWidth, viewportHeight, nearDistance, farDistance);
                    }).toThrow();
                });

                it("Near distance negative", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var viewportWidth = 500;
                        var viewportHeight = 400;
                        var nearDistance = -120;
                        var farDistance = 600;
                        matrix.setToPerspectiveProjection(viewportWidth, viewportHeight, nearDistance, farDistance);
                    }).toThrow();
                });

                it("Far distance negative", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var viewportWidth = 500;
                        var viewportHeight = 400;
                        var nearDistance = 120;
                        var farDistance = -600;
                        matrix.setToPerspectiveProjection(viewportWidth, viewportHeight, nearDistance, farDistance);
                    }).toThrow();
                });
            });

        });

        describe("Sets this matrix to a screen projection matrix", function () {

            it("Sets the matrix correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var viewportWidth = 500;
                var viewportHeight = 400;

                matrix.setToScreenProjection(viewportWidth, viewportHeight);

                expect(matrix[0]).toEqual(0.004);
                expect(matrix[1]).toEqual(0);
                expect(matrix[2]).toEqual(0);
                expect(matrix[3]).toEqual(-1);
                expect(matrix[4]).toEqual(0);
                expect(matrix[5]).toEqual(0.005);
                expect(matrix[6]).toEqual(0);
                expect(matrix[7]).toEqual(-1);
                expect(matrix[8]).toEqual(0);
                expect(matrix[9]).toEqual(0);
                expect(matrix[10]).toEqual(2);
                expect(matrix[11]).toEqual(-1);
                expect(matrix[12]).toEqual(0);
                expect(matrix[13]).toEqual(0);
                expect(matrix[14]).toEqual(0);
                expect(matrix[15]).toEqual(1);
            });

            describe("Exceptions", function () {

                it("Negative viewport width", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var viewportWidth = -500;
                        var viewportHeight = 400;
                        matrix.setToScreenProjection(viewportWidth, viewportHeight);
                    }).toThrow();
                });

                it("Negative viewport height", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var viewportWidth = 500;
                        var viewportHeight = -400;
                        matrix.setToScreenProjection(viewportWidth, viewportHeight);
                    }).toThrow();
                });

            });

        });

        describe("Returns this viewing matrix's eye point", function () {

            it("Returns the eye point correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var result = Vec3.ZERO;
                matrix.extractEyePoint(result);

                expect(result).toEqual(new Vec3(-116, -137, -158));
            });

            it("Missing result", function () {
                expect(function () {
                    var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    var result = null;
                    matrix.extractEyePoint(result);
                }).toThrow();
            });
        });

        describe("Returns this viewing matrix's forward vector", function () {

            it("Returns the vector correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var result = Vec3.ZERO;
                matrix.extractForwardVector(result);

                expect(result).toEqual(new Vec3(-8, -9, -10));
            });

            it("Missing result", function () {
                expect(function () {
                    var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    var result = null;
                    matrix.extractForwardVector(result);
                }).toThrow();
            });
        });

        describe("Extracts this viewing matrix's parameters given a viewing origin and a globe", function () {

            it("Extracts the parameters correctly", function () {
                var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var origin = new Vec3(2, 4, 6);
                var roll = 60;
                var globe = new Globe(new EarthElevationModel());
                var result = {};

                matrix.extractViewingParameters(origin, roll, globe, result);

                expect(result.origin.latitude).toBeCloseTo(89.991);
                expect(result.origin.longitude).toBeCloseTo(18.434);
                expect(result.origin.altitude).toBeCloseTo(-6356748.313);
                expect(result.range).toEqual(-123);
                expect(result.heading).toBeCloseTo(165.563);
                expect(result.tilt).toBeCloseTo(30.496);
                expect(result.roll).toEqual(60);
            });

            describe("Exceptions", function () {

                it("Missing origin", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var origin = null;
                        var roll = 60;
                        var globe = new Globe(new EarthElevationModel());
                        var result = {};

                        matrix.extractViewingParameters(origin, roll, globe, result);
                    }).toThrow();
                });

                it("Missing globe", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var origin = new Vec3(2, 4, 6);
                        var roll = 60;
                        var globe = null;
                        var result = {};

                        matrix.extractViewingParameters(origin, roll, globe, result);
                    }).toThrow();
                });

                it("Missing result", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var origin = new Vec3(2, 4, 6);
                        var roll = 60;
                        var globe = new Globe(new EarthElevationModel());
                        var result = null;
                        matrix.extractViewingParameters(origin, roll, globe, result);
                    }).toThrow();
                });

            });

        });

        it("Applies a specified depth offset to this projection matrix", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
            var depthOffset = 15;
            matrix.offsetProjectionDepth(depthOffset);

            expect(matrix[0]).toEqual(0);
            expect(matrix[1]).toEqual(1);
            expect(matrix[2]).toEqual(2);
            expect(matrix[3]).toEqual(3);
            expect(matrix[4]).toEqual(4);
            expect(matrix[5]).toEqual(5);
            expect(matrix[6]).toEqual(6);
            expect(matrix[7]).toEqual(7);
            expect(matrix[8]).toEqual(8);
            expect(matrix[9]).toEqual(9);
            expect(matrix[10]).toEqual(160);
            expect(matrix[11]).toEqual(11);
            expect(matrix[12]).toEqual(12);
            expect(matrix[13]).toEqual(13);
            expect(matrix[14]).toEqual(14);
            expect(matrix[15]).toEqual(15);
        });

        describe("Multiplies this matrix by a specified matrix", function () {

            it("Multiplies the matrix", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31);
                matrixA.multiplyMatrix(matrixB);

                expect(matrixA[0]).toEqual(152);
                expect(matrixA[1]).toEqual(158);
                expect(matrixA[2]).toEqual(164);
                expect(matrixA[3]).toEqual(170);
                expect(matrixA[4]).toEqual(504);
                expect(matrixA[5]).toEqual(526);
                expect(matrixA[6]).toEqual(548);
                expect(matrixA[7]).toEqual(570);
                expect(matrixA[8]).toEqual(856);
                expect(matrixA[9]).toEqual(894);
                expect(matrixA[10]).toEqual(932);
                expect(matrixA[11]).toEqual(970);
                expect(matrixA[12]).toEqual(1208);
                expect(matrixA[13]).toEqual(1262);
                expect(matrixA[14]).toEqual(1316);
                expect(matrixA[15]).toEqual(1370);
            });

            it("Missing multiplier matrix", function () {
                expect(function () {
                    var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    var matrixB = null;
                    matrixA.multiplyMatrix(matrixB);
                }).toThrow();
            });
        });

        it("Multiplies this matrix by a matrix specified by individual components", function () {
            var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
            matrix.multiply(16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31);

            expect(matrix[0]).toEqual(152);
            expect(matrix[1]).toEqual(158);
            expect(matrix[2]).toEqual(164);
            expect(matrix[3]).toEqual(170);
            expect(matrix[4]).toEqual(504);
            expect(matrix[5]).toEqual(526);
            expect(matrix[6]).toEqual(548);
            expect(matrix[7]).toEqual(570);
            expect(matrix[8]).toEqual(856);
            expect(matrix[9]).toEqual(894);
            expect(matrix[10]).toEqual(932);
            expect(matrix[11]).toEqual(970);
            expect(matrix[12]).toEqual(1208);
            expect(matrix[13]).toEqual(1262);
            expect(matrix[14]).toEqual(1316);
            expect(matrix[15]).toEqual(1370);
        });

        describe("Inverts the specified matrix and stores the result in this matrix", function () {

            it("Multiplies the matrix", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31);
                matrixA.invertMatrix(matrixB);

                expect(matrixA[0]).toEqual(0);
                expect(matrixA[1]).toEqual(1);
                expect(matrixA[2]).toEqual(2);
                expect(matrixA[3]).toEqual(3);
                expect(matrixA[4]).toEqual(4);
                expect(matrixA[5]).toEqual(5);
                expect(matrixA[6]).toEqual(6);
                expect(matrixA[7]).toEqual(7);
                expect(matrixA[8]).toEqual(8);
                expect(matrixA[9]).toEqual(9);
                expect(matrixA[10]).toEqual(10);
                expect(matrixA[11]).toEqual(11);
                expect(matrixA[12]).toEqual(12);
                expect(matrixA[13]).toEqual(13);
                expect(matrixA[14]).toEqual(14);
                expect(matrixA[15]).toEqual(15);
            });

            it("Should return null on singular matrix", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(16, 2, 3, 13, 5, 11, 10, 8, 9, 7, 6, 12, 4, 14, 15, 1);
                var result = matrixA.invertMatrix(matrixB);
                expect(result).toEqual(null);
            });

            it("Missing multiplier matrix", function () {
                expect(function () {
                    var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    var matrixB = null;
                    matrixA.invertMatrix(matrixB);
                }).toThrow();
            });
        });

        describe("Inverts an orthonormal matrix and stores the result in this matrix", function () {

            it("Multiplies the matrix", function () {
                var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                var matrixB = new Matrix(16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31);
                matrixA.invertOrthonormalMatrix(matrixB);

                expect(matrixA[0]).toEqual(16);
                expect(matrixA[1]).toEqual(20);
                expect(matrixA[2]).toEqual(24);
                expect(matrixA[3]).toEqual(-1412);
                expect(matrixA[4]).toEqual(17);
                expect(matrixA[5]).toEqual(21);
                expect(matrixA[6]).toEqual(25);
                expect(matrixA[7]).toEqual(-1481);
                expect(matrixA[8]).toEqual(18);
                expect(matrixA[9]).toEqual(22);
                expect(matrixA[10]).toEqual(26);
                expect(matrixA[11]).toEqual(-1550);
                expect(matrixA[12]).toEqual(0);
                expect(matrixA[13]).toEqual(0);
                expect(matrixA[14]).toEqual(0);
                expect(matrixA[15]).toEqual(1);
            });

            it("Missing multiplier matrix", function () {
                expect(function () {
                    var matrixA = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                    var matrixB = null;
                    matrixA.invertOrthonormalMatrix(matrixB);
                }).toThrow();
            });
        });

        describe("Computes the eigenvectors of this matrix", function () {

            it("Extracts the parameters correctly", function () {
                var matrix = new Matrix(1, 2, 3, 4, 2, 5, 6, 7, 3, 6, 8, 9, 4, 7, 9, 10);
                var result1 = new Vec3(0, 0, 0);
                var result2 = new Vec3(0, 0, 0);
                var result3 = new Vec3(0, 0, 0);

                matrix.eigensystemFromSymmetricMatrix(result1, result2, result3);

                expect(result1[0]).toBeCloseTo(3.733);
                expect(result1[1]).toBeCloseTo(8.054);
                expect(result1[2]).toBeCloseTo(10.438);
                expect(result2[0]).toBeCloseTo(-0.210);
                expect(result2[1]).toBeCloseTo(0.354);
                expect(result2[2]).toBeCloseTo(-0.197);
                expect(result3[0]).toBeCloseTo(-0.134);
                expect(result3[1]).toBeCloseTo(-0.037);
                expect(result3[2]).toBeCloseTo(0.076);
            });

            describe("Exceptions", function () {

                it("Matrix not symmetric", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var result1 = new Vec3(0, 0, 0);
                        var result2 = new Vec3(0, 0, 0);
                        var result3 = new Vec3(0, 0, 0);
                        matrix.eigensystemFromSymmetricMatrix(result1, result2, result3);
                    }).toThrow();
                });

                it("Missing result1", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var result1 = null;
                        var result2 = new Vec3(0, 0, 0);
                        var result3 = new Vec3(0, 0, 0);
                        matrix.eigensystemFromSymmetricMatrix(result1, result2, result3);
                    }).toThrow();
                });

                it("Missing result2", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var result1 = new Vec3(0, 0, 0);
                        var result2 = null;
                        var result3 = new Vec3(0, 0, 0);
                        matrix.eigensystemFromSymmetricMatrix(result1, result2, result3);
                    }).toThrow();
                });

                it("Missing result3", function () {
                    expect(function () {
                        var matrix = new Matrix(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
                        var result1 = new Vec3(0, 0, 0);
                        var result2 = new Vec3(0, 0, 0);
                        var result3 = null;
                        matrix.eigensystemFromSymmetricMatrix(result1, result2, result3);
                    }).toThrow();
                });
            });
        });

        it("Extracts and returns a new upper-3x3 matrix", function () {
            var matrix = new Matrix(1, 2, 3, 4, 2, 5, 6, 7, 3, 6, 8, 9, 4, 7, 9, 10);

            matrix.upper3By3();

            expect(matrix[0]).toEqual(1);
            expect(matrix[1]).toEqual(2);
            expect(matrix[2]).toEqual(3);
            expect(matrix[3]).toEqual(4);
            expect(matrix[4]).toEqual(2);
            expect(matrix[5]).toEqual(5);
            expect(matrix[6]).toEqual(6);
            expect(matrix[7]).toEqual(7);
            expect(matrix[8]).toEqual(3);
            expect(matrix[9]).toEqual(6);
            expect(matrix[10]).toEqual(8);
            expect(matrix[11]).toEqual(9);
            expect(matrix[12]).toEqual(4);
            expect(matrix[13]).toEqual(7);
            expect(matrix[14]).toEqual(9);
            expect(matrix[15]).toEqual(10);
        });
    });
});
