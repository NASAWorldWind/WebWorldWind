/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
        '../shapes/AnnotationAttributes',
        '../error/ArgumentError',
        '../shaders/BasicTextureProgram',
        '../util/Color',
        '../util/Font',
        '../util/Logger',
        '../geom/Matrix',
        '../util/Offset',
        '../pick/PickedObject',
        '../render/Renderable',
        '../geom/Vec2',
        '../geom/Vec3',
        '../util/WWMath',
        '../shapes/TextAttributes'
    ],
    function (AnnotationAttributes,
              ArgumentError,
              BasicTextureProgram,
              Color,
              Font,
              Logger,
              Matrix,
              Offset,
              PickedObject,
              Renderable,
              Vec2,
              Vec3,
              WWMath,
              TextAttributes) {
        "use strict";

        var Annotation = function (position, attributes) {

            if (!position) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Annotation", "constructor", "missingPosition"));
            }

            Renderable.call(this);

            this.position = position;

            this.attributes = attributes ? attributes : new AnnotationAttributes(null);

            this.layer = null;

            this.calloutTransform = Matrix.fromIdentity();

            this.calloutOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0);

            this.label = "";

            this.labelTexture = null;

            this.labelTransform = Matrix.fromIdentity();

            this.labelAttributes = new TextAttributes(null);

            this.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);

            this.altitudeMode = WorldWind.ABSOLUTE;

            this.placePoint = new Vec3(0, 0, 0);

            this.depthOffset = -2.05;

            this.calloutPoints = null;
        };

        Annotation.matrix = Matrix.fromIdentity();
        Annotation.screenPoint = new Vec3(0, 0, 0);
        Annotation.scratchPoint = new Vec3(0, 0, 0);

        Annotation.prototype = Object.create(Renderable.prototype);

        Object.defineProperties(Annotation.prototype, {
            text: {
                get: function () {
                    return this.label;
                },
                set: function (value) {
                    this.label = value;
                }
            },
            textColor: {
                get: function () {
                    return this.attributes.textColor;
                },
                set: function (value) {
                    this.attributes.textColor = value;
                }
            }
        });

        /**
         * Draws this shape as an ordered renderable. Applications do not call this function. It is called by
         * [WorldWindow]{@link WorldWindow} during rendering.
         * @param {DrawContext} dc The current draw context.
         */
        Annotation.prototype.renderOrdered = function (dc) {

            this.drawOrderedAnnotation(dc);

            if (dc.pickingMode) {

                var po = new PickedObject(this.pickColor.clone(), this,
                    this.position, this.layer, false);

                if (dc.pickPoint) {
                    if (this.labelBounds.containsPoint(
                            dc.navigatorState.convertPointToViewport(dc.pickPoint, Annotation.scratchPoint))) {
                        po.labelPicked = true;
                    }
                }

                dc.resolvePick(po);
            }
        };

        /**
         * Renders this annotation. This method is typically not called by applications but is called by
         * {@link RenderableLayer} during rendering. For this shape this method creates and
         * enques an ordered renderable with the draw context and does not actually draw the annotation.
         * @param {DrawContext} dc The current draw context.
         */
        Annotation.prototype.render = function (dc) {

            var orderedAnnotation = this.makeOrderedRenderable(dc);

            if (!orderedAnnotation)
                return;

            orderedAnnotation.layer = dc.currentLayer;

            dc.addOrderedRenderable(orderedAnnotation);
        };

        // Internal. Intentionally not documented.
        Annotation.prototype.drawOrderedAnnotation = function (dc) {
            this.beginDrawing(dc);

            try {
                this.doDrawOrderedAnnotation(dc);
            } finally {
                this.endDrawing(dc);
            }
        };

        /* INTENTIONALLY NOT DOCUMENTED
         * Creates an ordered renderable for this shape.
         * @protected
         * @param {DrawContext} dc The current draw context.
         * @returns {OrderedRenderable} The ordered renderable. May be null, in which case an ordered renderable
         * cannot be created or should not be created at the time this method is called.
         */
        Annotation.prototype.makeOrderedRenderable = function (dc) {

            //TODO: add min width and min height to attributes
            this.label = dc.textSupport.wrap(this.label, 200, 100, this.labelAttributes.font);

            var w, h, s, iLeft, iRight, iTop, iBottom,
                offset;

            dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
                this.altitudeMode, this.placePoint);

            if (!dc.navigatorState.projectWithDepth(this.placePoint, this.depthOffset, Annotation.screenPoint)) {
                return null;
            }

            var labelFont = this.labelAttributes.font;
            var labelKey = this.label + labelFont.toString();

            this.labelTexture = dc.gpuResourceCache.resourceForKey(labelKey);

            if (!this.labelTexture) {
                this.labelTexture = dc.textSupport.createTexture(dc, this.label, labelFont, false);
                dc.gpuResourceCache.putResource(labelKey, this.labelTexture, this.labelTexture.size);
            }

            this.labelTransform.setScale(w * s, h * s, 1);

            this.labelBounds = WWMath.boundingRectForUnitQuad(this.labelTransform);

            w = this.labelTexture.imageWidth;
            h = this.labelTexture.imageHeight;
            s = this.attributes.scale;
            iLeft = this.attributes.insetLeft;
            iRight = this.attributes.insetRight;
            iTop = this.attributes.insetTop;
            iBottom = this.attributes.insetBottom;

            offset = this.calloutOffset.offsetForSize((w + iLeft + iRight) * s, (h + iTop + iBottom) * s);

            this.calloutTransform.setTranslation(
                Annotation.screenPoint[0] - offset[0],
                Annotation.screenPoint[1] + 30,
                Annotation.screenPoint[2]);

            this.labelTransform.setTranslation(
                Annotation.screenPoint[0] - offset[0] + this.attributes.insetLeft * this.attributes.scale,
                Annotation.screenPoint[1] + 30 + this.attributes.insetBottom * this.attributes.scale,
                Annotation.screenPoint[2]);

            return this;
        };

        // Internal. Intentionally not documented.
        Annotation.prototype.beginDrawing = function (dc) {
            var gl = dc.currentGlContext,
                program;

            dc.findAndBindProgram(BasicTextureProgram);

            program = dc.currentProgram;

            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.enableVertexAttribArray(program.vertexTexCoordLocation);

            program.loadModulateColor(gl, dc.pickingMode);
        };

        // Internal. Intentionally not documented.
        Annotation.prototype.endDrawing = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            // Clear the vertex attribute state.
            gl.disableVertexAttribArray(program.vertexPointLocation);
            gl.disableVertexAttribArray(program.vertexTexCoordLocation);

            // Clear GL bindings.
            dc.bindProgram(null);
        };

        // Internal. Intentionally not documented.
        Annotation.prototype.drawCorner = function (x0, y0, cornerRadius, start, end, steps, buffer, startIdx) {
            if (cornerRadius < 1)
                return startIdx;

            var step = (end - start) / (steps - 1);
            for (var i = 1; i < steps - 1; i++) {
                var a = start + step * i;
                var x = x0 + Math.cos(a) * cornerRadius;
                var y = y0 + Math.sin(a) * cornerRadius;
                buffer[startIdx++] = x;
                buffer[startIdx++] = y;
            }

            return startIdx;
        };

        // Internal. Intentionally not documented.
        Annotation.prototype.createCallout = function (width, height, leaderOffsetX, leaderOffsetY, leaderGapWidth, cornerRadius) {

            var cornerSteps = 16;

            var numVertices = 2 * (12 + (cornerRadius < 1 ? 0 : 4 * (cornerSteps - 2)));

            var buffer = new Float32Array(numVertices);

            var idx = 0;

            //Bottom right
            buffer[idx++] = width / 2 + leaderGapWidth / 2;
            buffer[idx++] = 0;
            buffer[idx++] = width - cornerRadius;
            buffer[idx++] = 0;
            idx = this.drawCorner(width - cornerRadius, cornerRadius, cornerRadius, -Math.PI / 2, 0, cornerSteps, buffer, idx);

            //Right
            buffer[idx++] = width;
            buffer[idx++] = cornerRadius;
            buffer[idx++] = width;
            buffer[idx++] = height - cornerRadius;
            idx = this.drawCorner(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, cornerSteps, buffer, idx);

            //Top
            buffer[idx++] = width - cornerRadius;
            buffer[idx++] = height;
            buffer[idx++] = cornerRadius;
            buffer[idx++] = height;
            idx = this.drawCorner(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, cornerSteps, buffer, idx);

            //Left
            buffer[idx++] = 0;
            buffer[idx++] = height - cornerRadius;
            buffer[idx++] = 0;
            buffer[idx++] = cornerRadius;
            idx = this.drawCorner(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 2, cornerSteps, buffer, idx);

            //Bottom left
            buffer[idx++] = cornerRadius;
            buffer[idx++] = 0;
            buffer[idx++] = width / 2 - leaderGapWidth / 2;
            buffer[idx++] = 0;

            //Draw leader
            buffer[idx++] = leaderOffsetX;
            buffer[idx++] = leaderOffsetY;

            buffer[idx++] = width / 2 + leaderGapWidth / 2;
            buffer[idx++] = 0;

            return buffer;
        };

        // Internal. Intentionally not documented.
        Annotation.prototype.doDrawOrderedAnnotation = function (dc) {

            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                textureBound;

            var refreshBuffers = false;

            if (dc.pickingMode) {
                this.pickColor = dc.uniquePickColor();
            }

            //Draw callout
            program.loadOpacity(gl, this.attributes.opacity);
            var w = this.labelTexture.imageWidth;
            var h = this.labelTexture.imageHeight;
            var s = this.attributes.scale;

            this.labelTransform.setScale(w * s, h * s, 1);

            var width = (this.labelTexture.imageWidth + this.attributes.insetLeft + this.attributes.insetRight ) * s;
            var height = (this.labelTexture.imageHeight + this.attributes.insetTop + this.attributes.insetBottom) * s;

            var leaderOffsetX = (width / 2);

            //TODO: add leaderoffsety to attributes
            var leaderOffsetY = -30;

            if (!this.attributes.drawLeader) {
                leaderOffsetY = 0;
            }

            this.calloutPoints = this.createCallout(width, height, leaderOffsetX, leaderOffsetY, this.attributes.leaderGapWidth, this.attributes.cornerRadius);

            if (!this.calloutCacheKey) {
                this.calloutCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            var calloutVboId = null;

            if (!calloutVboId) {
                calloutVboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(this.calloutCacheKey, calloutVboId,
                    this.calloutPoints.length * 4);

                refreshBuffers = true;
            }

            // Compute and specify the MVP matrix.
            Annotation.matrix.copy(dc.screenProjection);
            Annotation.matrix.multiplyMatrix(this.calloutTransform);
            program.loadModelviewProjection(gl, Annotation.matrix);

            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, calloutVboId);//dc.unitQuadBuffer3());

            if (refreshBuffers) {
                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.calloutPoints, WebGLRenderingContext.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
            }

            program.loadColor(gl, dc.pickingMode ? this.pickColor : this.attributes.backgroundColor);
            program.loadTextureEnabled(gl, false);

            gl.vertexAttribPointer(program.vertexPointLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);

            gl.drawArrays(WebGLRenderingContext.TRIANGLE_FAN, 0, this.calloutPoints.length / 2);

            //Draw text
            Annotation.matrix.copy(dc.screenProjection);
            Annotation.matrix.multiplyMatrix(this.labelTransform);
            program.loadModelviewProjection(gl, Annotation.matrix);

            program.loadColor(gl, dc.pickingMode ? this.pickColor : this.attributes.textColor);
            textureBound = this.labelTexture.bind(dc);
            program.loadTextureEnabled(gl, textureBound);

            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, dc.unitQuadBuffer3());
            gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 3, WebGLRenderingContext.FLOAT, false, 0, 0);

            gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, 4);
        };

        return Annotation;
    });