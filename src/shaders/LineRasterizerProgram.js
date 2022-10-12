/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports LineRasterizerProgram
 */
 define([
    '../error/ArgumentError',
    '../shaders/GpuProgram',
    '../util/Logger'
],
function (ArgumentError,
          GpuProgram,
          Logger) {
    "use strict";

    /**
     * Constructs a new program.
     * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
     * <p>
     * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program.
     * This method then compiles the shaders and then links the program if compilation is successful.
     * Use the bind method to make the program current during rendering.
     *
     * @alias LineRasterizerProgram
     * @constructor
     * @augments GpuProgram
     * @classdesc LineRasterizerProgram is a GLSL program that provides width to 3D lines such as the ones used in the .
     * @param {WebGLRenderingContext} gl The current WebGL context.
     * @throws {ArgumentError} If the shaders cannot be compiled, or linking of the compiled shaders into a program
     * fails.
     */
    var LineRasterizerProgram = function (gl) {
        var vertexShaderSource =
                'attribute vec3 position;' +
                'attribute float direction;' + 
                'attribute vec3 next;' +
                'attribute vec3 previous;' +
                'uniform mat4 projection;' +
                'uniform mat4 model;' +
                'uniform mat4 view;' +
                'uniform float aspect;' +
                'uniform float thickness;' +
                'uniform int miter;' +
                
                'void main() {\n' +
                '   vec2 aspectVec = vec2(aspect, 1.0);' +
                '   mat4 projViewModel = projection * view * model;' +
                '   vec4 previousProjected = projViewModel * vec4(previous, 1.0);' +
                '   vec4 currentProjected = projViewModel * vec4(position, 1.0);' +
                '   vec4 nextProjected = projViewModel * vec4(next, 1.0);' +
                    
                    //get 2D screen space with W divide and aspect correction
                '   vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;' +
                '   vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;' +
                '   vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;' +
                    
                '   float len = thickness;' +
                '   float orientation = direction;' +
                    
                    //starting point uses (next - current)
                '   vec2 dir = vec2(0.0);' +
                '   if (currentScreen == previousScreen) {\n' +
                '       dir = normalize(nextScreen - currentScreen);' +
                '   }\n' + 
                    //ending point uses (current - previous)
                '   else if (currentScreen == nextScreen) {\n' +
                '   dir = normalize(currentScreen - previousScreen);' +
                '   }\n' +
                    //somewhere in middle, needs a join
                '   else {\n' +
                        //get directions from (C - B) and (B - A)
                '       vec2 dirA = normalize((currentScreen - previousScreen));' +
                '       if (miter == 1) {\n' +
                '          vec2 dirB = normalize((nextScreen - currentScreen));' +
                           //now compute the miter join normal and length
                '          vec2 tangent = normalize(dirA + dirB);' +
                '          vec2 perp = vec2(-dirA.y, dirA.x);' +
                '          vec2 miter = vec2(-tangent.y, tangent.x);' +
                '          dir = tangent;' +
                '          len = thickness / dot(miter, perp);' +
                '       } else {dir = dirA};' +
                '   }\n' +
                '   vec2 normal = vec2(-dir.y, dir.x);' +
                '   normal *= len/2.0;' +
                '   normal.x /= aspect;' +
                    
                '   vec4 offset = vec4(normal * orientation, 0.0, 1.0);' +
                '   gl_Position = currentProjected + offset;' +
                '   gl_PointSize = 1.0;' +
                '}\n'
                ,
            fragmentShaderSource =
                '#ifdef GL_ES' +
                'precision mediump float;' +
                '#endif'+
                
                'uniform vec3 color;' +
                
                'void main() {\n' +
                '   gl_FragColor = vec4(color, 1.0);' +
                '}\n';

        // Call to the superclass, which performs shader program compiling and linking.
        GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, ["vertexPoint"]);

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
         * The WebGL location for this program's 'magnitudeRangeLocation' uniform.
         * @type {WebGLUniformLocation}
         * @readonly
         */
        this.magnitudeRangeLocation = this.uniformLocation(gl, "magnitudeRange");

        /**
         * The WebGL location for this program's 'textureSampler' uniform.
         * @type {WebGLUniformLocation}
         * @readonly
         */
        this.textureUnitLocation = this.uniformLocation(gl, "textureSampler");

        /**
         * The WebGL location for this program's 'textureEnabled' uniform.
         * @type {WebGLUniformLocation}
         * @readonly
         */
        this.textureEnabledLocation = this.uniformLocation(gl, "textureEnabled");
    };

    /**
     * A string that uniquely identifies this program.
     * @type {string}
     * @readonly
     */
    LineRasterizerProgram.key = "WorldWindGpuLineRasterizerProgram";

    // Inherit from GpuProgram.
    LineRasterizerProgram.prototype = Object.create(GpuProgram.prototype);

    /**
     * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
     *
     * @param {WebGLRenderingContext} gl The current WebGL context.
     * @param {Matrix} matrix The matrix to load.
     * @throws {ArgumentError} If the specified matrix is null or undefined.
     */
    LineRasterizerProgram.prototype.loadModelviewProjection = function (gl, matrix) {
        if (!matrix) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "LineRasterizerProgram", "loadModelviewProjection", "missingMatrix"));
        }

        this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
    };

    /**
     * Loads the specified numbers as the value of this program's 'magnitudeRange' uniform variable.
     *
     * @param {WebGLRenderingContext} gl The current WebGL context.
     * @param {Number} minMag
     * @param {Number} maxMag
     * @throws {ArgumentError} If the specified numbers are null or undefined.
     */
    LineRasterizerProgram.prototype.loadMagnitudeRange = function (gl, minMag, maxMag) {
        if (minMag == null) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "LineRasterizerProgram", "loadMagRange", "missingMinMag"));
        }
        if (maxMag == null) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "LineRasterizerProgram", "loadMagRange", "missingMaxMag"));
        }
        gl.uniform2f(this.magnitudeRangeLocation, minMag, maxMag);
    };

    /**
     * Loads the specified number as the value of this program's 'textureSampler' uniform variable.
     * @param {WebGLRenderingContext} gl The current WebGL context.
     * @param {Number} unit The texture unit.
     */
    LineRasterizerProgram.prototype.loadTextureUnit = function (gl, unit) {
        gl.uniform1i(this.textureUnitLocation, unit - gl.TEXTURE0);
    };

    /**
     * Loads the specified boolean as the value of this program's 'textureEnabledLocation' uniform variable.
     * @param {WebGLRenderingContext} gl The current WebGL context.
     * @param {Boolean} value
     */
    LineRasterizerProgram.prototype.loadTextureEnabled = function (gl, value) {
        gl.uniform1i(this.textureEnabledLocation, value ? 1 : 0);
    };

    return LineRasterizerProgram;
});