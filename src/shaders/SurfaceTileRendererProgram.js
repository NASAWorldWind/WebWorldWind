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
 * @exports SurfaceTileRendererProgram
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

        /**
         * Constructs a new surface-tile-renderer program.
         * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
         * <p>
         * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program. This
         * method then compiles the shaders and links the program if compilation is successful. Use the bind method to make the
         * program current during rendering.
         *
         * @alias SurfaceTileRendererProgram
         * @constructor
         * @augments GpuProgram
         * @classdesc A GLSL program that draws textured geometry on the globe's terrain.
         * Application's typically do not interact with this class.
         * @param {WebGLRenderingContext} gl The current WebGL context.
         */
        var SurfaceTileRendererProgram = function (gl) {
            var vertexShaderSource =
                    'attribute vec4 vertexPoint;\n' +
                    'attribute vec4 vertexTexCoord;\n' +
                    'uniform mat4 mvpMatrix;\n' +
                    'uniform mat4 texSamplerMatrix;\n' +
                    'uniform mat4 texMaskMatrix;\n' +
                    'varying vec2 texSamplerCoord;\n' +
                    'varying vec2 texMaskCoord;\n' +
                    'void main() {\n' +
                    'gl_Position = mvpMatrix * vertexPoint;\n' +
                        /* Transform the vertex texture coordinate into sampler texture coordinates. */
                    'texSamplerCoord = (texSamplerMatrix * vertexTexCoord).st;\n' +
                        /* Transform the vertex texture coordinate into mask texture coordinates. */
                    'texMaskCoord = (texMaskMatrix * vertexTexCoord).st;\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +
                        /* Uniform sampler indicating the texture 2D unit (0, 1, 2, etc.) to use when sampling texture color. */
                    'uniform sampler2D texSampler;\n' +
                    'uniform float opacity;\n' +
                    'uniform vec4 color;\n' +
                    'uniform bool modulateColor;\n' +
                    'varying vec2 texSamplerCoord;\n' +
                    'varying vec2 texMaskCoord;\n' +
                        /*
                         * Returns true when the texture coordinate samples texels outside the texture image.
                         */
                    'bool isInsideTextureImage(const vec2 coord) {\n' +
                    '    return coord.x >= 0.0 && coord.x <= 1.0 && coord.y >= 0.0 && coord.y <= 1.0;\n' +
                    '}\n' +
                        /*
                         * OpenGL ES Shading Language v1.00 fragment shader for SurfaceTileRendererProgram. Writes the value of the texture 2D
                         * object bound to texSampler at the current transformed texture coordinate, multiplied by the uniform opacity. Writes
                         * transparent black (0, 0, 0, 0) if the transformed texture coordinate indicates a texel outside of the texture data's
                         * standard range of [0,1].
                         */
                    'void main(void) {\n' +
                        'float mask = float(isInsideTextureImage(texMaskCoord));' +
                    'if (modulateColor) {\n' +
                    '    gl_FragColor = color * mask * floor(texture2D(texSampler, texSamplerCoord).a + 0.5);\n' +
                    '} else {\n' +
                        /* Return either the sampled texture2D color multiplied by opacity or transparent black. */
                    '    gl_FragColor = texture2D(texSampler, texSamplerCoord) * mask * opacity;\n' +
                    '}\n' +
                    '}';

            // Call to the superclass, which performs shader program compiling and linking.
            GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource);

            // Capture the attribute and uniform locations.

            /**
             * This program's vertex point location.
             * @type {Number}
             * @readonly
             */
            this.vertexPointLocation = this.attributeLocation(gl, "vertexPoint");

            /**
             * This program's texture coordinate location.
             * @type {Number}
             * @readonly
             */
            this.vertexTexCoordLocation = this.attributeLocation(gl, "vertexTexCoord");

            /**
             * This program's modelview-projection matrix location.
             * @type {WebGLUniformLocation}
             * @readonly
             */
            this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

            /**
             * The WebGL location for this program's 'color' uniform.
             * @type {WebGLUniformLocation}
             * @readonly
             */
            this.colorLocation = this.uniformLocation(gl, "color");

            /**
             * The WebGL location for this program's 'modulateColor' uniform.
             * @type {WebGLUniformLocation}
             * @readonly
             */
            this.modulateColorLocation = this.uniformLocation(gl, "modulateColor");

            // The rest of these are strictly internal and intentionally not documented.
            this.texSamplerMatrixLocation = this.uniformLocation(gl, "texSamplerMatrix");
            this.texMaskMatrixLocation = this.uniformLocation(gl, "texMaskMatrix");
            this.texSamplerLocation = this.uniformLocation(gl, "texSampler");
            this.opacityLocation = this.uniformLocation(gl, "opacity");

            /**
             * The WebGL location for this program's 'vertexTexCoord' attribute.
             * @type {Number}
             * @readonly
             */
            this.vertexPointLocation = -1;
        };

        /**
         * A string that uniquely identifies this program.
         * @type {string}
         * @readonly
         */
        SurfaceTileRendererProgram.key = "WorldWindGpuSurfaceTileRenderingProgram";

        SurfaceTileRendererProgram.prototype = Object.create(GpuProgram.prototype);

        /**
         * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Matrix} matrix The matrix to load.
         * @throws {ArgumentError} If the specified matrix is null or undefined.
         */
        SurfaceTileRendererProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTileRendererProgram", "loadModelviewProjection",
                        "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        /**
         * Loads the specified matrix as the value of this program's 'texSamplerMatrix' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Matrix} matrix The matrix to load.
         * @throws {ArgumentError} If the specified matrix is null or undefined.
         */
        SurfaceTileRendererProgram.prototype.loadTexSamplerMatrix = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTileRendererProgram", "loadTexSamplerMatrix",
                        "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.texSamplerMatrixLocation);
        };

        /**
         * Loads the specified matrix as the value of this program's 'texMaskMatrix' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Matrix} matrix The matrix to load.
         * @throws {ArgumentError} If the specified matrix is null or undefined.
         */
        SurfaceTileRendererProgram.prototype.loadTexMaskMatrix = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTileRendererProgram", "loadTexMaskMatrix",
                        "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.texMaskMatrixLocation);
        };

        /**
         * Loads the specified texture unit ID as the value of this program's 'texSampler' uniform variable.
         * The specified unit ID must be one of the GL_TEXTUREi WebGL enumerations, where i ranges from 0 to
         * GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Number} unit The unit ID to load.
         */
        SurfaceTileRendererProgram.prototype.loadTexSampler = function (gl, unit) {
            gl.uniform1i(this.texSamplerLocation, unit - WebGLRenderingContext.TEXTURE0);
        };

        /**
         * Loads the specified value as the value of this program's 'opacity' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Number} opacity The opacity to load.
         */
        SurfaceTileRendererProgram.prototype.loadOpacity = function (gl, opacity) {
            gl.uniform1f(this.opacityLocation, opacity);
        };

        /**
         * Loads the specified color as the value of this program's 'color' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Color} color The color to load.
         * @throws {ArgumentError} If the specified color is null or undefined.
         */
        SurfaceTileRendererProgram.prototype.loadColor = function (gl, color) {
            if (!color) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceTileRendererProgram", "loadColor", "missingColor"));
            }

            this.loadUniformColor(gl, color, this.colorLocation);
        };

        /**
         * Loads the specified boolean as the value of this program's 'modulateColor' uniform variable. When this
         * value is true the color uniform of this shader is
         * multiplied by the rounded alpha component of the texture color at each fragment. This causes the color
         * to be either fully opaque or fully transparent depending on the value of the texture color's alpha value.
         * This is used during picking to replace opaque or mostly opaque texture colors with the pick color, and
         * to make all other texture colors transparent.
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Boolean} enable <code>true</code> to enable modulation, <code>false</code> to disable modulation.
         */
        SurfaceTileRendererProgram.prototype.loadModulateColor = function (gl, enable) {
            gl.uniform1i(this.modulateColorLocation, enable ? 1 : 0);
        };

        return SurfaceTileRendererProgram;
    });