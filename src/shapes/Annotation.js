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
        '../util/Insets',
        '../util/Logger',
        '../geom/Matrix',
        '../util/Offset',
        '../pick/PickedObject',
        '../render/Renderable',
        '../shapes/TextAttributes',
        '../geom/Vec2',
        '../geom/Vec3',
        '../util/WWMath'
    ],
    function (AnnotationAttributes,
              ArgumentError,
              BasicTextureProgram,
              Color,
              Font,
              Insets,
              Logger,
              Matrix,
              Offset,
              PickedObject,
              Renderable,
              TextAttributes,
              Vec2,
              Vec3,
              WWMath) {
        "use strict";

        /**
         * Constructs an annotation.
         * @alias Annotation
         * @constructor
         * @augments Renderable
         * @classdesc Represents an Annotation shape. An annotation displays a callout, a text and a leader pointing
         * the annotation's geographic position to the ground.
         * @param {Position} position The annotations's geographic position.
         * @param {AnnotationAttributes} attributes The attributes to associate with this annotation.
         * @throws {ArgumentError} If the specified position is null or undefined.
         */
        var Annotation = function (position, attributes) {

            if (!position) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Annotation", "constructor", "missingPosition"));
            }

            Renderable.call(this);

            /**
             * This annotation's geographic position.
             * @type {Position}
             */
            this.position = position;

            /**
             * The annotation's attributes.
             * @type {AnnotationAttributes}
             * @default see [AnnotationAttributes]{@link AnnotationAttributes}
             */
            this.attributes = attributes ? attributes : new AnnotationAttributes(null);

            /**
             * This annotation's altitude mode. May be one of
             * <ul>
             *  <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
             *  <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
             *  <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
             * </ul>
             * @default WorldWind.ABSOLUTE
             */
            this.altitudeMode = WorldWind.ABSOLUTE;

            // Internal use only. Intentionally not documented.
            this.layer = null;

            // Internal use only. Intentionally not documented.
            this.lastStateKey = null;

            // Internal use only. Intentionally not documented.
            this.calloutTransform = Matrix.fromIdentity();

            // Internal use only. Intentionally not documented.
            this.calloutOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0);

            // Internal use only. Intentionally not documented.
            this.label = "";

            // Internal use only. Intentionally not documented.
            this.labelTexture = null;

            // Internal use only. Intentionally not documented.
            this.labelTransform = Matrix.fromIdentity();

            // Internal use only. Intentionally not documented.
            this.labelAttributes = new TextAttributes(null);

            // Internal use only. Intentionally not documented.
            this.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);

            // Internal use only. Intentionally not documented.
            this.placePoint = new Vec3(0, 0, 0);

            // Internal use only. Intentionally not documented.
            this.depthOffset = -2.05;

            // Internal use only. Intentionally not documented.
            this.calloutPoints = null;
        };

        Annotation.matrix = Matrix.fromIdentity();
        Annotation.screenPoint = new Vec3(0, 0, 0);
        Annotation.scratchPoint = new Vec3(0, 0, 0);

        Annotation.prototype = Object.create(Renderable.prototype);

        Object.defineProperties(Annotation.prototype, {

            /**
             * The text for this annotation.
             * @type {String}
             * @memberof Annotation.prototype
             */
            text: {
                get: function () {
                    return this.label;
                },
                set: function (value) {
                    this.label = value;
                    this.lastStateKey = null;
                }
            },

            /**
             * The text color for this annotation.
             * @type {Color}
             * @memberof Annotation.prototype
             */
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

            if (!orderedAnnotation) {
                return;
            }

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

            var w, h, s, iLeft, iRight, iTop, iBottom,
                offset, leaderGapHeight;

            // Wraps the text based and the width and height that were set for the
            // annotation
            this.label = dc.textSupport.wrap(
                this.label,
                this.attributes.width,this.attributes.height,
                this.labelAttributes.font);

            // Compute the annotation's model point.
            dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
                this.altitudeMode, this.placePoint);

            // Compute the annotation's screen point in the OpenGL coordinate system of the WorldWindow
            // by projecting its model coordinate point onto the viewport. Apply a depth offset in order
            // to cause the annotation to appear above nearby terrain.
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

            w = this.labelTexture.imageWidth;
            h = this.labelTexture.imageHeight;
            s = this.attributes.scale;
            iLeft = this.attributes.insets.left;
            iRight = this.attributes.insets.right;
            iTop = this.attributes.insets.top;
            iBottom = this.attributes.insets.bottom;
            leaderGapHeight = this.attributes.leaderGapHeight;

            offset = this.calloutOffset.offsetForSize((w + iLeft + iRight) * s, (h + iTop + iBottom) * s);

            this.calloutTransform.setTranslation(
                Annotation.screenPoint[0] - offset[0],
                Annotation.screenPoint[1] + leaderGapHeight,
                Annotation.screenPoint[2]);

            this.labelTransform.setTranslation(
                Annotation.screenPoint[0] - offset[0] + iLeft * s,
                Annotation.screenPoint[1] + leaderGapHeight + iBottom * s,
                Annotation.screenPoint[2]);

            this.labelTransform.setScale(w * s, h * s, 1);

            this.labelBounds = WWMath.boundingRectForUnitQuad(this.labelTransform);

            // Compute dimensions of the callout taking in consideration the insets
            var width = (w + iLeft + iRight) * s;
            var height = (h + iTop + iBottom) * s;

            var leaderOffsetX = (width / 2);

            var leaderOffsetY = -leaderGapHeight;

            if (!this.attributes.drawLeader) {
                leaderOffsetY = 0;
            }

            if (this.attributes.stateKey != this.lastStateKey){
                this.calloutPoints = this.createCallout(
                    width, height,
                    leaderOffsetX, leaderOffsetY,
                    this.attributes.leaderGapWidth, this.attributes.cornerRadius);
            }

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
            if (cornerRadius < 1) {
                return startIdx;
            }

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
        Annotation.prototype.createCallout = function (width, height, leaderOffsetX, leaderOffsetY, leaderGapWidth,
                                                       cornerRadius) {

            var cornerSteps = 16;

            var numVertices = 2 * (12 + (cornerRadius < 1 ? 0 : 4 * (cornerSteps - 2)));

            var buffer = new Float32Array(numVertices);

            var idx = 0;

            //Bottom right
            buffer[idx++] = width / 2 + leaderGapWidth / 2;
            buffer[idx++] = 0;
            buffer[idx++] = width - cornerRadius;
            buffer[idx++] = 0;
            idx = this.drawCorner(width - cornerRadius, cornerRadius, cornerRadius, -Math.PI / 2, 0,
                cornerSteps, buffer, idx);

            //Right
            buffer[idx++] = width;
            buffer[idx++] = cornerRadius;
            buffer[idx++] = width;
            buffer[idx++] = height - cornerRadius;
            idx = this.drawCorner(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2,
                cornerSteps, buffer, idx);

            //Top
            buffer[idx++] = width - cornerRadius;
            buffer[idx++] = height;
            buffer[idx++] = cornerRadius;
            buffer[idx++] = height;
            idx = this.drawCorner(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI,
                cornerSteps, buffer, idx);

            //Left
            buffer[idx++] = 0;
            buffer[idx++] = height - cornerRadius;
            buffer[idx++] = 0;
            buffer[idx++] = cornerRadius;
            idx = this.drawCorner(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 1.5,
                cornerSteps, buffer, idx);

            //Bottom left
            buffer[idx++] = cornerRadius;
            buffer[idx++] = 0;
            buffer[idx++] = width / 2 - leaderGapWidth / 2;
            buffer[idx++] = 0;

            //Draw leader
            buffer[idx++] = leaderOffsetX;
            buffer[idx++] = leaderOffsetY;

            buffer[idx++] = width / 2 + leaderGapWidth / 2;
            buffer[idx] = 0;

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

            program.loadOpacity(gl, this.attributes.opacity);

            // Attributes have changed. We need to track this because the callout vbo data may
            // have changed if scaled or text wrapping changes callout dimensions
            var calloutAttributesChanged = (this.attributes.stateKey != this.lastStateKey);

            // Create new cache key if callout drawing points have changed
            if (!this.calloutCacheKey || calloutAttributesChanged) {
                this.calloutCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            var calloutVboId = dc.gpuResourceCache.resourceForKey(this.calloutCacheKey);

            if (!calloutVboId) {
                calloutVboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(this.calloutCacheKey, calloutVboId,
                    this.calloutPoints.length * 4);

                refreshBuffers = true;
            }

            // Remove the last generated vbo data if attributes changed
            if (calloutAttributesChanged && this.calloutCacheKey){
                dc.gpuResourceCache.removeResource(this.calloutCacheKey);
            }

            // Store current statekey because we are no longer using it
            // in this iteration
            this.lastStateKey = this.attributes.stateKey;

            // Compute and specify the MVP matrix.
            Annotation.matrix.copy(dc.screenProjection);
            Annotation.matrix.multiplyMatrix(this.calloutTransform);
            program.loadModelviewProjection(gl, Annotation.matrix);

            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, calloutVboId);

            if (refreshBuffers) {
                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER,
                    this.calloutPoints, WebGLRenderingContext.STATIC_DRAW);

                dc.frameStatistics.incrementVboLoadCount(1);
            }

            program.loadColor(gl, dc.pickingMode ? this.pickColor : this.attributes.backgroundColor);
            program.loadTextureEnabled(gl, false);

            gl.vertexAttribPointer(program.vertexPointLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, WebGLRenderingContext.FLOAT, false, 0, 0);

            gl.drawArrays(WebGLRenderingContext.TRIANGLE_FAN, 0, this.calloutPoints.length / 2);

            // Draw text
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