/**
 * Created by Florin on 12/22/2016.
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

        var StarFieldLayer = function () {
            Layer.call(this, 'StarField');

            this.pickEnabled = false;

            this._date = new Date();
            this._positions = [];
            this._matrix = Matrix.fromIdentity();
            this._positionsVboCacheKey = null;

            this._starData = null;
            this._loadStarted = false;
        };

        StarFieldLayer.prototype = Object.create(Layer.prototype);

        Object.defineProperties(StarFieldLayer.prototype, {
            date: {
                get: function () {
                    return this._date;
                },
                set: function (value) {
                    this._date = value;
                }
            }
        });

        StarFieldLayer.prototype.doRender = function (dc) {
            if (!this._starData) {
                this.fetchStarData();
                return;
            }

            if (!this._positions.length) {
                this.createGeometry(dc);
            }

            dc.findAndBindProgram(StarFieldProgram);
            var gl = dc.currentGlContext;
            var program = dc.currentProgram;
            var gpuResourceCache = dc.gpuResourceCache;

            //multiplyByScale is necessary until the new camera implementation with the infinite projection matrix
            var eyePoint = dc.navigatorState.eyePoint;
            var position = dc.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], {});
            var altitude = position.altitude * 1.5;
            this._matrix.copy(dc.navigatorState.modelviewProjection);
            this._matrix.multiplyByScale(altitude, altitude, altitude);
            program.loadModelviewProjection(gl, this._matrix);

            var JD = this.julianDate(this._date);
            //this subtraction does not work properly on the GPU, it must be done on the CPU
            //possibly due to precision loss
            //number of days (positive or negative) since Greenwich noon, Terrestrial Time, on 1 January 2000 (J2000.0)
            program.loadJD(gl, JD - 2451545.0);

            if (!this._positionsVboCacheKey) {
                this._positionsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }
            var vboId = gpuResourceCache.resourceForKey(this._positionsVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                gpuResourceCache.putResource(this._positionsVboCacheKey, vboId, this._positions.length * 4);
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._positions), gl.STATIC_DRAW);
            }
            else {
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            }
            dc.frameStatistics.incrementVboLoadCount(1);

            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);

            gl.depthMask(false);

            gl.drawArrays(gl.POINTS, 0, Math.floor(this._positions.length / 4));

            gl.depthMask(true);
        };

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

            xhr.open('GET', './data/stars.json', true);
            xhr.send();
        };

        StarFieldLayer.prototype.createGeometry = function () {
            var data = this._starData.data;
            for (var i = 0, len = data.length; i < len; i++) {
                var starInfo = data[i];
                var dec = starInfo[2]; //for latitude
                var ra = starInfo[1]; //for longitude
                var mag = starInfo[3];
                var pSize = mag < 4 ? 2 : 1;
                this._positions.push(dec, ra, pSize, mag);
            }
        };

        StarFieldLayer.prototype.julianDate = function julianDate(date) {
            //http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html

            //date = date || new Date();
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

        return StarFieldLayer;

    });