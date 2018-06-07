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
                'uniform vec3 eyePos;\n' +
                'uniform float pixelSizeFactor;\n' +
                'uniform float pixelSizeOffset;\n' +
                'uniform float outlineWidth;\n' +
                'uniform float cameraAltitude;\n' +
                    'void main() {\n' +
                    '   vec3 tangent = normalize(nextPos - prevPos);\n' +
                    '   vec3 normPos = normalize(pos);\n' +
                    '   vec3 nadir = normalize(cross(tangent, normPos));\n' +
                    '   vec3 offset = normalize(cross(nadir, tangent));\n' +
                '   float distance = max(0.01, min(length(eyePos - pos), cameraAltitude));\n' +
                '   float pixelSize = outlineWidth * (pixelSizeFactor * distance + pixelSizeOffset);\n' +
                '   normPos = pos + (offset * direction * pixelSize);\n' +
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

            this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

            this.pixelSizeFactorLocation = this.uniformLocation(gl, "pixelSizeFactor");

            this.pixelSizeOffsetLocation = this.uniformLocation(gl, "pixelSizeOffset");

            this.eyePositionLocation = this.uniformLocation(gl, "eyePos");

            this.outlineWidthLocation = this.uniformLocation(gl, "outlineWidth");

            this.cameraAltitudeLocation = this.uniformLocation(gl, "cameraAltitude");

            this.colorLocation = this.uniformLocation(gl, "color");
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

        SurfaceShapesSVProgram.prototype.loadOutlineWidth = function (gl, scale) {
            gl.uniform1f(this.outlineWidthLocation, scale);
        };

        SurfaceShapesSVProgram.prototype.loadPixelSizeFactor = function (gl, scale) {
            gl.uniform1f(this.pixelSizeFactorLocation, scale);
        };

        SurfaceShapesSVProgram.prototype.loadPixelSizeOffset = function (gl, scale) {
            gl.uniform1f(this.pixelSizeOffsetLocation, scale);
        };

        SurfaceShapesSVProgram.prototype.loadEyePosition = function (gl, pos) {
            gl.uniform3f(this.eyePositionLocation, pos[0], pos[1], pos[2]);
        };

        SurfaceShapesSVProgram.prototype.loadCameraAltitude = function (gl, alt) {
            gl.uniform1f(this.cameraAltitudeLocation, alt);
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
