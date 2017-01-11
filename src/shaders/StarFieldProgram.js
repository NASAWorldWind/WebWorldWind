/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BasicProgram
 * @version $Id: BasicProgram.js 3327 2015-07-21 19:03:39Z dcollins $
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
         * Constructs a new program.
         * Initializes, compiles and links this GLSL program with the source code for its vertex and fragment shaders.
         * <p>
         * This method creates WebGL shaders for the program's shader sources and attaches them to a new GLSL program. This
         * method then compiles the shaders and then links the program if compilation is successful. Use the bind method to make the
         * program current during rendering.
         *
         * @alias BasicProgram
         * @constructor
         * @augments GpuProgram
         * @classdesc BasicProgram is a GLSL program that draws geometry in a solid color.
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @throws {ArgumentError} If the shaders cannot be compiled, or linking of
         * the compiled shaders into a program fails.
         */
        var StarFieldProgram = function (gl) {
            var vertexShaderSource =
                    'attribute vec4 vertexPoint;\n' +

                    'uniform mat4 mvpMatrix;\n' +
                    'uniform float JD;\n' +

                    'varying float mag;\n' +

                    'const float altitude = 1.0;\n' + //67310000.0

                    'float normalizeAngle(float angle) {\n' +
                    '   float angleDivisions = angle / 360.0;\n' +
                    '   return 360.0 * (angleDivisions - floor(angleDivisions));\n' +
                    '}\n' +

                    'float normalizedDegreesLongitude(float angle) {\n' +
                    '   float na = angle + 179.0;\n' +
                    '   return mod((mod(na, 360.0) + 360.0), 360.0) - 179.0;\n' +
                    '}\n' +

                    'vec3 computePosition(float dec, float ra) {\n' +
                    //'   float n = JD - 2451545.0;\n' +
                    '   float GMST = normalizeAngle(280.46061837 + 360.98564736629 * JD);\n' +
                    '   float lon = 180.0 - normalizeAngle(GMST - ra);\n' +
                    //'   lon = normalizedDegreesLongitude(lon);\n' +
                    '   float latRad = radians(dec);\n' +
                    '   float lonRad = radians(lon);\n' +
                    '   float radCosLat = altitude * cos(latRad);\n' +
                    '   return vec3(radCosLat * sin(lonRad), altitude * sin(latRad), radCosLat * cos(lonRad));\n' +
                    '}\n' +

                    'void main() {\n' +
                    '   vec3 vertexPosition = computePosition(vertexPoint.x, vertexPoint.y);\n' +
                    '   gl_Position = mvpMatrix * vec4(vertexPosition.xyz, 1.0);\n' +
                    '   gl_Position.z = gl_Position.w - 0.00001;\n' +
                    '   gl_PointSize = vertexPoint.z;\n' +
                    '   mag = vertexPoint.w;\n' +
                    '}',
                fragmentShaderSource =
                    'precision mediump float;\n' +

                    'varying float mag;\n' +

                    'const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);\n' +
                    'const vec4 grey = vec4(0.93, 0.93, 0.93, 1.0);\n' +

                    'void main() {\n' +
                    '   gl_FragColor = mix(white, grey, mag);\n' + //doesn't appear to be correct
                    //'   gl_FragColor = white;\n' +
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

            this.JDLocation = this.uniformLocation(gl, "JD");
        };

        /**
         * A string that uniquely identifies this program.
         * @type {string}
         * @readonly
         */
        StarFieldProgram.key = "WorldWindGpuStarFieldProgram";

        // Inherit from GpuProgram.
        StarFieldProgram.prototype = Object.create(GpuProgram.prototype);

        /**
         * Loads the specified matrix as the value of this program's 'mvpMatrix' uniform variable.
         *
         * @param {WebGLRenderingContext} gl The current WebGL context.
         * @param {Matrix} matrix The matrix to load.
         * @throws {ArgumentError} If the specified matrix is null or undefined.
         */
        StarFieldProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "StarFieldProgram", "loadModelviewProjection", "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        StarFieldProgram.prototype.loadJD = function(gl, JD){
            gl.uniform1f(this.JDLocation, JD);
        };

        return StarFieldProgram;
    });