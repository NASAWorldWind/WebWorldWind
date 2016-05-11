/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports AtmosphereProgram
 */
define([
        '../error/ArgumentError',
        '../shaders/GpuProgram',
        '../util/Logger',
        '../geom/Matrix',
        '../geom/Vec3'
    ],
    function (ArgumentError,
              GpuProgram,
              Logger,
              Matrix,
              Vec3) {
        "use strict";


        var  AtmosphereProgram = function (gl, vertexShaderSource, fragmentShaderSource, attribute) {

            // Call to the superclass, which performs shader program compiling and linking.
            GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, attribute);

            this.FRAGMODE_SKY = 1;

            this.FRAGMODE_GROUND_PRIMARY = 2;

            this.FRAGMODE_GROUND_SECONDARY = 3;

            this.FRAGMODE_GROUND_PRIMARY_TEX_BLEND = 4;

            this.altitude = 160000;

            this.rayleighScaleDepth = 0.25;

            this.fragModeLocation = this.uniformLocation(gl, "fragMode");
            //gl.uniform1i(this.fragModeLocation, this.FRAGMODE_SKY);

            this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");
            //this.loadModelviewProjection(gl, new Matrix.fromIdentity());

            this.vertexOriginLocation = this.uniformLocation(gl, "vertexOrigin");
            //this.loadVertexOrigin(gl, [0, 0, 0]);

            this.eyePointLocation = this.uniformLocation(gl, "eyePoint");
            //gl.uniform3fv(this.eyePointLocation, [0, 0, 0]);

            this.eyeMagnitudeLocation = this.uniformLocation(gl, "eyeMagnitude");
            //gl.uniform1f(this.eyeMagnitudeLocation, 0);

            this.eyeMagnitude2Location = this.uniformLocation(gl, "eyeMagnitude2");
            //gl.uniform1f(this.eyeMagnitude2Location, 0);

            this.lightDirectionLocation = this.uniformLocation(gl, "lightDirection");
            //gl.uniform3fv(this.lightDirectionLocation, [0, 0, 0]);

            this.atmosphereRadiusLocation = this.uniformLocation(gl, "atmosphereRadius");
            //gl.uniform1f(this.atmosphereRadiusLocation, 0);

            this.atmosphereRadius2Location = this.uniformLocation(gl, "atmosphereRadius2");
            //gl.uniform1f(this.atmosphereRadius2Location, 0);

            this.globeRadiusLocation = this.uniformLocation(gl, "globeRadius");
            //gl.uniform1f(this.globeRadiusLocation, 0);

            this.scaleLocation = this.uniformLocation(gl, "scale");
            //gl.uniform1f(this.scaleLocation, 1 / this.altitude);

            this.scaleDepthLocation = this.uniformLocation(gl, "scaleDepth");
            //gl.uniform1f(this.scaleDepthLocation, this.rayleighScaleDepth);

            this.scaleOverScaleDepthLocation = this.uniformLocation(gl, "scaleOverScaleDepth");
            //gl.uniform1f(this.scaleOverScaleDepthLocation, (1 / this.altitude) / this.rayleighScaleDepth);

        };

        AtmosphereProgram.key = "WorldWindGpuAtmosphereProgram";

        AtmosphereProgram.prototype = Object.create(GpuProgram.prototype);

        AtmosphereProgram.prototype.getAltitude = function () {
            return this.altitude;
        };

        AtmosphereProgram.prototype.getScaleDepth = function () {
            return this.rayleighScaleDepth;
        };

        AtmosphereProgram.prototype.loadFragMode = function(gl, fragMode) {
            gl.uniform1i(this.fragModeLocation, fragMode);
        };

        AtmosphereProgram.prototype.loadModelviewProjection = function (gl, matrix) {
            if (!matrix) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadModelviewProjection", "missingMatrix"));
            }

            this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
        };

        AtmosphereProgram.prototype.loadVertexOrigin = function (gl, vector) {
            if (!vector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadVertexOrigin", "missingVector"));
            }

            gl.uniform3fv(this.vertexOriginLocation, [vector[0], vector[1], vector[2]]);
        };

        AtmosphereProgram.prototype.loadLightDirection = function (gl, vector) {
            if (!vector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadLightDirection", "missingVector"));
            }

            gl.uniform3fv(this.lightDirectionLocation, [vector[0], vector[1], vector[2]]);
        };

        AtmosphereProgram.prototype.loadEyePoint = function (gl, vector) {
            if (!vector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadEyePoint", "missingVector"));
            }

            gl.uniform3fv(this.eyePointLocation, [vector[0], vector[1], vector[2]]);
            gl.uniform1f(this.eyeMagnitudeLocation, vector.magnitude());
            gl.uniform1f(this.eyeMagnitude2Location, vector.magnitudeSquared());

        };

        AtmosphereProgram.prototype.loadGlobe = function (gl, globe) {
            if (!globe) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "AtmosphereProgram", "loadGlobe", "missingGlobe"));
            }

            var gr = globe.equatorialRadius;
            var ar = gr + this.altitude;

            gl.uniform1f(this.globeRadiusLocation, gr);
            gl.uniform1f(this.atmosphereRadiusLocation, ar);
            gl.uniform1f(this.atmosphereRadius2Location, ar * ar);
        };

        AtmosphereProgram.prototype.loadScale = function (gl) {
            gl.uniform1f(this.scaleLocation, 1 / this.getAltitude());
            gl.uniform1f(this.scaleDepthLocation, this.getScaleDepth());
            gl.uniform1f(this.scaleOverScaleDepthLocation, (1 / this.getAltitude()) / this.getScaleDepth());
        };

        return AtmosphereProgram;
    });
