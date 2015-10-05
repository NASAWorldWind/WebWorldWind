/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GpuShader
 * @version $Id: GpuShader.js 2906 2015-03-17 18:45:22Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs a GPU shader of a specified type with specified GLSL source code.
         *
         * @alias GpuShader
         * @constructor
         * @classdesc
         * Represents an OpenGL shading language (GLSL) shader and provides methods for compiling and disposing
         * of them.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Number} shaderType The type of shader, either WebGLRenderingContext.VERTEX_SHADER
         * or WebGLRenderingContext.FRAGMENT_SHADER.
         * @param {String} shaderSource The shader's source code.
         * @throws {ArgumentError} If the shader type is unrecognized, the shader source is null or undefined or shader
         * compilation fails. If the compilation fails the error thrown contains any compilation messages.
         */
        var GpuShader = function (gl, shaderType, shaderSource) {
            if (!(shaderType === gl.VERTEX_SHADER
                || shaderType === gl.FRAGMENT_SHADER)) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
                    "The specified shader type is unrecognized."));
            }

            if (!shaderSource) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
                    "The specified shader source is null or undefined."));
            }

            var shader = gl.createShader(shaderType);
            if (!shader) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
                    "Unable to create shader of type " +
                    (shaderType == gl.VERTEX_SHADER ? "VERTEX_SHADER." : "FRAGMENT_SHADER.")));
            }

            if (!this.compile(gl, shader, shaderType, shaderSource)) {
                var infoLog = gl.getShaderInfoLog(shader);

                gl.deleteShader(shader);

                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "GpuShader", "constructor",
                    "Unable to compile shader: " + infoLog));
            }

            this.shaderId = shader;
        };

        /**
         * Compiles the source code for this shader. This method is not meant to be invoked by applications. It is
         * invoked internally as needed.
         * @param {WebGLRenderingContext} gl The current WebGL rendering context.
         * @param {WebGLShader} shaderId The shader ID.
         * @param {Number} shaderType The type of shader, either WebGLRenderingContext.VERTEX_SHADER
         * or WebGLRenderingContext.FRAGMENT_SHADER.
         * @param {String} shaderSource The shader's source code.
         * @returns {boolean} <code>true</code> if the shader compiled successfully, otherwise <code>false</code>.
         */
        GpuShader.prototype.compile = function (gl, shaderId, shaderType, shaderSource) {
            gl.shaderSource(shaderId, shaderSource);
            gl.compileShader(shaderId);

            return gl.getShaderParameter(shaderId, gl.COMPILE_STATUS);
        };

        /**
         * Releases this shader's WebGL shader.
         * @param {WebGLRenderingContext} gl The current WebGL rendering context.
         */
        GpuShader.prototype.dispose = function (gl) {
            if (this.shaderId) {
                gl.deleteShader(this.shaderId);
                delete this.shaderId;
            }
        };

        return GpuShader;
    });