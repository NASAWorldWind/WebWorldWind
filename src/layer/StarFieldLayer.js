/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports StarFieldLayer
 */
define([
        './Layer',
        '../geom/Matrix',
        '../shaders/StarFieldProgram'
    ],
    function (Layer,
              Matrix,
              StarFieldProgram) {
        'use strict';

        /**
         * Constructs a layer showing bright stars visible from the Earth with the naked eye.
         * @alias StarFieldLayer
         * @constructor
         * @classdesc Provides a layer showing bright stars visible from the Earth with the naked eye.
         * @param {URL} starDataSource optional url for the stars data.
         * @augments Layer
         */
        var StarFieldLayer = function (starDataSource) {
            Layer.call(this, 'StarField');

            // The StarField Layer is not pickable.
            this.pickEnabled = false;

            //Documented in defineProperties below.
            this._starDataSource = starDataSource ||
                WorldWind.configuration.baseUrl + 'examples/data/stars.json';

            //Internal use only.
            //The MVP matrix of this layer.
            this._matrix = Matrix.fromIdentity();

            //Internal use only.
            //gpu cache key for this layer vbo.
            this._positionsVboCacheKey = null;

            //Internal use only.
            this._numStars = 0;

            //Internal use only.
            this._starData = null;

            //Internal use only.
            //A flag to indicate the star data is currently being retrieved.
            this._loadStarted = false;
        };

        StarFieldLayer.prototype = Object.create(Layer.prototype);

        Object.defineProperties(StarFieldLayer.prototype, {
            /**
             * Url for the stars data.
             * @memberof StarFieldLayer.prototype
             * @type {URL}
             */
            starDataSource: {
                get: function () {
                    return this._starDataSource;
                },
                set: function (value) {
                    this._starDataSource = value;
                    this.invalidateStarData();
                }
            }
        });

        // Documented in superclass.
        StarFieldLayer.prototype.doRender = function (dc) {
            if (dc.globe.is2D()) {
                return;
            }

            if (!this._starData) {
                this.fetchStarData();
                return;
            }

            this.beginRendering(dc);
            try {
                this.doDraw(dc);
            }
            finally {
                this.endRendering(dc);
            }
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.beginRendering = function (dc) {
            dc.findAndBindProgram(StarFieldProgram);
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.doDraw = function (dc) {
            var gl = dc.currentGlContext;
            this.loadUniforms(dc);
            this.loadAttributes(dc);
            gl.depthMask(false);
            gl.drawArrays(gl.POINTS, 0, this._numStars);
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.loadUniforms = function (dc) {
            var gl = dc.currentGlContext;
            var program = dc.currentProgram;

            //multiplyByScale is necessary until the new camera implementation with the infinite projection matrix
            var eyePoint = dc.navigatorState.eyePoint;
            var position = dc.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], {});
            var altitude = position.altitude * 1.5;
            this._matrix.copy(dc.navigatorState.modelviewProjection);
            this._matrix.multiplyByScale(altitude, altitude, altitude);
            program.loadModelviewProjection(gl, this._matrix);

            var JD = this.julianDate(this.time);
            //this subtraction does not work properly on the GPU, it must be done on the CPU
            //possibly due to precision loss
            //number of days (positive or negative) since Greenwich noon, Terrestrial Time, on 1 January 2000 (J2000.0)
            program.loadNumDays(gl, JD - 2451545.0);
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.loadAttributes = function (dc) {
            var gl = dc.currentGlContext;
            var gpuResourceCache = dc.gpuResourceCache;

            if (!this._positionsVboCacheKey) {
                this._positionsVboCacheKey = gpuResourceCache.generateCacheKey();
            }
            var vboId = gpuResourceCache.resourceForKey(this._positionsVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                var positions = this.createGeometry();
                gpuResourceCache.putResource(this._positionsVboCacheKey, vboId, positions.length * 4);
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
                this._numStars = Math.floor(positions.length / 4);
            }
            else {
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            }
            dc.frameStatistics.incrementVboLoadCount(1);

            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.endRendering = function (dc) {
            var gl = dc.currentGlContext;
            gl.depthMask(true);
            gl.disableVertexAttribArray(0);
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.fetchStarData = function () {
            if (this._loadStarted) {
                return;
            }

            this._loadStarted = true;
            var self = this;
            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    try {
                        self._starData = JSON.parse(this.response);
                    }
                    catch (e) {
                        console.error('StarFieldLayer unable to parse JSON for star data', e);
                    }
                }
                self._loadStarted = false;
            };

            xhr.onerror = function (e) {
                console.error('StarFieldLayer unable to fetch star data', e);
                self._loadStarted = false;
            };

            xhr.ontimeout = function () {
                console.error('StarFieldLayer fetch star data timeout');
                self._loadStarted = false;
            };

            xhr.open('GET', this._starDataSource, true);
            xhr.send();
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.createGeometry = function () {
            var data = this._starData.data;
            var positions = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var starInfo = data[i];
                var declination = starInfo[2]; //for latitude
                var rightAscension = starInfo[1]; //for longitude
                var magnitude = starInfo[3];
                var pointSize = magnitude < 4 ? 2 : 1;
                positions.push(declination, rightAscension, pointSize, magnitude);
            }
            return positions;
        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.julianDate = function julianDate(date) {
            //http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html

            date = date || new Date();
            var year = date.getUTCFullYear();
            var month = date.getUTCMonth() + 1;
            var day = date.getUTCDate();
            var hour = date.getUTCHours();
            var minute = date.getUTCMinutes();
            var second = date.getUTCSeconds();

            var dayFraction = (hour + minute / 60 + second / 3600) / 24;

            if (month <= 2) {
                year -= 1;
                month += 12;
            }

            var A = Math.floor(year / 100);
            var B = 2 - A + Math.floor(A / 4);
            var JD0h = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;

            return JD0h + dayFraction;

        };

        // Internal. Intentionally not documented.
        StarFieldLayer.prototype.invalidateStarData = function (){
            this._starData = null;
            this._positionsVboCacheKey = null;
        };

        return StarFieldLayer;

    });