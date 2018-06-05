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
        '../util/Color',
        '../geom/Location',
        '../util/Logger',
        '../geom/Matrix',
        '../geom/Sector',
        '../shapes/ShapeAttributes',
        '../shapes/SurfaceShape',
        '../shaders/SurfaceShapesSVProgram',
        '../geom/Vec3'
    ],
    function (ArgumentError,
              Color,
              Location,
              Logger,
              Matrix,
              Sector,
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

            this._interiorElements;

            this._outlineElements;

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
                transformationMatrix = SurfaceCircleSV.MATRIX2, gl = dc.currentGlContext, sector;
            if (!this.enabled) {
                return;
            }

            if (!this._boundaries) {
                this.computeBoundaries(dc);
            }

            if (!this.currentData) {
                this.currentData = {};
            }

            if (this._sectors.length === 0) {
                sector = new Sector();
                sector.setToBoundingSector(this._boundaries);
                this._sectors.push(sector);
                this.computeExtent(dc);
            }

            if (!this.intersectsFrustum(dc)) {
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

            program = dc.findAndBindProgram(SurfaceShapesSVProgram);

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

            gl.enableVertexAttribArray(program.posLocation);
            gl.enableVertexAttribArray(program.prevPosLocation);
            gl.enableVertexAttribArray(program.nextPosLocation);
            gl.enableVertexAttribArray(program.directionLocation);

            this.beginStencilTest(dc);

            if (attributes.drawInterior) {
                program.loadColor(gl, attributes.interiorColor);
                program.loadScaleSize(gl, 0); // don't need to calculate the offset for drawing the interior

                gl.vertexAttribPointer(program.posLocation, 3, gl.FLOAT, false, 8 * 4, 0);
                gl.vertexAttribPointer(program.prevPosLocation, 3, gl.FLOAT, false, 0, 0);
                gl.vertexAttribPointer(program.nextPosLocation, 3, gl.FLOAT, false, 0, 32 * 4);
                gl.vertexAttribPointer(program.directionLocation, 1, gl.FLOAT, false, 0, 19 * 4);

                this.drawInterior(dc);
            }

            if (attributes.drawOutline) {
                program.loadColor(gl, attributes.outlineColor);
                program.loadScaleSize(gl, attributes.outlineWidth * 10000);

                gl.vertexAttribPointer(program.posLocation, 3, gl.FLOAT, false, 4 * 4, 16 * 4);
                gl.vertexAttribPointer(program.prevPosLocation, 3, gl.FLOAT, false, 4 * 4, 0);
                gl.vertexAttribPointer(program.nextPosLocation, 3, gl.FLOAT, false, 4 * 4, 32 * 4);
                gl.vertexAttribPointer(program.directionLocation, 1, gl.FLOAT, false, 4 * 4, 19 * 4);

                this.drawOutline(dc);
            }

            this.endStencilTest(dc);

            if (this.debug) {
                this.drawDebug(dc, attributes.outlineWidth);
            }

            gl.disableVertexAttribArray(program.posLocation);
            gl.disableVertexAttribArray(program.prevPosLocation);
            gl.disableVertexAttribArray(program.nextPosLocation);
            gl.disableVertexAttribArray(program.directionLocation);
        };

        SurfaceCircleSV.prototype.drawInterior = function (dc) {
            var gl = dc.currentGlContext;

            this.prepareStencil(dc);
            gl.drawElements(gl.TRIANGLES, this._interiorElements, gl.UNSIGNED_SHORT, 0);

            this.applyStencilTest(dc);
            gl.drawElements(gl.TRIANGLES, this._interiorElements, gl.UNSIGNED_SHORT, 0);
        };

        SurfaceCircleSV.prototype.drawOutline = function (dc) {
            var gl = dc.currentGlContext;

            this.prepareStencil(dc);
            gl.drawElements(gl.TRIANGLES, this._outlineElements, gl.UNSIGNED_SHORT, 2 * this._interiorElements);

            this.applyStencilTest(dc);
            gl.drawElements(gl.TRIANGLES, this._outlineElements, gl.UNSIGNED_SHORT, 2 * this._interiorElements);
        };

        SurfaceCircleSV.prototype.drawDebug = function (dc, outlineWidth) {
            var gl = dc.currentGlContext, program = dc.currentProgram;

            program.loadColor(gl, Color.WHITE);
            program.loadScaleSize(gl, 0); // don't need to calculate the offset for drawing the interior

            gl.vertexAttribPointer(program.posLocation, 3, gl.FLOAT, false, 8 * 4, 0);
            gl.vertexAttribPointer(program.prevPosLocation, 3, gl.FLOAT, false, 0, 0);
            gl.vertexAttribPointer(program.nextPosLocation, 3, gl.FLOAT, false, 0, 32 * 4);
            gl.vertexAttribPointer(program.directionLocation, 1, gl.FLOAT, false, 0, 19 * 4);

            gl.drawElements(gl.LINE_STRIP, this._interiorElements, gl.UNSIGNED_SHORT, 0);

            program.loadColor(gl, Color.GREEN);
            program.loadScaleSize(gl, outlineWidth * 10000);

            gl.vertexAttribPointer(program.posLocation, 3, gl.FLOAT, false, 4 * 4, 16 * 4);
            gl.vertexAttribPointer(program.prevPosLocation, 3, gl.FLOAT, false, 4 * 4, 0);
            gl.vertexAttribPointer(program.nextPosLocation, 3, gl.FLOAT, false, 4 * 4, 32 * 4);
            gl.vertexAttribPointer(program.directionLocation, 1, gl.FLOAT, false, 4 * 4, 19 * 4);

            gl.drawElements(gl.LINE_STRIP, this._outlineElements, gl.UNSIGNED_SHORT, 2 * this._interiorElements);
        };

        SurfaceCircleSV.prototype.beginStencilTest = function (dc) {
            var gl = dc.currentGlContext;

            // Setup the stencil including disabling drawing to the scene
            gl.depthMask(false);
            gl.enable(gl.STENCIL_TEST);
            gl.disable(gl.CULL_FACE);
        };

        SurfaceCircleSV.prototype.prepareStencil = function (dc) {
            var gl = dc.currentGlContext;

            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.stencilFunc(gl.ALWAYS, 0, 255);
            gl.enable(gl.DEPTH_TEST);
            gl.colorMask(false, false, false, false);

            // z-fail
            gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.DECR_WRAP, gl.KEEP);
            gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.INCR_WRAP, gl.KEEP);
        };

        SurfaceCircleSV.prototype.applyStencilTest = function (dc) {
            var gl = dc.currentGlContext;

            // Enable the scene drawing
            gl.colorMask(true, true, true, true);

            // Apply the stencil test to drawing
            gl.stencilFunc(gl.NOTEQUAL, 0, 255);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.ZERO); // reset stencil to zero after successful fragment modification

            gl.disable(gl.DEPTH_TEST);
        };

        SurfaceCircleSV.prototype.endStencilTest = function (dc) {
            var gl = dc.currentGlContext;

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            // Suspend stencil testing
            gl.disable(gl.STENCIL_TEST);
            gl.depthMask(true);
        };

        SurfaceCircleSV.prototype.assembleVertexArray = function (dc) {
            var limits = this.calculateVolumeVerticalLimit(dc), idx = 0, loc, point = SurfaceCircleSV.POINT,
                boundaryLength = this._boundaries.length, offsetIdx = 32, i,
                vertices = (1 /*center*/ + boundaryLength /*exterior*/ + 2 /*outline wrap*/)
                    * (4 /*4 verts per point(top x2, bottom x2*/ * 4 /*x, y, z, direction*/);

            this._vertexArray = new Float32Array(vertices);

            // let's start with the bottom center, then top center, then bottom and top rim
            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, 0, this._centerPoint);
            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, limits.min, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // normal placeholder (not used, for vertex stride only)
            // duplicate vertex used for outline (not used, for vertex stride only)
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // normal placeholder (not used, for vertex stride only)
            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, limits.max, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // normal placeholder (not used, for vertex stride only)
            // duplicate vertex used for outline (not used, for vertex stride only)
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // normal placeholder (not used, for vertex stride only)

            // iterate through the boundaries storing relative to center coordinates
            for (i = 0; i < boundaryLength; i++) {
                loc = this._boundaries[i];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, limits.min, point);
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = 0.5; // normal placeholder
                // duplicate vertex used for outline
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = -0.5; // normal placeholder
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, limits.max, point);
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = 0.5; // normal placeholder
                // duplicate vertex used for outline
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = -0.5; // normal placeholder
            }

            // repeat the second two slices for use by the normal interpolation technique
            for (i = 0; i < 8; i++) {
                this._vertexArray[idx++] = this._vertexArray[offsetIdx++];
                this._vertexArray[idx++] = this._vertexArray[offsetIdx++];
                this._vertexArray[idx++] = this._vertexArray[offsetIdx++];
                this._vertexArray[idx++] = this._vertexArray[offsetIdx++];
            }
        };

        SurfaceCircleSV.prototype.calculateVolumeVerticalLimit = function (dc) {
            // TODO upper and lower limit defined by circle size
            return {min: -11000, max: 80000};
        };

        SurfaceCircleSV.prototype.assembleElementArray = function (dc) {
            // build an element buffer describing the triangles used to form the volume and volume wall
            var boundarySize = this._boundaries.length, slices = boundarySize - 1, idx = 0, i, offset,
                interiorElements = slices * 4 * 3, outlineElements = slices * 8 * 3;

            this._elementArray = new Int16Array(interiorElements + outlineElements);
            this._interiorElements = interiorElements;
            this._outlineElements = outlineElements;

            for (i = 0; i < slices; i++) {
                offset = i * 2;
                // bottom
                this._elementArray[idx++] = 0;
                this._elementArray[idx++] = 2 + offset;
                this._elementArray[idx++] = 4 + offset;
                // top
                this._elementArray[idx++] = 1;
                this._elementArray[idx++] = 5 + offset;
                this._elementArray[idx++] = 3 + offset;
                // top side
                this._elementArray[idx++] = 3 + offset;
                this._elementArray[idx++] = 5 + offset;
                this._elementArray[idx++] = 4 + offset;
                // bottom side
                this._elementArray[idx++] = 4 + offset;
                this._elementArray[idx++] = 2 + offset;
                this._elementArray[idx++] = 3 + offset;
            }

            // the shadow volume "wall" to provide the outline
            for (i = 0; i < (slices + 1); i++) {
                offset = i * 4;
                this._elementArray[idx++] = 5 + offset;
                this._elementArray[idx++] = 9 + offset;
                this._elementArray[idx++] = 11 + offset;
                this._elementArray[idx++] = 11 + offset;
                this._elementArray[idx++] = 7 + offset;
                this._elementArray[idx++] = 5 + offset;
                this._elementArray[idx++] = 7 + offset;
                this._elementArray[idx++] = 11 + offset;
                this._elementArray[idx++] = 10 + offset;
                this._elementArray[idx++] = 10 + offset;
                this._elementArray[idx++] = 6 + offset;
                this._elementArray[idx++] = 7 + offset;
                this._elementArray[idx++] = 6 + offset;
                this._elementArray[idx++] = 10 + offset;
                this._elementArray[idx++] = 8 + offset;
                this._elementArray[idx++] = 8 + offset;
                this._elementArray[idx++] = 4 + offset;
                this._elementArray[idx++] = 6 + offset;
                this._elementArray[idx++] = 4 + offset;
                this._elementArray[idx++] = 8 + offset;
                this._elementArray[idx++] = 9 + offset;
                this._elementArray[idx++] = 9 + offset;
                this._elementArray[idx++] = 5 + offset;
                this._elementArray[idx++] = 4 + offset;
            }
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
            this._elementArray = null;
            this._vboCacheKey = null;
            this._elementCacheKey = null;
            this._boundaries = null;
            this._sectors = [];
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
