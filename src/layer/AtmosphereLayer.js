/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports AtmosphereLayer
 */
define([
        '../error/ArgumentError',
        '../shaders/GroundProgram',
        '../util/ImageSource',
        '../layer/Layer',
        '../util/Logger',
        '../geom/Matrix',
        '../geom/Sector',
        '../shaders/SkyProgram',
        '../geom/Vec3'
    ],
    function (ArgumentError,
              GroundProgram,
              ImageSource,
              Layer,
              Logger,
              Matrix,
              Sector,
              SkyProgram,
              Vec3) {
        "use strict";

        /**
         * Constructs a layer showing the Earth's atmosphere.
         * @alias AtmosphereLayer
         * @constructor
         * @classdesc Provides a layer showing the Earth's atmosphere.
         * @augments Layer
         */
        var AtmosphereLayer = function () {

            Layer.call(this, "Atmosphere");

            this.pickEnabled = false;

            // Internal use only. Intentionally not documented.
            this.skyData = {};

            // Documented in defineProperties below.
            this._skyWidth = 128;

            // Documented in defineProperties below.
            this._skyHeight = 128;

            // Documented in defineProperties below.
            this._skyPoints = null;

            // Documented in defineProperties below.
            this._skyTriStrip = null;
        };

        AtmosphereLayer.prototype = Object.create(Layer.prototype);

        Object.defineProperties(AtmosphereLayer.prototype, {

            /**
             * The number of longitudinal points in the grid.
             * @memberof AtmosphereLayer.prototype
             * @type {Number}
             */
            skyWidth: {
                get: function () {
                    return this._skyWidth;
                },
                set: function (value) {
                    this._skyWidth = value;
                }
            },

            /**
             * The number of latitudinal points in the grid.
             * @memberof AtmosphereLayer.prototype
             * @type {Number}
             */
            skyHeight: {
                get: function () {
                    return this._skyHeight;
                },
                set: function (value) {
                    this._skyHeight = value;
                }
            },

            /**
             * The grid of sky Cartesian points.
             * @memberof AtmosphereLayer.prototype
             * @type {Float32Array}
             */
            skyPoints: {
                get: function () {
                    return this._skyPoints;
                },
                set: function (value) {
                    this._skyPoints = value;
                }
            },

            /**
             * The triangle strip sky indices.
             * @memberof AtmosphereLayer.prototype
             * @type {Number[]}
             */
            skyTriStrip: {
                get: function () {
                    return this._skyTriStrip;
                },
                set: function (value) {
                    this._skyTriStrip = value;
                }
            }
        });

        // Documented in superclass.
        AtmosphereLayer.prototype.doRender = function (dc) {

            this.drawSky(dc);
            this.drawGround(dc);
        };

        // Internal. Intentionally not documented.
        AtmosphereLayer.prototype.applySkyVertices = function (dc) {

            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                skyData = this.skyData,
                vboId;

            if (!skyData.verticesVboCacheKey) {
                skyData.verticesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(skyData.verticesVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(skyData.verticesVboCacheKey, vboId,
                    this.skyPoints.length * 4);
                skyData.refreshVertexBuffer = true;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            if (skyData.refreshVertexBuffer) {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.skyPoints), gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                skyData.refreshVertexBuffer = false;
            }

            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.vertexPointLocation);
        };

        // Internal. Intentionally not documented.
        AtmosphereLayer.prototype.applySkyIndices = function (dc) {

            var gl = dc.currentGlContext,
                skyData = this.skyData,
                vboId;

            if (!skyData.indicesVboCacheKey) {
                skyData.indicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(skyData.indicesVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(skyData.indicesVboCacheKey, vboId, this._skyTriStrip.length * 2);
                skyData.refreshIndicesBuffer = true;
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
            if (skyData.refreshIndicesBuffer) {
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array(this._skyTriStrip), gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                skyData.refreshIndicesBuffer = false;
            }
        };

        // Internal. Intentionally not documented.
        AtmosphereLayer.prototype.drawSky = function (dc) {

            var gl = dc.currentGlContext,
                program = dc.findAndBindProgram(SkyProgram),
                eyePoint = new Vec3(
                    dc.navigatorState.eyePoint[0],
                    dc.navigatorState.eyePoint[1],
                    dc.navigatorState.eyePoint[2]);

            program.loadGlobeRadius(gl, dc.globe.equatorialRadius);

            program.loadEyePoint(gl, dc.navigatorState.eyePoint);

            program.loadVertexOrigin(gl, Vec3.ZERO);

            program.loadModelviewProjection(gl, dc.navigatorState.modelviewProjection);

            program.loadFragMode(gl, program.FRAGMODE_SKY);

            program.loadLightDirection(gl, eyePoint.normalize());

            program.setScale(gl);

            gl.depthMask(false);
            gl.frontFace(gl.CW);

            this.setSkyPoints(dc, program.getAltitude());
            this.setSkyTrianglesIndices();

            this.applySkyVertices(dc);
            this.applySkyIndices(dc);

            gl.drawElements(gl.TRIANGLE_STRIP, this._skyTriStrip.length, gl.UNSIGNED_SHORT, 0);

            gl.depthMask(true);
            gl.frontFace(gl.CCW);
        };

        // Internal. Intentionally not documented.
        AtmosphereLayer.prototype.drawGround = function (dc) {

            var gl = dc.currentGlContext,
                program = dc.findAndBindProgram(GroundProgram),
                eyePoint = new Vec3(
                    dc.navigatorState.eyePoint[0],
                    dc.navigatorState.eyePoint[1],
                    dc.navigatorState.eyePoint[2]);

            program.loadGlobeRadius(gl, dc.globe.equatorialRadius);

            program.loadEyePoint(gl, dc.navigatorState.eyePoint);

            program.loadLightDirection(gl, eyePoint.normalize());

            program.setScale(gl);

            // Get the draw context's tessellated terrain and modelview projection matrix.
            var terrain = dc.terrain;
            var modelviewProjection = Matrix.fromIdentity();
            modelviewProjection.copy(dc.navigatorState.modelviewProjection);

            for (var idx = 0, len = terrain.tessellator.currentTiles.length; idx < len; idx++) {
                var currentTile = terrain.tessellator.currentTiles.tileArray[idx];
                // Use the vertex origin for the terrain tile.
                var terrainOrigin = currentTile.referencePoint;
                program.loadVertexOrigin(gl, terrainOrigin);

                // Use the draw context's modelview projection matrix, transformed to the tile's local coordinates.
                modelviewProjection.multiplyByTranslation(terrainOrigin[0], terrainOrigin[1], terrainOrigin[2]);
                program.loadModelviewProjection(gl, modelviewProjection);

                // Use the tile's vertex point attribute.
                gl.enableVertexAttribArray(program.vertexPointLocation);

                // Draw the tile, multiplying the current fragment color by the program's secondary color.
                program.loadFragMode(gl, program.FRAGMODE_GROUND_SECONDARY);
                gl.blendFunc(gl.DST_COLOR, gl.ZERO);
                terrain.tessellator.beginRendering(dc);
                terrain.beginRenderingTile(dc, currentTile);
                terrain.renderTile(dc, currentTile);
                terrain.endRenderingTile(dc, currentTile);
                terrain.tessellator.endRendering(dc);

                // Draw the tile, adding the current fragment color to the program's primary color.
                program.loadFragMode(gl, program.FRAGMODE_GROUND_PRIMARY);
                gl.blendFunc(gl.ONE, gl.ONE);
                terrain.tessellator.beginRendering(dc);
                terrain.beginRenderingTile(dc, currentTile);
                terrain.renderTile(dc, currentTile);
                terrain.endRenderingTile(dc, currentTile);
                terrain.tessellator.endRendering(dc);
            }

            // Restore the default World Wind OpenGL state.
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.disableVertexAttribArray(program.vertexPointLocation);
        };

        // Internal. Intentionally not documented.
        AtmosphereLayer.prototype.setSkyPoints = function (dc, altitude) {

            if (this._skyPoints == null) {
                var count = this.skyWidth * this.skyHeight;
                var array = Array(count).fill(altitude);
                this._skyPoints = new Float64Array(3 * array.length);

                dc.globe.computePointsForGrid(
                    Sector.FULL_SPHERE,
                    this.skyHeight,
                    this.skyWidth,
                    array,
                    Vec3.ZERO,
                    this._skyPoints);
            }
        };

        // Internal. Intentionally not documented.
        AtmosphereLayer.prototype.setSkyTrianglesIndices = function () {

            if (this._skyTriStrip == null) {
                this._skyTriStrip = this.assembleTriStripIndices(this.skyWidth, this.skyHeight);
            }
        };

        // Internal. Intentionally not documented.
        AtmosphereLayer.prototype.assembleTriStripIndices = function (numLat, numLon) {

            var result = [];
            var index = [];
            var vertex = 0;

            for (var latIndex = 0; latIndex < numLat - 1; latIndex++) {
                // Create a triangle strip joining each adjacent column of vertices, starting in the bottom left corner and
                // proceeding to the right. The first vertex starts with the left row of vertices and moves right to create
                // a counterclockwise winding order.
                for (var lonIndex = 0; lonIndex < numLon; lonIndex++) {
                    vertex = lonIndex + latIndex * numLon;
                    index[0] = (vertex + numLon);
                    index[1] = vertex;
                    result.push(index[0]);
                    result.push(index[1]);
                }

                // Insert indices to create 2 degenerate triangles:
                // - one for the end of the current row, and
                // - one for the beginning of the next row
                if (latIndex < numLat - 2) {
                    index[0] = vertex;
                    index[1] = (latIndex + 2) * numLon;
                    result.push(index[0]);
                    result.push(index[1]);
                }
            }

            return result;
        };

        return AtmosphereLayer;
    });