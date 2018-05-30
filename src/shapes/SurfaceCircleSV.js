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
 * @exports SurfaceCircleSV
 */
define(['../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../geom/Matrix',
        '../shapes/ShapeAttributes',
        '../shapes/SurfaceShape',
        '../shaders/SurfaceShapesSVProgram',
        '../geom/Vec3'
    ],
    function (ArgumentError,
              Location,
              Logger,
              Matrix,
              ShapeAttributes,
              SurfaceShape,
              SurfaceShapesSVProgram,
              Vec3) {
        "use strict";

        /**
         * Constructs a surface circle with a specified center and radius and an optional attributes bundle.
         * @alias SurfaceCircleSV
         * @constructor
         * @augments SurfaceShape
         * @classdesc Represents a circle draped over the terrain surface.
         * <p>
         *     SurfaceCircleSV uses the following attributes from its associated shape attributes bundle:
         *     <ul>
         *         <li>Draw interior</li>
         *         <li>Draw outline</li>
         *         <li>Interior color</li>
         *         <li>Outline color</li>
         *         <li>Outline width</li>
         *         <li>Outline stipple factor</li>
         *         <li>Outline stipple pattern</li>
         *     </ul>
         * @param {Location} center The circle's center location.
         * @param {Number} radius The circle's radius in meters.
         * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
         * attributes must be set directly before the shape is drawn.
         * @throws {ArgumentError} If the specified center location is null or undefined or the specified radius
         * is negative.
         */
        var SurfaceCircleSV = function (center, radius, attributes) {
            if (!center) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceCircleSV", "constructor", "missingLocation"));
            }

            if (radius < 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceCircleSV", "constructor", "Radius is negative"));
            }

            SurfaceShape.call(this, attributes);

            // All these are documented with their property accessors below.
            this._center = center;
            this._radius = radius;
            this._intervals = SurfaceCircleSV.DEFAULT_NUM_INTERVALS;

            // Specific properties for shadow volume rendering

            this._vertexArray;

            this._elementArray;

            this._vboCacheKey;

            this._elementCacheKey;

            this._programCacheKey;

            this._topAttrs = {};

            this._bottomAttrs = {};

            this._sidesAttrs = {};

            this._centerPoint = new Vec3();
        };

        SurfaceCircleSV.prototype = Object.create(SurfaceShape.prototype);

        Object.defineProperties(SurfaceCircleSV.prototype, {
            /**
             * This shape's center location.
             * @memberof SurfaceCircleSV.prototype
             * @type {Location}
             */
            center: {
                get: function () {
                    return this._center;
                },
                set: function (value) {
                    this.reset();
                    this._center = value;
                }
            },

            /**
             * This shape's radius, in meters.
             * @memberof SurfaceCircleSV.prototype
             * @type {Number}
             */
            radius: {
                get: function () {
                    return this._radius;
                },
                set: function (value) {
                    this.reset();
                    this._radius = value;
                }
            },

            /**
             * The number of intervals to generate locations for.
             * @type {Number}
             * @memberof SurfaceCircleSV.prototype
             * @default SurfaceCircleSV.DEFAULT_NUM_INTERVALS
             */
            intervals: {
                get: function () {
                    return this._intervals;
                },
                set: function (value) {
                    this.reset();
                    this._intervals = value;
                }
            }
        });

        SurfaceCircleSV.prototype.render = function (dc) {
            var vbo, ebo, program, scratchMatrix = SurfaceCircleSV.MATRIX,
                transformationMatrix = SurfaceCircleSV.MATRIX2, gl = dc.currentGlContext;
            if (!this.enabled) {
                return;
            }

            if (!this._vertexArray) {
                this.assembleVertexArray(dc);
                this.assembleElementArray(dc);
            }

            // Reset/Instantiate gl resource cache keys
            if (!this._vboCacheKey) {
                this._vboCacheKey = "SurfaceCircleSVVBO" + SurfaceCircleSV.CACHE_ID++;
            }

            if (!this._elementCacheKey) {
                this._elementCacheKey = "SurfaceCircleSVElementArray" + SurfaceCircleSV.CACHE_ID++;
            }

            if (!this._programCacheKey) {
                this._programCacheKey = "SurfaceCircleSVProgram" + SurfaceCircleSV.CACHE_ID++;
            }

            vbo = dc.gpuResourceCache.resourceForKey(this._vboCacheKey);
            if (!vbo) {
                vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferData(gl.ARRAY_BUFFER, this._vertexArray, gl.STATIC_DRAW);
                dc.gpuResourceCache.putResource(this._vboCacheKey, vbo, this._vertexArray.length * 4);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            }

            ebo = dc.gpuResourceCache.resourceForKey(this._elementCacheKey);
            if (!ebo) {
                ebo = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._elementArray, gl.STATIC_DRAW);
                dc.gpuResourceCache.putResource(this._elementCacheKey, ebo, this._elementArray.length * 2);
            } else {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
            }

            program = dc.gpuResourceCache.resourceForKey(this._programCacheKey);
            if (!program) {
                program = new SurfaceShapesSVProgram(gl);
                dc.bindProgram(program);
                dc.gpuResourceCache.putResource(this._programCacheKey, program, program.size);
            } else {
                dc.bindProgram(program);
            }

            // setup the mvp matrix
            transformationMatrix.setToIdentity();
            transformationMatrix.setToTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
            scratchMatrix.copy(dc.modelviewProjection);
            scratchMatrix.multiplyMatrix(transformationMatrix);
            program.loadModelviewProjection(gl, scratchMatrix);
            var attributes = (this._highlighted ? (this._highlightAttributes || this._attributes) : this._attributes);
            if (!attributes) {
                return;
            }
            program.loadColor(gl, attributes.interiorColor);

            gl.enableVertexAttribArray(program.posLocation);
            gl.vertexAttribPointer(program.posLocation, 3, gl.FLOAT, false, 3 * 4, 0);

            this.drawVolume(dc);

            gl.disableVertexAttribArray(program.posLocation);

        };

        SurfaceCircleSV.prototype.drawVolume = function (dc) {
            var gl = dc.currentGlContext, boundaryCount = this._boundaries.length, top = this._topAttrs,
                bottom = this._bottomAttrs, sides = this._sidesAttrs;

            // top
            gl.drawElements(gl.TRIANGLE_FAN, top.count, gl.UNSIGNED_SHORT, top.offset * 2);

            // bottom
            gl.drawElements(gl.TRIANGLE_FAN, bottom.count, gl.UNSIGNED_SHORT, bottom.offset * 2);

            // sides
            gl.drawElements(gl.TRIANGLE_STRIP, sides.count, gl.UNSIGNED_SHORT, sides.offset * 2);
        };

        SurfaceCircleSV.prototype.assembleVertexArray = function (dc) {
            var upperLimit = 100000, lowerLimit = -5000, idx = 0, loc, point = SurfaceCircleSV.POINT;

            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, upperLimit, this._centerPoint);

            this.computeBoundaries(dc);

            this._vertexArray = new Float32Array((2 + this._boundaries.length * 2) * 3); // the middle two coordinates plus the exterior

            // let's start with the top center and bottom center, then top and bottom rim
            this._vertexArray[idx++] = 0;
            this._vertexArray[idx++] = 0;
            this._vertexArray[idx++] = 0;
            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, lowerLimit, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];

            for (var i = 0, len = this._boundaries.length; i < len; i++) {
                loc = this._boundaries[i];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, upperLimit, point);
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, lowerLimit, point);
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            }
        };

        SurfaceCircleSV.prototype.assembleElementArray = function (dc) {
            // build an element buffer the triangle strip which makes up the sides
            var boundarySize = this._boundaries.length, capSize = boundarySize + 1, sideSize = boundarySize * 2,
                idx = 0, i;
            this._elementArray = new Int16Array(2 * capSize + sideSize);

            // top cap - fan
            this._topAttrs.offset = 0;
            this._elementArray[idx++] = 0;
            for (i = 0; i < boundarySize; i++) {
                this._elementArray[idx++] = 2 * (boundarySize - i);
            }
            this._topAttrs.count = boundarySize + 1;

            // bottom cap - fan
            this._bottomAttrs.offset = this._topAttrs.count;
            this._elementArray[idx++] = 1;
            for (i = 0; i < boundarySize; i++) {
                this._elementArray[idx++] = 2 * i + 3;
            }
            this._bottomAttrs.count = boundarySize + 1;

            // sides - triangle strip
            this._sidesAttrs.offset = 2 * (boundarySize + 1);
            for (i = 1; i <= boundarySize; i++) {
                this._elementArray[idx++] = i * 2 + 1;
                this._elementArray[idx++] = i * 2;
            }
            this._sidesAttrs.count = boundarySize * 2;
        };

        // Internal use only. Intentionally not documented.
        SurfaceCircleSV.staticStateKey = function (shape) {
            var shapeStateKey = SurfaceShape.staticStateKey(shape);

            return shapeStateKey +
                " ce " + shape.center.toString() +
                " ra " + shape.radius.toString();
        };

        // Internal use only. Intentionally not documented.
        SurfaceCircleSV.prototype.computeStateKey = function () {
            return SurfaceCircleSV.staticStateKey(this);
        };

        // Internal. Intentionally not documented.
        SurfaceCircleSV.prototype.computeBoundaries = function (dc) {
            if (this.radius === 0) {
                return null;
            }

            var numLocations = 1 + Math.max(SurfaceCircleSV.MIN_NUM_INTERVALS, this.intervals),
                da = 360 / (numLocations - 1),
                arcLength = this.radius / dc.globe.radiusAt(this.center.latitude, this.center.longitude);

            this._boundaries = new Array(numLocations);

            for (var i = 0; i < numLocations; i++) {
                var azimuth = (i !== numLocations - 1) ? (i * da) : 0;
                this._boundaries[i] = Location.greatCircleLocation(
                    this.center,
                    azimuth,   // In degrees
                    arcLength, // In radians
                    new Location(0, 0)
                );
            }
        };

        // Internal use only. Intentionally not documented.
        SurfaceCircleSV.prototype.getReferencePosition = function () {
            return this.center;
        };

        // Internal use only. Intentionally not documented.
        SurfaceCircleSV.prototype.moveTo = function (globe, position) {
            this.center = position;
        };

        SurfaceCircleSV.prototype.reset = function () {
            this._vertexArray = null;
            this._vboCacheKey = null;
            this._elementCacheKey = null;
        };

        /**
         * The minimum number of intervals the circle generates.
         * @type {Number}
         */
        SurfaceCircleSV.MIN_NUM_INTERVALS = 8;

        /**
         * The default number of intervals the circle generates.
         * @type {Number}
         */
        SurfaceCircleSV.DEFAULT_NUM_INTERVALS = 64;

        SurfaceCircleSV.CACHE_ID = 0;

        SurfaceCircleSV.POINT = new Vec3();

        SurfaceCircleSV.MATRIX = new Matrix();

        SurfaceCircleSV.MATRIX2 = new Matrix();

        return SurfaceCircleSV;
    });
