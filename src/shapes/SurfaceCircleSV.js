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

            this._interiorElements = {};

            this._outlineElements = {};

            this._centerPoint = new Vec3();

            this.activeTexture = null;

            var canvas = document.createElement('canvas');
            canvas.setAttribute('width', 16);
            canvas.setAttribute('height', 16);
            var ctx2d = canvas.getContext('2d');

            // clear it all
            ctx2d.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx2d.fillRect(0, 0, 16, 16);

            ctx2d.fillStyle = 'rgba(255, 255, 255, 1.0)';
            ctx2d.fillRect(0, 0, 8, 16);
            ctx2d.fillRect(10, 0, 4, 16);



            document.getElementsByTagName('body')[0].appendChild(canvas);

            this.outlineStippleImageSource = new WorldWind.ImageSource(canvas);
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

        SurfaceCircleSV.prototype.getActiveTexture = function (dc) {
            return dc.gpuResourceCache.resourceForKey(this.outlineStippleImageSource);
        };

        SurfaceCircleSV.prototype.render = function (dc) {
            var vbo, ebo, program, scratchMatrix = SurfaceCircleSV.MATRIX, p = SurfaceCircleSV.POINT,
                transformationMatrix = SurfaceCircleSV.MATRIX2, gl = dc.currentGlContext, sector, attributes;
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

            this.activeTexture = this.getActiveTexture(dc);
            if (!this.activeTexture) {
                this.activeTexture = dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this.outlineStippleImageSource);
                if (!this.activeTexture) {
                    return null;
                }
            }

            // Establish drawing constant properties to be loaded into shader
            // eye point relative to center
            p.copy(dc.eyePoint);
            p.subtract(this._centerPoint);
            // setup the mvp matrix
            transformationMatrix.setToIdentity();
            transformationMatrix.setToTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
            scratchMatrix.copy(dc.modelviewProjection);
            scratchMatrix.multiplyMatrix(transformationMatrix);

            program = dc.findAndBindProgram(SurfaceShapesSVProgram);
            program.loadEyePosition(gl, p);
            program.loadModelviewProjection(gl, scratchMatrix);
            program.loadPixelSizeFactor(gl, dc.pixelSizeFactor);
            program.loadPixelSizeOffset(gl, dc.pixelSizeOffset);
            program.loadCameraAltitude(gl, dc.eyePosition.altitude);
            program.loadTextureUnit(gl, gl.TEXTURE0);

            gl.enableVertexAttribArray(program.posLocation);
            gl.enableVertexAttribArray(program.prevPosLocation);
            gl.enableVertexAttribArray(program.nextPosLocation);
            gl.enableVertexAttribArray(program.directionLocation);

            this.beginStencilTest(dc);

            attributes = (this._highlighted ? (this._highlightAttributes || this._attributes) : this._attributes);
            if (!attributes) {
                return;
            }

            if (attributes.drawInterior) {
                program.loadColor(gl, attributes.interiorColor);
                program.loadOutlineWidth(gl, 0); // prevents offset of vertex
                program.loadTextureEnabled(gl, false);

                this.setInteriorVertexAttribPointers(dc);

                this.prepareStencil(dc);
                gl.drawElements(gl.TRIANGLES, this._interiorElements.elementCount, gl.UNSIGNED_SHORT, 0);

                this.applyStencilTest(dc);
                gl.drawElements(gl.TRIANGLES, this._interiorElements.elementCount, gl.UNSIGNED_SHORT, 0);
            }

            if (attributes.drawOutline) {
                program.loadColor(gl, attributes.outlineColor);
                program.loadStippleFactor(gl, attributes.outlineStippleFactor || 1);
                program.loadOutlineWidth(gl, attributes.outlineWidth);

                this.setOutlineVertexAttribPointers(dc);

                this.prepareStencil(dc);
                gl.drawElements(gl.TRIANGLES, this._outlineElements.elementCount, gl.UNSIGNED_SHORT, this._outlineElements.elementOffset);

                this.applyStencilTest(dc);

                if (attributes.outlineStippleFactor && this.activeTexture.bind(dc)) {
                    program.loadTextureEnabled(gl, true);
                    program.loadOutlineWidth(gl, attributes.outlineWidth * 10);
                    this.setTextureWrapAndFilter(dc);
                    gl.frontFace(gl.CW);
                    gl.drawElements(gl.TRIANGLES, this._outlineElements.elementCount, gl.UNSIGNED_SHORT, this._outlineElements.elementOffset);
                    program.loadTextureEnabled(gl, false);
                    gl.frontFace(gl.CCW);
                } else {
                    gl.drawElements(gl.TRIANGLES, this._outlineElements.elementCount, gl.UNSIGNED_SHORT, this._outlineElements.elementOffset);
                }
            }

            this.endStencilTest(dc);

            if (this.debug) {
                this.drawDebug(dc, attributes);
            }

            gl.disableVertexAttribArray(program.posLocation);
            gl.disableVertexAttribArray(program.prevPosLocation);
            gl.disableVertexAttribArray(program.nextPosLocation);
            gl.disableVertexAttribArray(program.directionLocation);
        };

        SurfaceCircleSV.prototype.setInteriorVertexAttribPointers = function (dc) {
            var gl = dc.currentGlContext, program = dc.currentProgram;

            gl.vertexAttribPointer(program.posLocation, 3, gl.FLOAT, false, this._interiorElements.stride, this._interiorElements.posOffset);
            // the following attribute pointers don't matter during interior drawing
            gl.vertexAttribPointer(program.prevPosLocation, 3, gl.FLOAT, false, 0, 0);
            gl.vertexAttribPointer(program.nextPosLocation, 3, gl.FLOAT, false, 0, 0);
            gl.vertexAttribPointer(program.directionLocation, 1, gl.FLOAT, false, 0, 0);
        };

        SurfaceCircleSV.prototype.setOutlineVertexAttribPointers = function (dc) {
            var gl = dc.currentGlContext, program = dc.currentProgram;

            gl.vertexAttribPointer(program.posLocation, 3, gl.FLOAT, false, this._outlineElements.stride, this._outlineElements.posOffset);
            gl.vertexAttribPointer(program.prevPosLocation, 3, gl.FLOAT, false, this._outlineElements.stride, this._outlineElements.prevOffset);
            gl.vertexAttribPointer(program.nextPosLocation, 3, gl.FLOAT, false, this._outlineElements.stride, this._outlineElements.nextOffset);
            gl.vertexAttribPointer(program.directionLocation, 1, gl.FLOAT, false, this._outlineElements.stride, this._outlineElements.directionOffset);
        };

        SurfaceCircleSV.prototype.setTextureWrapAndFilter = function (dc) {
            var gl = dc.currentGlContext;

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        };

        SurfaceCircleSV.prototype.drawDebug = function (dc, attributes) {
            var gl = dc.currentGlContext, program = dc.currentProgram;

            var p = SurfaceCircleSV.POINT;
            p.copy(dc.eyePoint);
            p.subtract(this._centerPoint);

            program.loadColor(gl, new Color(1, 1, 1, 0.5));
            program.loadOutlineWidth(gl, 0);
            program.loadPixelSizeFactor(gl, dc.pixelSizeFactor);
            program.loadPixelSizeOffset(gl, dc.pixelSizeOffset);
            program.loadEyePosition(gl, p);

            this.setInteriorVertexAttribPointers(dc);

            gl.drawElements(gl.LINE_STRIP, 12, gl.UNSIGNED_SHORT, 0);

            program.loadColor(gl, new Color(0, 1, 1, 0.5));
            program.loadOutlineWidth(gl, attributes.outlineWidth);
            program.loadPixelSizeFactor(gl, dc.pixelSizeFactor);
            program.loadPixelSizeOffset(gl, dc.pixelSizeOffset);
            program.loadEyePosition(gl, p);

            this.setOutlineVertexAttribPointers(dc);
            gl.disable(gl.CULL_FACE);
            gl.drawElements(gl.TRIANGLES, this._outlineElements.elementCount, gl.UNSIGNED_SHORT, this._outlineElements.elementOffset);
            gl.enable(gl.CULL_FACE);
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
            var verticalLimits = this.calculateVolumeVerticalLimits(dc),
                idx = 0, loc, i,
                point = SurfaceCircleSV.POINT,
                lastPoint = SurfaceCircleSV.POINT2,
                boundaryLength = this._boundaries.length,
                outlinePathLength = 0,
                lastPathLength = 0,
                // the this._boundaries array includes duplicate start/stop locations for surface circle
                vertices = (boundaryLength /*exterior*/ + 2 /*outline wrap*/)
                    * (4 /*4 verts per point(top x2, bottom x2*/ * 4 /*x, y, z, direction*/)
                    + (2 /*center top and bottom*/ * 4 /*x, y, z, direction*/);

            this._vertexArray = new Float32Array(vertices);

            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, 0, this._centerPoint);

            // Start with the bottom center, then top center, then bottom and top rim.
            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, verticalLimits.min, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // normal placeholder (not used, maintains vertex stride only)
            dc.globe.computePointFromPosition(this.center.latitude, this.center.longitude, verticalLimits.max, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // normal placeholder (not used, for vertex stride only)

            // Iterate through the boundaries storing relative to center coordinates - the boundaries includes a
            // duplicate closing location. Start at the penultimate location to build the offset direction control
            // point. Work from bottom outside point, to bottom inside, to top outside, and top inside. The control
            // points (start and end) only require two vertices for calculation, but to maintain stride values, they are
            // duplicated two times to produce the unneeded inside and outside points.
            loc = this._boundaries[boundaryLength - 2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, verticalLimits.min, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, verticalLimits.max, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation

            // Iterate through the generated boundary points, including the duplicate start/end point.
            for (i = 0; i < boundaryLength; i++) {
                loc = this._boundaries[i];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, verticalLimits.min, point);
                if (i > 0) {
                    lastPathLength = point.distanceTo(lastPoint);
                    outlinePathLength += lastPathLength;
                }
                // the outline path length value is signed to indicate vertex direction when volume is scaled
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = outlinePathLength;
                // duplicate vertex used for outline
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = -outlinePathLength;
                // set the last point
                lastPoint.copy(point);
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, verticalLimits.max, point);
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = outlinePathLength;
                // duplicate vertex used for outline
                this._vertexArray[idx++] = point[0] - this._centerPoint[0];
                this._vertexArray[idx++] = point[1] - this._centerPoint[1];
                this._vertexArray[idx++] = point[2] - this._centerPoint[2];
                this._vertexArray[idx++] = -outlinePathLength;
            }

            // Add a duplicate second boundary point vertex positions to provide the end control point
            loc = this._boundaries[1];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, verticalLimits.min, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, verticalLimits.max, point);
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation
            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];
            this._vertexArray[idx++] = 0; // doesn't matter, only the position is used for outline direction calculation

            if (this.debug) {
                console.log("The maximum vertex index filled: " + (idx - 1) + " and the array size: " + this._vertexArray.length);
            }
        };

        SurfaceCircleSV.prototype.calculateVolumeVerticalLimits = function (dc) {
            // TODO upper and lower limit defined by circle size
            return {min: -11000, max: 80000};
        };

        SurfaceCircleSV.prototype.assembleElementArray = function (dc) {
            // build an element buffer describing the triangles used to form the volume and volume wall
            var boundarySize = this._boundaries.length,
                slices = boundarySize - 1,
                idx = 0, i, offset,
                interiorElements = slices * 4 /*triangles*/ * 3 /*vertices per triangle*/, // including top, side, and bottom
                outlineElements = slices * 8 /*triangles*/ * 3 /*vertices per triangle*/;

            this._elementArray = new Int16Array(interiorElements + outlineElements);

            this._interiorElements.elementCount = interiorElements;
            this._interiorElements.elementOffset = 0;
            this._interiorElements.stride = 4 /*components*/ * 4 /*size of one float in bytes*/;
            this._interiorElements.posOffset = 0;

            this._outlineElements.elementCount = outlineElements;
            this._outlineElements.elementOffset = interiorElements * 2;
            this._outlineElements.stride = 4 /*components*/ * 4 /*size of one float in bytes*/;
            this._outlineElements.posOffset = SurfaceCircleSV.BOUNDARY_OFFSET_BYTES + 4 /*components*/ * 4 /*vertices*/ * 4 /*size of one float in bytes*/;
            this._outlineElements.prevOffset = SurfaceCircleSV.BOUNDARY_OFFSET_BYTES;
            this._outlineElements.nextOffset = SurfaceCircleSV.BOUNDARY_OFFSET_BYTES + 4 /*components*/ * 8 /*vertices*/ * 4 /*size of one float in bytes*/;
            this._outlineElements.directionOffset = SurfaceCircleSV.BOUNDARY_OFFSET_BYTES + 4 /*components*/ * 4 /*vertices*/ * 4 /*size of one float in bytes*/ + 3 * 4 /*offset into the vertex to get the direction*/;

            // Generate the triangles for displaying the interior of a circle. Each slice has a triangle on the top, one
            // on the bottom, and two making up the outside. The interior isn't subject to scaling, so it does not
            // matter whether the interior or exterior points are used. For consistency, the interior ones are used.
            for (i = 0; i < slices; i++) {
                offset = i * 4;
                // bottom
                this._elementArray[idx++] = 0;
                this._elementArray[idx++] = 7 + offset;
                this._elementArray[idx++] = 11 + offset;
                // top
                this._elementArray[idx++] = 1;
                this._elementArray[idx++] = 13 + offset;
                this._elementArray[idx++] = 9 + offset;
                // top side
                this._elementArray[idx++] = 9 + offset;
                this._elementArray[idx++] = 13 + offset;
                this._elementArray[idx++] = 7 + offset;
                // bottom side
                this._elementArray[idx++] = 11 + offset;
                this._elementArray[idx++] = 7 + offset;
                this._elementArray[idx++] = 13 + offset;
            }

            if (this.debug) {
                console.log("The maximum interior index filled: " + (idx - 1) + " and the declared array size: " + this._elementArray.length);
                var maximumIndex = -Number.MAX_VALUE;
                this._elementArray.forEach(function (value) {
                    maximumIndex = Math.max(value, maximumIndex);
                });
                console.log("The largest index found: " + maximumIndex + " and the largest index possible: " + (this._vertexArray.length / 4 - 1));
            }

            // Generate the triangles for displaying a scalable, conforming volume to the outline of the surface circle.
            // Note that the indexes do not match the vertices described for the interior volume due to the two center
            // points being skipped.
            var startIdx = idx;
            for (i = 0; i < slices; i++) {
                offset = i * 4;
                // interior top triangle
                this._elementArray[idx++] = 3 + offset;
                this._elementArray[idx++] = 5 + offset;
                this._elementArray[idx++] = 7 + offset;
                // interior bottom triangle
                this._elementArray[idx++] = 5 + offset;
                this._elementArray[idx++] = 3 + offset;
                this._elementArray[idx++] = 1 + offset;
                // top inner triangle
                this._elementArray[idx++] = 6 + offset;
                this._elementArray[idx++] = 3 + offset;
                this._elementArray[idx++] = 7 + offset;
                // top outer triangle
                this._elementArray[idx++] = 3 + offset;
                this._elementArray[idx++] = 6 + offset;
                this._elementArray[idx++] = 2 + offset;
                // exterior top triangle
                this._elementArray[idx++] = 4 + offset;
                this._elementArray[idx++] = 2 + offset;
                this._elementArray[idx++] = 6 + offset;
                // exterior bottom triangle
                this._elementArray[idx++] = 2 + offset;
                this._elementArray[idx++] = 4 + offset;
                this._elementArray[idx++] = offset;
                // bottom inner triangle
                this._elementArray[idx++] = 1 + offset;
                this._elementArray[idx++] = 4 + offset;
                this._elementArray[idx++] = 5 + offset;
                // bottom outer triangle
                this._elementArray[idx++] = 4 + offset;
                this._elementArray[idx++] = 1 + offset;
                this._elementArray[idx++] = offset;
            }

            if (this.debug) {
                console.log("The maximum index filled: " + (idx - 1) + " and the array size: " + this._elementArray.length);
                var maximumIndex = -Number.MAX_VALUE;
                this._elementArray.forEach(function (value, index) {
                    if (index >= startIdx) {
                        maximumIndex = Math.max(value, maximumIndex);
                    }
                });
                console.log("The largest index found: " + (maximumIndex + 2) + " and the largest index possible: " + (this._vertexArray.length / 4 - 1));
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
        SurfaceCircleSV.MIN_NUM_INTERVALS = 4;

        /**
         * The default number of intervals the circle generates.
         * @type {Number}
         */
        SurfaceCircleSV.DEFAULT_NUM_INTERVALS = 4;

        SurfaceCircleSV.CACHE_ID = 0;

        SurfaceCircleSV.POINT = new Vec3();

        SurfaceCircleSV.POINT2 = new Vec3();

        SurfaceCircleSV.MATRIX = new Matrix();

        SurfaceCircleSV.MATRIX2 = new Matrix();

        SurfaceCircleSV.BOUNDARY_OFFSET_BYTES = 2 /*vertices*/ * 4 /*x, y, z, direction*/ * 4 /*size of byte*/;

        return SurfaceCircleSV;
    });
