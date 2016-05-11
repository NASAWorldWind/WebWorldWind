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

        var AtmosphereLayer = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ViewControlsLayer", "constructor", "missingWorldWindow"));
            }

            Layer.call(this, "Atmosphere");

            this.wwd = worldWindow;

            this.pickEnabled = false;

            this._fullSphereSector = Sector.FULL_SPHERE;

            this._skyWidth = 128;

            this._skyHeight = 128;

            this._skyPoints = null;

            this._skyTriStrip = null;

            this._imageSource = new ImageSource('../../images/dnb_land_ocean_ice_2012.png');
        };

        AtmosphereLayer.prototype = Object.create(Layer.prototype);

        // Documented in superclass.
        AtmosphereLayer.prototype.doRender = function (dc) {
            //console.log(this._imageSource);
            this.drawGround(dc);
            this.drawSky(dc);


        };

        AtmosphereLayer.prototype.drawSky = function(dc) {
            var gl = dc.currentGlContext,
                program = dc.findAndBindProgram(SkyProgram);

            program.loadGlobe(gl, dc.globe);

            program.loadEyePoint(gl, dc.navigatorState.eyePoint);

            program.loadVertexOrigin(gl, Vec3.ZERO);

            program.loadModelviewProjection(gl, dc.navigatorState.modelviewProjection);

            program.loadFragMode(gl, program.FRAGMODE_SKY);

            program.loadLightDirection(gl, dc.navigatorState.eyePoint.normalize());

            gl.uniform1f(program.scaleLocation, 1 / program.getAltitude());

            gl.uniform1f(program.scaleDepthLocation, program.getScaleDepth());

            gl.uniform1f(program.scaleOverScaleDepthLocation, (1 / program.getAltitude()) / program.getScaleDepth());

            gl.depthMask(false);
            gl.frontFace(gl.CW);

            this.setSkyPoints(dc, program.getAltitude());
            this.setSkyTrianglesIndices();
            var triangleVertices = this._skyPoints;
            var triangleIndices = this._skyTriStrip;

            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

            var indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangleIndices), gl.STATIC_DRAW);

            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.vertexPointLocation);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.TRIANGLE_STRIP, triangleIndices.length, gl.UNSIGNED_SHORT, 0);

            gl.depthMask(true);
            gl.frontFace(gl.CCW);
        }

        AtmosphereLayer.prototype.drawGround = function(dc) {

            var gl = dc.currentGlContext,
                program = dc.findAndBindProgram(GroundProgram);

            program.loadGlobe(gl, dc.globe);

            program.loadEyePoint(gl, dc.navigatorState.eyePoint);

            program.loadLightDirection(gl, dc.navigatorState.eyePoint.normalize());

            gl.uniform1f(program.scaleLocation, 1 / program.getAltitude());

            gl.uniform1f(program.scaleDepthLocation, program.getScaleDepth());

            gl.uniform1f(program.scaleOverScaleDepthLocation, (1 / program.getAltitude()) / program.getScaleDepth());

            //GpuTexture texture = null;
            //boolean textureBound = false;
            //
            //// Use this layer's night image when the light location is different than the eye location.
            //if (this.nightImageSource != null && this.lightLocation != null) {
            //
            //    texture = (GpuTexture) dc.getGpuObjectCache().get(this.nightImageSource);
            //    if (texture == null) {
            //        texture = new GpuTexture(dc, this.nightImageSource);
            //    }
            //
            //    textureBound = texture.bindTexture(dc, GLES20.GL_TEXTURE0);
            //}

            // Get the draw context's tessellated terrain and modelview projection matrix.
            var terrain = dc.terrain;
            //var modelviewProjection = dc.navigatorState.modelviewProjection;
            var modelviewProjection = Matrix.fromIdentity();
            modelviewProjection.copy(dc.navigatorState.modelviewProjection);

            // Set up to use the shared tile tex coord attributes.
            //gl.enableVertexAttribArray(program.vertexPointLocation);
            //terrain.useVertexTexCoordAttrib(dc, 1);

            for (var idx = 0, len = terrain.tessellator.currentTiles.length; idx < len; idx++) {

                var currentTile = terrain.tessellator.currentTiles.tileArray[idx];
                // Use the vertex origin for the terrain tile.
                var terrainOrigin = currentTile.referencePoint;
                program.loadVertexOrigin(gl, terrainOrigin);

                // Use the draw context's modelview projection matrix, transformed to the tile's local coordinates.
                modelviewProjection.multiplyByTranslation(terrainOrigin[0], terrainOrigin[1], terrainOrigin[2]);
                program.loadModelviewProjection(gl, modelviewProjection);

                // Use the texture's transform matrix.
                //if (textureBound) {
                //this.texCoordMatrix.setToIdentity();
                //texture.applyTexCoordTransform(this.texCoordMatrix);
                //terrain.applyTexCoordTransform(idx, this.fullSphereSector, this.texCoordMatrix);
                //program.loadTexCoordMatrix(this.texCoordMatrix);
                //}

                // Use the tile's vertex point attribute.
                //terrain.useVertexPointAttrib(dc, idx, 0);
                gl.enableVertexAttribArray(program.vertexPointLocation);

                // Draw the tile, multiplying the current fragment color by the program's secondary color.
                program.loadFragMode(gl, program.FRAGMODE_GROUND_SECONDARY);
                gl.blendFunc(gl.DST_COLOR, gl.ZERO);
                terrain.tessellator.beginRendering(dc);
                terrain.beginRenderingTile(dc, currentTile);
                terrain.renderTile(dc, currentTile);
                terrain.endRenderingTile(dc, currentTile);
                terrain.tessellator.endRendering(dc);
                //terrain.renderTile(dc, currentTile);

                // Draw the tile, adding the current fragment color to the program's primary color.
                program.loadFragMode(gl, program.FRAGMODE_GROUND_PRIMARY);
                gl.blendFunc(gl.ONE, gl.ONE);
                //terrain.renderTile(dc, currentTile);
                terrain.tessellator.beginRendering(dc);
                terrain.beginRenderingTile(dc, currentTile);
                terrain.renderTile(dc, currentTile);
                terrain.endRenderingTile(dc, currentTile);
                terrain.tessellator.endRendering(dc);
            }

            // Restore the default World Wind OpenGL state.
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.disableVertexAttribArray(program.vertexPointLocation);
        }

        AtmosphereLayer.prototype.setSkyPoints = function(dc, altitude) {
            if (this._skyPoints == null) {
                var count = this._skyWidth * this._skyHeight;
                var array = Array(count).fill(altitude);
                this._skyPoints = new Float64Array(3 * array.length);

                dc.globe.computePointsForGrid(
                    this._fullSphereSector,
                    this._skyWidth,
                    this._skyHeight,
                    array,
                    Vec3.ZERO,
                    this._skyPoints);
            }
        }

        AtmosphereLayer.prototype.setSkyTrianglesIndices = function() {
            if (this._skyTriStrip == null) {
                this._skyTriStrip = this.assembleTriStripIndices(this._skyWidth, this._skyHeight);
            }
        }

        AtmosphereLayer.prototype.assembleTriStripIndices = function(numLat, numLon) {
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
                    index[1] =  vertex;
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
        }

        return AtmosphereLayer;
    });