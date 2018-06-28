/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports OrthoProgram
 */
define([
        '../error/ArgumentError',
        '../util/Color',
        '../shaders/GpuProgram',
        '../util/Logger'
    ],
    function (ArgumentError,
              Color,
              GpuProgram,
              Logger) {
        "use strict";

        var OrthoProgram = function (gl) {
            var vertexShaderSource =
                    'attribute vec4 vertexPoint;\n' +
                    'uniform mat4 mvpMatrix;\n' +
                    'uniform mat4 texCoordMatrix;\n' +
                    'varying vec2 texCoord;\n' +
                    'void main() {\n' +
                    '   gl_Position = mvpMatrix * vertexPoint;\n' +
                    '   texCoord = (texCoordMatrix * vertexPoint).st;\n' +
                '   texCoord.s = (texCoord.s + 1.0) * 0.5;\n' +
                '   texCoord.t = (texCoord.t + 1.0) * 0.5;\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +
                    'uniform sampler2D textureSampler;\n' +
                    'varying vec2 texCoord;\n' +
                    'void main() {\n' +
                    // '   gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' +
                    // '   if (texCoord.s < 1.0 && texCoord.s > 0.0 && texCoord.t < 1.0 && texCoord.t > 0.0) {\n' +
                    '       gl_FragColor = texture2D(textureSampler, texCoord);\n' +
                    // '   } else {\n' +
                    // '       discard;\n' +
                    // '   }\n' +
                    '}';

            // Specify bindings to avoid the WebGL performance warning that's generated when normalVector gets
            // bound to location 0.
            var bindings = ["vertexPoint"];

            // Call to the superclass, which performs shader program compiling and linking.
            GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, bindings);

            /**
             * The WebGL location for this program's 'vertexPoint' attribute.
             * @type {Number}
             * @readonly
             */
            this.vertexPointLocation = this.attributeLocation(gl, "vertexPoint");

            /**
             * The WebGL location for this program's 'mvpMatrix' uniform.
             * @type {WebGLUniformLocation}
             * @readonly
             */
            this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

            /**
             * The WebGL location for this program's 'textureSampler' uniform.
             * @type {WebGLUniformLocation}
             * @readonly
             */
            this.textureUnitLocation = this.uniformLocation(gl, "textureSampler");

            /**
             * The WebGL location for this program's 'texCoordMatrix' uniform.
             * @type {WebGLUniformLocation}
             * @readonly
             */
            this.textureMatrixLocation = this.uniformLocation(gl, "texCoordMatrix");
        };

        /**
         * A string that uniquely identifies this program.
         * @type {string}
         * @readonly
         */
        OrthoProgram.key = "WorldWindGpuOrthoProgram";

        // Inherit from GpuProgram.
        OrthoProgram.prototype = Object.create(GpuProgram.prototype);

        /**
         * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Matrix} matrix The matrix to load.
         * @throws {ArgumentError} If the specified matrix is null or undefined.
         */
        OrthoProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OrthoProgram", "loadModelviewProjection", "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        /**
         * Loads the specified number as the value of this program's 'textureSampler' uniform variable.
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Number} unit The texture unit.
         */
        OrthoProgram.prototype.loadTextureUnit = function (gl, unit) {
            gl.uniform1i(this.textureUnitLocation, unit - gl.TEXTURE0);
        };

        /**
         * Loads the specified matrix as the value of this program's 'texCoordMatrix' uniform variable.
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Matrix} matrix The texture coordinate matrix.
         */
        OrthoProgram.prototype.loadTextureMatrix = function (gl, matrix) {
            this.loadUniformMatrix(gl, matrix, this.textureMatrixLocation);
        };

        return OrthoProgram;
    });
