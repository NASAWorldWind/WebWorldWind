define([
        '../error/ArgumentError',
        '../shaders/GpuProgram',
        '../util/Logger'
    ],
    function (ArgumentError, GpuProgram, Logger) {
        "use strict";

        var SurfaceShapesSVProgram = function (gl) {
            var vertexShaderSource =
                    'attribute vec4 pos;\n' +
                    'uniform mat4 mvpMatrix;\n' +
                    'void main() {\n' +
                    '   gl_Position = mvpMatrix * pos;\n' +
                    '   if(gl_Position.z > gl_Position.w) {\n' +
                    '       gl_Position.z = gl_Position.w;\n' +
                    '   }\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +
                    'uniform vec4 color;\n' +
                    'void main() {gl_FragColor = color;}';

            // Call to the superclass, which performs shader program compiling and linking.
            GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource);

            this.posLocation = this.attributeLocation(gl, "pos");

            this.colorLocation = this.uniformLocation(gl, "color");

            this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");
        };

        SurfaceShapesSVProgram.key = "WorldWindGpuSurfaceShapesSVProgram";

        SurfaceShapesSVProgram.prototype = Object.create(GpuProgram.prototype);

        SurfaceShapesSVProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShapesSVProgram", "loadModelviewProjection",
                        "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        SurfaceShapesSVProgram.prototype.loadColor = function (gl, color) {
            if (!color) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShapesSVProgram", "loadColor", "missingColor"));
            }

            this.loadUniformColor(gl, color, this.colorLocation);
        };

        return SurfaceShapesSVProgram;
    });
