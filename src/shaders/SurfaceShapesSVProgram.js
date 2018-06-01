define([
        '../error/ArgumentError',
        '../shaders/GpuProgram',
        '../util/Logger'
    ],
    function (ArgumentError, GpuProgram, Logger) {
        "use strict";

        var SurfaceShapesSVProgram = function (gl) {
            var vertexShaderSource =
                    'attribute vec3 pos;\n' +
                    'attribute vec3 prevPos;\n' +
                    'attribute vec3 nextPos;\n' +
                    'attribute float direction;\n' +
                    'uniform mat4 mvpMatrix;\n' +
                    'uniform float scaleSize;\n' +
                    'void main() {\n' +
                    '   vec3 tangent = normalize(nextPos - prevPos);\n' +
                    '   vec3 normPos = normalize(pos);\n' +
                    '   vec3 nadir = normalize(cross(tangent, normPos));\n' +
                    '   vec3 offset = normalize(cross(nadir, tangent));\n' +
                    '   normPos = pos + (offset * direction * scaleSize);\n' +
                    '   gl_Position = mvpMatrix * vec4(normPos, 1.0);\n' +
                    '   gl_Position.z = min(gl_Position.z, gl_Position.w);\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +
                    'uniform vec4 color;\n' +
                    'void main() {gl_FragColor = color;}';

            // Call to the superclass, which performs shader program compiling and linking.
            GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource);

            this.posLocation = this.attributeLocation(gl, "pos");

            this.prevPosLocation = this.attributeLocation(gl, "prevPos");

            this.nextPosLocation = this.attributeLocation(gl, "nextPos");

            this.directionLocation = this.attributeLocation(gl, "direction");

            // this.screenSizeLocation = this.uniformLocation(gl, "screenSize");

            this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

            this.scaleSizeLocation = this.uniformLocation(gl, "scaleSize");

            this.colorLocation = this.uniformLocation(gl, "color");
        };

        SurfaceShapesSVProgram.key = "WorldWindGpuSurfaceShapesSVProgram";

        SurfaceShapesSVProgram.prototype = Object.create(GpuProgram.prototype);

        SurfaceShapesSVProgram.prototype.loadScreenSize = function (gl, width, height) {
            if (!width) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShapesSVProgram", "loadScreenSize",
                        "missing width"));
            }

            if (!height) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShapesSVProgram", "loadScreenSize",
                        "missing height"));
            }

            gl.uniform2f(this.screenSizeLocation, width, height);
        };

        SurfaceShapesSVProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShapesSVProgram", "loadModelviewProjection",
                        "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        SurfaceShapesSVProgram.prototype.loadScaleSize = function (gl, scale) {
            gl.uniform1f(this.scaleSizeLocation, scale);
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
