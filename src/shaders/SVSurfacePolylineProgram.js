define([
        '../error/ArgumentError',
        '../shaders/GpuProgram',
        '../util/Logger'
    ],
    function (ArgumentError, GpuProgram, Logger) {
        "use strict";

        var SVSurfacePolylineProgram = function (gl) {
            var vertexShaderSource =
                    'attribute vec4 pos;\n' +
                    'attribute vec4 offsetDirection;\n' +
                    'uniform mat4 mvpMatrix;\n' +
                    'uniform float offsetScale;\n' +
                    'void main() {\n' +
                    '   gl_Position = mvpMatrix * (pos + offsetDirection * offsetScale);\n' +
                // '   gl_Position = mvpMatrix * pos;\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +
                    'uniform vec4 color;\n' +
                    'void main() {gl_FragColor = color;}';

            // Call to the superclass, which performs shader program compiling and linking.
            GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource);

            this.posLocation = this.attributeLocation(gl, "pos");

            this.offsetDirectionLocation = this.attributeLocation(gl, "offsetDirection");

            this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

            this.offsetScaleLocation = this.uniformLocation(gl, "offsetScale");

            this.colorLocation = this.uniformLocation(gl, "color");
        };

        SVSurfacePolylineProgram.key = "WorldWindGpuSVSurfacePolylineProgram";

        SVSurfacePolylineProgram.prototype = Object.create(GpuProgram.prototype);

        SVSurfacePolylineProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SVSurfacePolylineProgram", "loadModelviewProjection",
                        "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        SVSurfacePolylineProgram.prototype.loadOffsetScale = function (gl, offsetScale) {
            gl.uniform1f(this.offsetScaleLocation, offsetScale);
        };

        /**
         * Loads the specified color as the value of this program's 'color' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Color} color The color to load.
         * @throws {ArgumentError} If the specified color is null or undefined.
         */
        SVSurfacePolylineProgram.prototype.loadColor = function (gl, color) {
            if (!color) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SVSurfacePolylineProgram", "loadColor", "missingColor"));
            }

            this.loadUniformColor(gl, color, this.colorLocation);
        };

        /**
         * Loads the specified RGBA color components as the value of this program's 'color' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Number} red The red component, a number between 0 and 1.
         * @param {Number} green The green component, a number between 0 and 1.
         * @param {Number} blue The blue component, a number between 0 and 1.
         * @param {Number} alpha The alpha component, a number between 0 and 1.
         */
        SVSurfacePolylineProgram.prototype.loadColorComponents = function (gl, red, green, blue, alpha) {
            this.loadUniformColorComponents(gl, red, green, blue, alpha, this.colorLocation);
        };

        return SVSurfacePolylineProgram;
    });