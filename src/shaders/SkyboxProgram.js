/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SkyBoxProgram
 */
define([
        '../error/ArgumentError',
        './GpuProgram',
        '../util/Logger'
    ],
    function (ArgumentError,
              GpuProgram,
              Logger) {
        'use strict';

        /**
         * Constructs a new program.
         * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
         * <p>
         * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program. This
         * method then compiles the shaders and then links the program if compilation is successful. Use the bind method to make the
         * program current during rendering.
         *
         * @alias SkyBoxProgram
         * @constructor
         * @augments GpuProgram
         * @classdesc SkyBoxProgram is a GLSL program that draws a skybox.
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @throws {ArgumentError} If the shaders cannot be compiled, or if linking of
         * the compiled shaders into a program fails.
         */
        var SkyBoxProgram = function (gl) {
            var vertexShaderSource =
                'attribute vec3 vertexPoint;\n' +
                'uniform  mat4 mvpMatrix;\n' +
                'varying vec3 texCoord;\n' +
                'void main(){\n' +
                '   gl_Position = mvpMatrix * vec4(vertexPoint, 1.0);\n' +
                    //prevent the skybox from being clipped by the far plane
                '   gl_Position.z = gl_Position.w - 0.00001;\n' +
                '   texCoord = vertexPoint;\n' +
                '}\n';
            var fragmentShaderSource =
                'precision mediump float;\n' +
                'varying vec3 texCoord;\n' +
                'uniform samplerCube skybox;\n' +
                'void main(){\n' +
                '   gl_FragColor = textureCube(skybox, texCoord);\n' +
                '}';

            // Call to the superclass, which performs shader program compiling and linking.
            GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, ['vertexPoint']);

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
            this.textureUnitLocation = this.uniformLocation(gl, "skybox");

            this.localState = {
                textureUnit: null
            }
        };

        /**
         * A string that uniquely identifies this program.
         * @type {string}
         * @readonly
         */
        SkyBoxProgram.key = "WorldWindGpuSkyBoxProgram";

        // Inherit from GpuProgram.
        SkyBoxProgram.prototype = Object.create(GpuProgram.prototype);

        /**
         * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Matrix} matrix The matrix to load.
         * @throws {ArgumentError} If the specified matrix is null or undefined.
         */
        SkyBoxProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SkyBoxProgram", "loadModelviewProjection", "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        /**
         * Loads the specified number as the value of this program's 'textureSampler' uniform variable.
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Number} unit The texture unit.
         */
        SkyBoxProgram.prototype.loadTextureUnit = function (gl, unit) {
            if (this.localState.textureUnit !== unit) {
                gl.uniform1i(this.textureUnitLocation, unit - gl.TEXTURE0);
                this.localState.textureUnit = unit;
            }
        };

        return SkyBoxProgram;

    });