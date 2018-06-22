define([
        '../geom/BoundingBox',
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
    function(BoundingBox, FramebufferTexture, Matrix, Position, Renderable, Sector, ShapeAttributes, SurfaceShapeProgram, Texture, Vec3) {

    var SurfaceShape = function (attributes) {
        Renderable.call(this);

        this._enabled = true;

        this._activeAttributes = null;

        this._attributes = attributes || new ShapeAttributes();

        this._highlightAttributes = null;

        this._highlighted = false;

        this._sector = new Sector();

        this._boundingBox = null;

        this._boundaries = null;

        this._textureCoordinates = null;

        this._vertexArray = null;

        this._elementArray = null;

        this._textureArray = null;

        this._vertexCacheKey = null;

        this._elementCacheKey = null;

        this._whiteTextureCacheKey = null;

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

        this.orthoProjectionMatrix = new Matrix().setToOrthographicProjection(
            -1.5 * WorldWind.EARTH_RADIUS,
            1.5 * WorldWind.EARTH_RADIUS,
            -1.5 * WorldWind.EARTH_RADIUS,
            1.5 * WorldWind.EARTH_RADIUS,
            1.5 * WorldWind.EARTH_RADIUS,
            -1.5 * WorldWind.EARTH_RADIUS
        );
    };

    SurfaceShape.CACHE_ID = 0;

    SurfaceShape.FRAMEBUFFER_CACHE_KEY = "SurfaceShapeFrameBuffer";

    Object.defineProperties(SurfaceShape.prototype, {
        boundaries: {
            get: function () {
                return this._boundaries;
            },
            set: function (boundaries) {
                this._boundaries = boundaries;
                this._sector.setToBoundingSector(boundaries);
                this._boundingBox = null;
                this._centerPoint = null;
                this._vertexArray = null;
                this._elementArray = null;
                this._vertexCacheKey = null;
                this._elementCacheKey = null;
            }
        },
        textureCoordinates: {
            get: function () {
                return this._textureCoordinates;
            },
            set: function (textureCoordinates) {
                this._textureCoordinates = textureCoordinates;
                this._textureArray = null;
                this._textureCacheKey = null;
            }
        }
    });

    SurfaceShape.prototype = Object.create(Renderable.prototype);

    SurfaceShape.prototype.computeBoundaries = function () {

    };

    SurfaceShape.prototype.render = function (dc) {
        var elevLimits;

        this.computeBoundaries();
        this._sector.setToBoundingSector(this._boundaries);

        if (!this._boundaries) {
            return;
        }

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

        this.bindShapeBuffer(dc);
        this.configureShapeAttributes(dc);

        this.bindElementBuffer(dc);

        if (!this.bindTexture(dc)) {
            return;
        }

        if (this._activeAttributes.imageSource && this._activeTexture && this._activeAttributes.drawInterior) {
            this.drawProjectedSurfaceImage(dc);
        }

        this.beginStenciling(dc);

        this.loadTransforms(dc);

        if (this._activeAttributes.drawInterior) {
            this.drawInterior(dc);
        }

        if (this._activeAttributes.drawOutline) {
            this.drawOutline(dc);
        }

        this.endStenciling(dc);

        if (this.debug) {
            this.bindTexture(dc, true);
            gl.drawElements(gl.LINE_STRIP, this._interiorVolumeElements.count, gl.UNSIGNED_SHORT, this._interiorVolumeElements.offset);
            gl.drawElements(gl.LINE_STRIP, this._outlineElements.count, gl.UNSIGNED_SHORT, this._outlineElements.offset);
        }
    };

    SurfaceShape.prototype.drawInterior = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        program.loadUniformFloat(gl, 0, program.offsetWidthLocation);
        this.scratchPoint.copy(dc.eyePoint);
        this.scratchPoint.subtract(this._centerPoint);
        gl.uniform3f(program.eyePointLocation, this.scratchPoint[0], this.scratchPoint[1], this.scratchPoint[2]);
        program.loadUniformFloat(gl, 0, program.eyeAltitudeLocation);
        program.loadUniformFloat(gl, 0, program.pixelSizeFactorLocation);
        program.loadUniformFloat(gl, 0, program.pixelSizeOffsetLocation);

        this.prepareStencil(dc);
        gl.drawElements(gl.TRIANGLES, this._interiorVolumeElements.count, gl.UNSIGNED_SHORT, this._interiorVolumeElements.offset);

        this.applyStencilTest(dc);
        if (this._activeAttributes.imageSource && this._activeTexture) {
            this._activeTexture.bind(dc);
            program.loadUniformColor(gl, Color.WHITE, program.colorLocation);
        } else {
            program.loadUniformColor(gl, this._activeAttributes.interiorColor, program.colorLocation);
        }
        gl.drawElements(gl.TRIANGLES, this._interiorVolumeElements.count, gl.UNSIGNED_SHORT, this._interiorVolumeElements.offset);
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

        this.bindTexture(dc, true);

        this.prepareStencil(dc);
        gl.drawElements(gl.TRIANGLES, this._outlineElements.count, gl.UNSIGNED_SHORT, this._outlineElements.offset);

        this.applyStencilTest(dc);
        gl.drawElements(gl.TRIANGLES, this._outlineElements.count, gl.UNSIGNED_SHORT, this._outlineElements.offset);
    };

    SurfaceShape.prototype.loadTransforms = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        this.scratchMatrix.copy(dc.modelviewProjection);
        this.scratchMatrix.multiplyByTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
        program.loadUniformMatrix(gl, this.scratchMatrix, program.mvpMatrixLocation);
        this.scratchMatrix.setToIdentity();
        program.loadUniformMatrix(gl, this.scratchMatrix, program.texCoordMatrix);
    };

    SurfaceShape.prototype.drawProjectedSurfaceImage = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram, center;

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

        // load all of the uniforms
        center = dc.globe.computePositionFromPoint(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2], this.scratchPosition);
        this.scratchMatrix.copy(this.orthoProjectionMatrix);
        this.scratchMatrix.multiplyByLookAtModelview(center, 0, 0, 0, 0, dc);
        this.scratchMatrix.multiplyByTranslation(this._centerPoint[0], this._centerPoint[1], this._centerPoint[2]);
        program.loadUniformMatrix(gl, this.scratchMatrix, program.mvpMatrixLocation);
        this.scratchMatrix.setToIdentity();
        program.loadTextureMatrix(gl, this.scratchMatrix, program.texCoordMatrixLocation);
        program.loadUniformColor(gl, Color.WHITE, program.colorLocation);

        gl.drawElements(gl.TRIANGLES, this._interiorPlaneElements.count, gl.UNSIGNED_SHORT, this._interiorPlaneElements.offset);

        dc.bindFramebuffer(null);
        gl.viewport(0, 0, dc.viewport.width, dc.viewport.height);
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
        var gl = dc.currentGlContext, vbo;

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
    };

    SurfaceShape.prototype.configureShapeAttributes = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        gl.enableVertexAttribArray(program.vertexPointLocation);
        gl.enableVertexAttribArray(program.offsetVectorLocation);

        gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(program.offsetVectorLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
    };

    SurfaceShape.prototype.bindTextureBuffer = function (dc) {
        var gl = dc.currentGlContext, tbo;

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
    };

    SurfaceShape.prototype.configureTextureAttributes = function (dc) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        gl.enableVertexAttribArray(program.vertexTexCoordLocation);

        gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
    };

    SurfaceShape.prototype.bindTexture = function (dc, forceWhite) {
        var gl = dc.currentGlContext, program = dc.currentProgram;

        if (this._activeAttributes.imageSource && !forceWhite) {
            this._activeTexture = dc.gpuResourceCache.resourceForKey(this._activeAttributes.imageSource);
            if (!this._activeTexture) {
                dc.gpuResourceCache.retrieveTexture(gl, this._activeAttributes.imageSource);
                return false;
            }

            this.bindTextureBuffer(dc);
            this.configureTextureAttributes(dc);
        } else {
            if (!this._whiteTextureCacheKey) {
                this._whiteTextureCacheKey = "SurfaceShapeWhiteTextureKey" + SurfaceShape.CACHE_ID++;
            }

            this._activeTexture = dc.gpuResourceCache.resourceForKey(this._whiteTextureCacheKey);
            if (!this._activeTexture) {
                this._activeTexture = new Texture(gl, this.generateWhiteTexture(dc));
                dc.gpuResourceCache.putResource(this._whiteTextureCacheKey, this._activeTexture, 4 * 4 * 3);
            }

            gl.vertexAttrib4f(program.vertexTexCoordLocation, 0.25, 0.25, 0, 1);
        }
        program.loadUniformTextureUnit(gl, gl.TEXTURE0, program.textureUnitLocation);

        return this._activeTexture.bind(dc);
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

    SurfaceShape.prototype.calculateVolumeVerticalLimits = function (dc) {
        // TODO more accurate volume limits that represent geographical extent and terrain
        return {min: -5000, max: 200000};
    };

    SurfaceShape.prototype.assembleVertexArray = function (dc) {
        this.calculateCenter(dc);
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
        var len = this._textureCoordinates.length, i, pair, idx = 0;

        this._textureArray = new Float32Array(len * 2);

        for (i = 0; i < len; i++) {
            pair = this._textureCoordinates[i];
            this._textureArray[idx++] = pair[0];
            this._textureArray[idx++] = pair[1];
        }
    };

    SurfaceShape.prototype.generateWhiteTexture = function (dc) {
        var canvas = document.createElement("canvas"), ctx;
        canvas.setAttribute("width", "2");
        canvas.setAttribute("height", "2");
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
        ctx.fillRect(0, 0, 2, 2);

        return canvas;
    };

    return SurfaceShape;
});