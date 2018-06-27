define([
        '../geom/BoundingBox',
        '../util/Color',
        '../render/FramebufferTexture',
        '../geom/Matrix',
        '../geom/Position',
        '../render/Renderable',
        '../geom/Sector',
        '../shapes/ShapeAttributes',
        '../shaders/SurfaceShapeProgram',
        '../render/Texture',
        '../geom/Vec3'
],
    function(BoundingBox, Color, FramebufferTexture, Matrix, Position, Renderable, Sector, ShapeAttributes, SurfaceShapeProgram, Texture, Vec3) {

    var SurfaceShape = function (boundaries, attributes) {
        Renderable.call(this);

        this._enabled = true;

        this._activeAttributes = null;

        this._attributes = attributes || new ShapeAttributes();

        this._highlightAttributes = null;

        this._highlighted = false;

        this._sector = new Sector();

        this._boundingBox = null;

        this._boundaries = boundaries;

        this._textureCoordinates = null;

        this._vertexArray = null;

        this._elementArray = null;

        this._textureArray = null;

        this._vertexCacheKey = null;

        this._elementCacheKey = null;

        this._interiorVolumeElements = {};

        this._interiorPlaneElements = {};

        this._outlineElements = {};

        this._centerPoint = null;

        this._frameBufferCacheKey = null;

        this._frameBuffer = null;

        this._activeTexture = null;

        this.scratchMatrix = new Matrix();

        this.scratchPosition = new Position();

        this.scratchPoint = new Vec3();

        this.orthoMvpMatrix = new Matrix();
    };

    SurfaceShape.prototype = Object.create(Renderable.prototype);

    SurfaceShape.CACHE_ID = 0;

    SurfaceShape.FRAMEBUFFER_CACHE_KEY = "SurfaceShapeFrameBuffer";

    SurfaceShape.WHITE_TEXTURE_KEY = "SurfaceShapeWhiteTexture";

    SurfaceShape.prototype.render = function (dc) {
        var elevLimits;

        if (!this._boundaries) {
            return;
        }

        this._sector.setToBoundingSector(this._boundaries);

        if (!this._boundingBox) {
            this._boundingBox = new BoundingBox();
            elevLimits = this.calculateVolumeVerticalLimits(dc);
            this._boundingBox.setToSector(this._sector, dc.globe, elevLimits.min, elevLimits.max);
        }

        if (!this._enabled || !this._boundingBox.intersectsFrustum(dc.frustumInModelCoordinates)) {
            return;
        }

        if (this.mustAssembleGeometry(dc)) {
            this.calculateCenter(dc);
            this.assembleVertexArray(dc);
            this.assembleElementArray(dc);
        }

        if (!this._textureArray) {
            this.assembleTextureArray(dc);
        }

        this.determineActiveAttributes(dc);

        this.beginDrawing(dc);
        try {
            this.draw(dc);
        } finally {
            this.endDrawing(dc);
        }
    };

    SurfaceShape.prototype.draw = function (dc) {
        var gl = dc.currentGlContext, program;

        program = dc.findAndBindProgram(SurfaceShapeProgram);

        // always bind a texture, if its not an image, the small 2x2 white canvas will be used
        if (!this.bindTexture(dc, this._activeAttributes.imageSource)) {
            return;
        }

        this.bindShapeBuffer(dc);

        this.bindElementBuffer(dc);

        // check if the interior should be drawn, if an image is provided for the center, and if the texture is ready
        if (this._activeAttributes.drawInterior && this._activeAttributes.imageSource && this._activeTexture) {
            this.drawProjectedSurfaceImage(dc);
        }

        this.beginStenciling(dc);

        if (this._activeAttributes.drawInterior) {
            this.drawInterior(dc);
        }

        if (this._activeAttributes.drawOutline) {
            this.drawOutline(dc);
        }

        this.endStenciling(dc);
    };

    SurfaceShape.prototype.drawInterior = function (dc) {
        var gl = dc.currentGlContext, terrain = dc.terrain, program = dc.currentProgram, terrainTiles = dc.terrain.surfaceGeometry,
            terrainTile, i, len, center;

        // the interior vertices are not offset, set the parameters which influence offsetting to zero
        gl.disableVertexAttribArray(program.offsetVectorLocation);
        this.loadZeroOffsetValues(dc);

        this.scratchMatrix.copy(dc.modelviewProjection);
        this.scratchMatrix.multiplyByTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
        program.loadUniformMatrix(gl, this.scratchMatrix, program.mvpMatrixLocation);
        this.scratchMatrix.setToScale(0.5, 0.5, 1);
        this.scratchMatrix.multiplyByTranslation(1, 1, 0);
        program.loadUniformMatrix(gl, this.scratchMatrix, program.texCoordMatrixLocation);

        // the color doesn't matter while we are populating the stencil
        gl.disableVertexAttribArray(program.vertexTexCoordLocation);
        gl.vertexAttrib4f(program.vertexTexCoordLocation, 0.25, 0.25, 0, 1);
        program.loadUniformColor(gl, Color.WHITE, program.colorLocation);

        this.prepareStencil(dc);
        gl.drawElements(gl.TRIANGLES, this._interiorVolumeElements.count, gl.UNSIGNED_SHORT, this._interiorVolumeElements.offset);

        this.applyStencilTest(dc);

        program.loadUniformColor(gl, this._activeAttributes.interiorColor, program.colorLocation);

        if (this._activeAttributes.imageSource) {
            // // for debugging purposes:
            // var canvas = document.createElement("canvas");
            // canvas.setAttribute("width", "512");
            // canvas.setAttribute("height", "512");
            // var ctx = canvas.getContext("2d");
            // ctx.fillStyle = "rgb(255, 0, 0)";
            // ctx.fillRect(0, 0, 256, 256);
            // ctx.fillStyle = "rgb(0, 255, 0)";
            // ctx.fillRect(256, 0, 256, 256);
            // ctx.fillStyle = "rgb(0, 0, 255)";
            // ctx.fillRect(0, 256, 256, 256);
            // ctx.fillStyle = "rgb(255, 255, 255)";
            // ctx.fillRect(256, 256, 256, 256);
            // var texture = new Texture(gl, canvas);
            // texture.bind(dc);

            // the vertices should be transformed using the standard mvp, but, the texture coordinates should also
            // be vertex coordinates, and transformed using the orthographic projection and sample the active texture
            // provided by the framebuffer (should already be bound)
            program.loadUniformBoolean(gl, true, program.isVertexLookupLocation);

            len = terrainTiles.length;

            terrain.beginRendering(dc);

            for (i = 0; i < len; i++) {
                terrainTile = terrainTiles[i];

                if (!terrainTile || !terrainTile.transformationMatrix) {
                    continue;
                }

                this.scratchMatrix.copy(this.orthoMvpMatrix);
                this.scratchMatrix.multiplyMatrix(terrainTile.transformationMatrix);
                program.loadUniformMatrix(gl, this.scratchMatrix, program.texCoordMatrixLocation);

                terrain.beginRenderingTile(dc, terrainTile);
                terrain.renderTile(dc, terrainTile);
                terrain.endRenderingTile(dc, terrainTile);
            }

            terrain.endRendering(dc);

            // terrain rendering buffered other arrays, so we need rebind the shadow volume data for potential use by
            // the outline
            if (this._activeAttributes.drawOutline) {
                this.bindTexture(dc);
                this.bindShapeBuffer(dc);
                this.bindElementBuffer(dc);
            }

        } else {
            gl.drawElements(gl.TRIANGLES, this._interiorVolumeElements.count, gl.UNSIGNED_SHORT, this._interiorVolumeElements.offset);
        }
        gl.enableVertexAttribArray(program.offsetVectorLocation);
    };

    SurfaceShape.prototype.drawOutline = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        program.loadUniformFloat(gl, this._activeAttributes.outlineWidth, program.offsetWidthLocation);
        this.scratchPoint.copy(dc.eyePoint);
        this.scratchPoint.subtract(this._centerPoint);
        gl.uniform3f(program.eyePointLocation, this.scratchPoint[0], this.scratchPoint[1], this.scratchPoint[2]);
        program.loadUniformFloat(gl, dc.eyePosition.altitude, program.eyeAltitudeLocation);
        program.loadUniformFloat(gl, dc.pixelSizeFactor, program.pixelSizeFactorLocation);
        program.loadUniformFloat(gl, dc.pixelSizeOffset, program.pixelSizeOffsetLocation);
        program.loadUniformColor(gl, this._activeAttributes.outlineColor, program.colorLocation);
        program.loadUniformBoolean(gl, false, program.isVertexLookupLocation);

        this.scratchMatrix.copy(dc.modelviewProjection);
        this.scratchMatrix.multiplyByTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
        program.loadUniformMatrix(gl, this.scratchMatrix, program.mvpMatrixLocation);
        this.scratchMatrix.setToIdentity();
        program.loadUniformMatrix(gl, this.scratchMatrix, program.texCoordMatrixLocation);

        this.bindTexture(dc, true);

        this.prepareStencil(dc);
        gl.drawElements(gl.TRIANGLES, this._outlineElements.count, gl.UNSIGNED_SHORT, this._outlineElements.offset);

        this.applyStencilTest(dc);
        gl.drawElements(gl.TRIANGLES, this._outlineElements.count, gl.UNSIGNED_SHORT, this._outlineElements.offset);
    };

    SurfaceShape.prototype.loadSceneTransforms = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        this.scratchMatrix.copy(dc.modelviewProjection);
        this.scratchMatrix.multiplyByTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
        program.loadUniformMatrix(gl, this.scratchMatrix, program.mvpMatrixLocation);
        this.scratchMatrix.setToIdentity();
        program.loadUniformMatrix(gl, this.scratchMatrix, program.texCoordMatrixLocation);
    };

    SurfaceShape.prototype.drawProjectedSurfaceImage = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram, center;

        // at this point, all of the geometry, texture, and texture coordinates should be bound and ready

        this.calculateOrthographicTransform(dc);

        // the vertex transformation to the orthographic projection becomes its texture coordinate in the offscreen
        // framebuffer
        this.scratchMatrix.copy(this.orthoMvpMatrix);
        this.scratchMatrix.multiplyByTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
        program.loadUniformMatrix(gl, this.scratchMatrix, program.mvpMatrixLocation);
        // the vertex texture coordinate to be used in sampling should pass through unchanged
        this.scratchMatrix.setToIdentity();
        program.loadUniformMatrix(gl, this.scratchMatrix, program.texCoordMatrixLocation);

        // the SurfaceShapeProgram provides for a dynamic vertex offset, to avoid this, we'll disable the offsetVector
        // vertex attribute array and load zeros for other key uniforms
        gl.disableVertexAttribArray(program.offsetVectorLocation);
        this.loadZeroOffsetValues(dc);

        // keeps the textures colors as the shader modulates all lookups
        program.loadUniformColor(gl, Color.WHITE, program.colorLocation);

        if (!this._frameBufferCacheKey) {
            this._frameBufferCacheKey = "SurfaceShapeFrameBuffer" + SurfaceShape.CACHE_ID++;
        }

        this._frameBuffer = dc.gpuResourceCache.resourceForKey(this._frameBufferCacheKey);
        if (!this._frameBuffer) {
            this._frameBuffer = new FramebufferTexture(gl, 1024, 1024, false);
            dc.gpuResourceCache.putResource(this._frameBufferCacheKey, this._frameBuffer, this._frameBuffer.size);
        }
        dc.bindFramebuffer(this._frameBuffer);

        gl.viewport(0, 0, 1024, 1024);
        gl.drawElements(gl.TRIANGLES, this._interiorPlaneElements.count, gl.UNSIGNED_SHORT, this._interiorPlaneElements.offset);
        dc.bindFramebuffer(null);
        gl.viewport(0, 0, dc.viewport.width, dc.viewport.height);

        gl.enableVertexAttribArray(program.offsetVectorLocation);

        // switch the active texture to the orthographic projected framebuffer texture
        gl.activeTexture(gl.TEXTURE0);
        this._frameBuffer.bind(dc);
        this._activeTexture = this._frameBuffer.texture;
        program.loadUniformTextureUnit(gl, gl.TEXTURE0);
    };

    SurfaceShape.prototype.beginDrawing = function (dc) {

    };

    SurfaceShape.prototype.endDrawing = function (dc) {
        var gl = dc.currentGlContext;

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        this._activeTexture = null;
        this._frameBuffer = null;

        this.endStenciling(dc);

        // Reinstate typical WebWorldWind GL state
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
    };

    SurfaceShape.prototype.loadZeroOffsetValues = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        program.loadUniformFloat(gl, 0, program.offsetWidthLocation);
        gl.uniform3f(program.eyePointLocation, 0, 0, 0);
        program.loadUniformFloat(gl, 0, program.eyeAltitudeLocation);
        program.loadUniformFloat(gl, 0, program.pixelSizeFactorLocation);
        program.loadUniformFloat(gl, 0, program.pixelSizeOffsetLocation);
    };

    SurfaceShape.prototype.bindElementBuffer = function (dc) {
        var gl = dc.currentGlContext, ebo;

        if (!this._elementCacheKey) {
            this._elementCacheKey = "SurfaceShapeElementArray " + SurfaceShape.CACHE_ID++;
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
    };

    SurfaceShape.prototype.bindShapeBuffer = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram, vbo;

        if (!this._vertexCacheKey) {
            this._vertexCacheKey = "SurfaceShapeVertexArray " + SurfaceShape.CACHE_ID++;
        }

        vbo = dc.gpuResourceCache.resourceForKey(this._vertexCacheKey);
        if (!vbo) {
            vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, this._vertexArray, gl.STATIC_DRAW);
            dc.gpuResourceCache.putResource(this._vertexCacheKey, vbo, this._vertexArray.length * 4);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        }

        gl.enableVertexAttribArray(program.vertexPointLocation);
        gl.enableVertexAttribArray(program.offsetVectorLocation);

        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(program.offsetVectorLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    };

    SurfaceShape.prototype.bindTexture = function (dc, textureKey) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        gl.activeTexture(gl.TEXTURE0);

        if (textureKey) {
            this._activeTexture = dc.gpuResourceCache.resourceForKey(textureKey);
            if (!this._activeTexture) {
                dc.gpuResourceCache.retrieveTexture(gl, this._activeAttributes.imageSource);
                return false; // wait until the requested texture is ready (this will stop rendering of this shape)
            }

            this.bindTextureCoordinateBuffer(dc);
        } else {
            this._activeTexture = SurfaceShape.getWhiteTexture(dc);

            gl.vertexAttrib4f(program.vertexTexCoordLocation, 0.25, 0.25, 0, 1);
        }

        program.loadUniformTextureUnit(gl, gl.TEXTURE0, program.textureUnitLocation);

        return this._activeTexture.bind(dc);
    };

    SurfaceShape.prototype.bindTextureCoordinateBuffer = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram, tbo;

        if (!this._textureCacheKey) {
            this._textureCacheKey = "SurfaceShapeTextureArray " + SurfaceShape.CACHE_ID++;
        }

        tbo = dc.gpuResourceCache.resourceForKey(this._textureCacheKey);
        if (!tbo) {
            tbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
            gl.bufferData(gl.ARRAY_BUFFER, this._textureArray, gl.STATIC_DRAW);
            dc.gpuResourceCache.putResource(this._textureCacheKey, tbo, this._textureArray.length * 4);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
        }

        gl.enableVertexAttribArray(program.vertexTexCoordLocation);
        gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
    };

    SurfaceShape.prototype.beginStenciling = function (dc) {
        var gl = dc.currentGlContext;

        gl.depthMask(false);
        gl.enable(gl.STENCIL_TEST);
        gl.disable(gl.CULL_FACE);
    };

    SurfaceShape.prototype.endStenciling = function (dc) {
        var gl = dc.currentGlContext;

        gl.disable(gl.STENCIL_TEST);
        gl.depthMask(true);
    };

    SurfaceShape.prototype.prepareStencil = function (dc) {
        var gl = dc.currentGlContext;

        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.stencilFunc(gl.ALWAYS, 0, 255);
        gl.enable(gl.DEPTH_TEST);
        gl.colorMask(false, false, false, false);

        // z-fail
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.DECR_WRAP, gl.KEEP);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.INCR_WRAP, gl.KEEP);
    };

    SurfaceShape.prototype.applyStencilTest = function (dc) {
        var gl = dc.currentGlContext;

        // Enable the scene drawing
        gl.colorMask(true, true, true, true);

        // Apply the stencil test to drawing
        gl.stencilFunc(gl.NOTEQUAL, 0, 255);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.ZERO); // reset stencil to zero after successful fragment modification

        gl.disable(gl.DEPTH_TEST);
    };

    SurfaceShape.prototype.mustAssembleGeometry = function (dc) {
        return this._vertexArray == null || this._elementArray == null;
    };

    SurfaceShape.prototype.determineActiveAttributes = function (dc) {
        if (dc.pickingMode) {
            // TODO determine picking configuration
            this._activeAttributes = this._attributes;
            return;
        }

        if (this._highlighted) {
            this._activeAttributes = this._highlightAttributes;
        } else {
            this._activeAttributes = this._attributes;
        }
    };

    SurfaceShape.prototype.calculateCenter = function (dc) {
        var minLat = Number.MAX_VALUE, minLon = Number.MAX_VALUE, maxLat = -Number.MAX_VALUE,
            maxLon = -Number.MAX_VALUE, i, len = this._boundaries.length, loc;

        for (i = 0; i < len; i++) {
            loc = this._boundaries[i];
            minLat = Math.min(minLat, loc.latitude);
            maxLat = Math.max(maxLat, loc.latitude);
            minLon = Math.min(minLon, loc.longitude);
            maxLon = Math.max(maxLon, loc.longitude);
        }

        this._centerPoint = dc.globe.computePointFromPosition(
            (maxLat - minLat) / 2 + minLat,
            (maxLon - minLon) / 2 + minLon,
            0,
            new Vec3()
        );
    };

    SurfaceShape.prototype.calculateOrthographicTransform = function (dc) {
        var offset = WorldWind.EARTH_RADIUS;

        this.orthoMvpMatrix.setToOrthographicProjection(
            -offset,
            offset,
            -offset,
            offset,
            -offset,
            offset
        );
        dc.globe.computePositionFromPoint(
            this._centerPoint[0], this._centerPoint[1], this._centerPoint[2], this.scratchPosition);
        this.orthoMvpMatrix.multiplyByLookAtModelview(this.scratchPosition, 0, 0, 0, 0, dc.globe);
    };

    SurfaceShape.getWhiteTexture = function (dc) {
        var texture, canvas, ctx;

        texture = dc.gpuResourceCache.resourceForKey(SurfaceShape.WHITE_TEXTURE_KEY);
        if (!texture) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("width", "2");
            canvas.setAttribute("height", "2");
            ctx = canvas.getContext("2d");
            ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
            ctx.fillRect(0, 0, 2, 2);

            texture = new Texture(dc.currentGlContext, canvas);
            dc.gpuResourceCache.putResource(SurfaceShape.WHITE_TEXTURE_KEY, texture, texture.size);
        }

        return texture;
    };

    // The operations below would be the responsibility of the specific shapes in order to maximize the shapes geometry

    SurfaceShape.prototype.calculateVolumeVerticalLimits = function (dc) {
        // TODO more accurate volume limits that represent geographical extent and terrain
        return {min: -5000, max: 200000};
    };

    SurfaceShape.prototype.assembleVertexArray = function (dc) {
        this._vertexArray = new Float32Array(4 /*locations*/ * 2 /*interior and exterior points*/
            * 2 /*top and bottom*/ * 6 /*components: x, y, z, ox, oy, oz (offsets)*/);
        var i, limits = this.calculateVolumeVerticalLimits(dc), prevLocation, location, nextLocation, idx = 0;

        for (i = 0; i < 4; i++) {
            location = this._boundaries[i];

            if (i === 0) {
                prevLocation = this._boundaries[3];
            } else {
                prevLocation = this._boundaries[i - 1];
            }

            if (i === 3) {
                nextLocation = this._boundaries[0];
            } else {
                nextLocation = this._boundaries[i + 1];
            }

            idx = this.generateVerticesWithOffsetVector(dc, prevLocation, location, nextLocation, limits, idx);
        }
    };

    SurfaceShape.prototype.generateVerticesWithOffsetVector = function (dc, prevLocation, location, nextLocation, altitudeLimits, idx) {
        var prevPoint = new Vec3(), point = new Vec3(), nextPoint = new Vec3(),
            altitude = [altitudeLimits.min, altitudeLimits.max];

        for (var i = 0; i < altitude.length; i++) {
            var alt = altitude[i];

            dc.globe.computePointFromPosition(prevLocation.latitude, prevLocation.longitude, alt, prevPoint);
            dc.globe.computePointFromPosition(location.latitude, location.longitude, alt, point);
            dc.globe.computePointFromPosition(nextLocation.latitude, nextLocation.longitude, alt, nextPoint);

            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];

            prevPoint.subtract(this._centerPoint);
            nextPoint.subtract(this._centerPoint);

            // line tangent to the offset direction
            nextPoint.subtract(prevPoint).normalize();

            // offset direction unit vector
            prevPoint.copy(point).normalize();
            prevPoint.cross(nextPoint).normalize();

            this._vertexArray[idx++] = prevPoint[0];
            this._vertexArray[idx++] = prevPoint[1];
            this._vertexArray[idx++] = prevPoint[2];

            this._vertexArray[idx++] = point[0] - this._centerPoint[0];
            this._vertexArray[idx++] = point[1] - this._centerPoint[1];
            this._vertexArray[idx++] = point[2] - this._centerPoint[2];

            prevPoint.negate();
            this._vertexArray[idx++] = prevPoint[0];
            this._vertexArray[idx++] = prevPoint[1];
            this._vertexArray[idx++] = prevPoint[2];
        }

        return idx;
    };

    SurfaceShape.prototype.assembleElementArray = function (dc) {
        var interiorVolume = 6 * 6 /* a cube basically*/,
            interiorPlane = 6 /* simple quad of the bottom plane */,
            outline = 4 * 4 * 6,
            idx = 0, stride, i;

        this._elementArray = new Int16Array(interiorVolume + interiorPlane + outline);

        this._interiorVolumeElements.count = interiorVolume;
        this._interiorVolumeElements.offset = 0;
        this._interiorPlaneElements.count = interiorPlane;
        this._interiorPlaneElements.offset = interiorVolume * 2;
        this._outlineElements.count = outline;
        this._outlineElements.offset = (interiorVolume + interiorPlane) * 2;

        // interior volume first - just uses non-offset interior (odd) points
        // top
        this._elementArray[idx++] = 15;
        this._elementArray[idx++] = 7;
        this._elementArray[idx++] = 3;
        this._elementArray[idx++] = 7;
        this._elementArray[idx++] = 15;
        this._elementArray[idx++] = 11;
        // bottom
        this._elementArray[idx++] = 13;
        this._elementArray[idx++] = 5;
        this._elementArray[idx++] = 9;
        this._elementArray[idx++] = 5;
        this._elementArray[idx++] = 13;
        this._elementArray[idx++] = 1;
        // sides
        for (i = 0; i < 4; i++) {
            stride = i * 4;
            if (i === 3) {
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 2;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 1;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 3;
            } else {
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 7 + stride;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 5 + stride;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 7 + stride;
            }
        }

        // interior plane
        this._elementArray[idx++] = 13;
        this._elementArray[idx++] = 5;
        this._elementArray[idx++] = 1;
        this._elementArray[idx++] = 5;
        this._elementArray[idx++] = 13;
        this._elementArray[idx++] = 9;

        // outline volume
        for (i = 0; i < 4; i++) {
            stride = i * 4;
            if (i === 3) {
                // inner
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 1;
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 3;
                this._elementArray[idx++] = 1 + stride;
                // top
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 3;
                this._elementArray[idx++] = 2;
                this._elementArray[idx++] = 2 + stride;
                this._elementArray[idx++] = 2;
                this._elementArray[idx++] = 3 + stride;
                // outer
                this._elementArray[idx++] = 2 + stride;
                this._elementArray[idx++] = 2;
                this._elementArray[idx++] = stride;
                this._elementArray[idx++] = 0;
                this._elementArray[idx++] = stride;
                this._elementArray[idx++] = 2;
                // bottom
                this._elementArray[idx++] = stride;
                this._elementArray[idx++] = 0;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 1;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 0;
            } else {
                // inner
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 5 + stride;
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 7 + stride;
                this._elementArray[idx++] = 1 + stride;
                // top
                this._elementArray[idx++] = 3 + stride;
                this._elementArray[idx++] = 7 + stride;
                this._elementArray[idx++] = 6 + stride;
                this._elementArray[idx++] = 2 + stride;
                this._elementArray[idx++] = 6 + stride;
                this._elementArray[idx++] = 3 + stride;
                // outer
                this._elementArray[idx++] = 2 + stride;
                this._elementArray[idx++] = 6 + stride;
                this._elementArray[idx++] = stride;
                this._elementArray[idx++] = 4 + stride;
                this._elementArray[idx++] = stride;
                this._elementArray[idx++] = 6 + stride;
                // bottom
                this._elementArray[idx++] = stride;
                this._elementArray[idx++] = 4 + stride;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 5 + stride;
                this._elementArray[idx++] = 1 + stride;
                this._elementArray[idx++] = 4 + stride;
            }
        }
    };

    SurfaceShape.prototype.assembleTextureArray = function (dc) {
        var verts = this._boundaries.length * 4, idx, coords;

        this._textureArray = new Float32Array(verts * 2);

        // 1, 5, 9, 13
        idx = 1 * 2;
        coords = this._textureCoordinates[0];
        this._textureArray[idx++] = coords[0];
        this._textureArray[idx++] = coords[1];

        idx = 5 * 2;
        coords = this._textureCoordinates[1];
        this._textureArray[idx++] = coords[0];
        this._textureArray[idx++] = coords[1];

        idx = 9 * 2;
        coords = this._textureCoordinates[2];
        this._textureArray[idx++] = coords[0];
        this._textureArray[idx++] = coords[1];

        idx = 13 * 2;
        coords = this._textureCoordinates[3];
        this._textureArray[idx++] = coords[0];
        this._textureArray[idx++] = coords[1];
    };

    return SurfaceShape;
});