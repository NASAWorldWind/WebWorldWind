/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Text
 * @version $Id: Text.js 3345 2015-07-28 20:28:35Z dcollins $
 */
define([
        '../error/ArgumentError',
        '../shaders/BasicTextureProgram',
        '../util/Color',
        '../util/Font',
        '../util/Logger',
        '../geom/Matrix',
        '../pick/PickedObject',
        '../render/Renderable',
        '../shapes/TextAttributes',
        '../error/UnsupportedOperationError',
        '../geom/Vec2',
        '../geom/Vec3',
        '../util/WWMath'
    ],
    function (ArgumentError,
              BasicTextureProgram,
              Color,
              Font,
              Logger,
              Matrix,
              PickedObject,
              Renderable,
              TextAttributes,
              UnsupportedOperationError,
              Vec2,
              Vec3,
              WWMath) {
        "use strict";

        /**
         * Constructs a text shape. This constructor is intended to be called only by subclasses.
         * @alias Text
         * @constructor
         * @augments Renderable
         * @classdesc Represents a string of text displayed at a specified geographic or screen position.
         * This is an abstract class meant to be subclassed and not meant to be instantiated directly.
         * See {@link GeographicText} and {@link ScreenText} for concrete classes.
         *
         * @param {String} text The text to display.
         * @throws {ArgumentError} If the specified text is null or undefined.
         */
        var Text = function (text) {
            if (!text) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Text", "constructor", "missingText"));
            }

            Renderable.call(this);

            /**
             * The text's attributes. If null and this text is not highlighted, this text is not drawn.
             * @type {TextAttributes}
             * @default see [TextAttributes]{@link TextAttributes}
             */
            this.attributes = new TextAttributes(null);

            /**
             * The attributes used when this text's highlighted flag is true. If null and the
             * highlighted flag is true, this text's normal attributes are used. If they, too, are null, this
             * text is not drawn.
             * @type {TextAttributes}
             * @default null
             */
            this.highlightAttributes = null;

            /**
             * Indicates whether this text uses its highlight attributes rather than its normal attributes.
             * @type {boolean}
             * @default false
             */
            this.highlighted = false;

            /**
             * Indicates whether this text is drawn.
             * @type {boolean}
             * @default true
             */
            this.enabled = true;

            /**
             * This shape's text. If null or empty, no text is drawn.
             * @type {String}
             * @default null
             */
            this.text = text;

            /**
             * This text's altitude mode. May be one of
             * <ul>
             *  <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
             *  <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
             *  <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
             * </ul>
             * @default WorldWind.ABSOLUTE
             */
            this.altitudeMode = WorldWind.ABSOLUTE;

            /**
             * Indicates the object to return as the userObject of this text when picked. If null,
             * then this text object is returned as the userObject.
             * @type {Object}
             * @default null
             * @see  [PickedObject.userObject]{@link PickedObject#userObject}
             */
            this.pickDelegate = null;

            /**
             * Indicates whether this text has visual priority over other shapes in the scene.
             * @type {Boolean}
             * @default false
             */
            this.alwaysOnTop = false;

            /**
             * This shape's target visibility, a value between 0 and 1. During ordered rendering this shape modifies its
             * [current visibility]{@link Text#currentVisibility} towards its target visibility at the rate
             * specified by the draw context's [fadeVelocity]{@link DrawContext#fadeVelocity} property. The target
             * visibility and current visibility are used to control the fading in and out of this shape.
             * @type {Number}
             * @default 1
             */
            this.targetVisibility = 1;

            /**
             * This shape's current visibility, a value between 0 and 1. This property scales the shape's effective
             * opacity. It is incremented or decremented each frame according to the draw context's
             * [fade velocity]{@link DrawContext#fadeVelocity} property in order to achieve this shape's current
             * [target visibility]{@link Text#targetVisibility}. This current visibility and target visibility are
             * used to control the fading in and out of this shape.
             * @type {Number}
             * @default 1
             * @readonly
             */
            this.currentVisibility = 1;

            /**
             * Indicates the group ID of the declutter group to include this Text shape. If non-zer0, this shape
             * is decluttered relative to all other shapes within its group.
             * @type {Number}
             * @default 0
             */
            this.declutterGroup = 0;

            /**
             * The image to display when this text shape is eliminated from the scene due to decluttering.
             * @type {String}
             * @default A round dot drawn in this shape's text color.
             */
            this.markerImageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

            /**
             * The scale to apply to the [markerImageSource]{@link Text#markerImageSource}.
             * @type {Number}
             * @default 0.1
             */
            this.markerImageScale = 0.1;

            // Internal use only. Intentionally not documented.
            this.activeAttributes = null;

            // Internal use only. Intentionally not documented.
            this.activeTexture = null;

            // Internal use only. Intentionally not documented.
            this.imageTransform = Matrix.fromIdentity();

            // Internal use only. Intentionally not documented.
            this.texCoordMatrix = Matrix.fromIdentity();

            // Internal use only. Intentionally not documented.
            this.imageBounds = null;

            // Internal use only. Intentionally not documented.
            this.layer = null;

            // Internal use only. Intentionally not documented.
            this.depthOffset = -0.003;

            // Internal use only. Intentionally not documented.
            this.screenPoint = new Vec3(0, 0, 0);
        };

        // Internal use only. Intentionally not documented.
        Text.matrix = Matrix.fromIdentity(); // scratch variable
        Text.glPickPoint = new Vec3(0, 0, 0); // scratch variable

        Text.prototype = Object.create(Renderable.prototype);

        /**
         * Copies the contents of a specified text object to this text object.
         * @param {Text} that The text object to copy.
         */
        Text.prototype.copy = function (that) {
            this.text = that.text;
            this.attributes = that.attributes;
            this.highlightAttributes = that.highlightAttributes;
            this.highlighted = that.highlighted;
            this.enabled = that.enabled;
            this.altitudeMode = that.altitudeMode;
            this.pickDelegate = that.pickDelegate;
            this.alwaysOnTop = that.alwaysOnTop;
            this.depthOffset = that.depthOffset;
            this.declutterGroup = that.declutterGroup;
            this.targetVisibility = that.targetVisibility;
            this.currentVisibility = that.currentVisibility;

            return this;
        };

        Object.defineProperties(Text.prototype, {
            /**
             * Indicates the screen coordinate bounds of this shape during ordered rendering.
             * @type {Rectangle}
             * @readonly
             * @memberof Text.prototype
             */
            screenBounds: {
                get: function () {
                    return this.imageBounds;
                }
            }
        });

        /**
         * Renders this text. This method is typically not called by applications but is called by
         * [RenderableLayer]{@link RenderableLayer} during rendering. For this shape this method creates and
         * enques an ordered renderable with the draw context and does not actually draw the text.
         * @param {DrawContext} dc The current draw context.
         */
        Text.prototype.render = function (dc) {
            if (!this.enabled || (!this.text) || this.text.length === 0) {
                return;
            }

            if (!dc.accumulateOrderedRenderables) {
                return;
            }

            // Create an ordered renderable for this text. If one has already been created this frame then we're
            // in 2D-continuous mode and another needs to be created for one of the alternate globe offsets.
            var orderedText;
            if (this.lastFrameTime != dc.timestamp) {
                orderedText = this.makeOrderedRenderable(dc);
            } else {
                var textCopy = this.clone();
                orderedText = textCopy.makeOrderedRenderable(dc);
            }

            if (!orderedText) {
                return;
            }

            if (!orderedText.isVisible(dc)) {
                return;
            }

            orderedText.layer = dc.currentLayer;

            this.lastFrameTime = dc.timestamp;
            dc.addOrderedRenderable(orderedText);
        };

        /**
         * Draws this shape as an ordered renderable. Applications do not call this function. It is called by
         * {@link WorldWindow} during rendering. Implements the {@link OrderedRenderable} interface.
         * @param {DrawContext} dc The current draw context.
         */
        Text.prototype.renderOrdered = function (dc) {
            // Optimize away the case of achieved target visibility of 0 and no marker image to display in that case.
            if (this.currentVisibility === 0 && this.targetVisibility === 0 && !this.markerImageSource) {
                return;
            }

            this.drawOrderedText(dc);

            if (dc.pickingMode) {
                var po = new PickedObject(this.pickColor.clone(), this.pickDelegate ? this.pickDelegate : this,
                    this.position, this.layer, false);

                dc.resolvePick(po);
            }
        };

        // Intentionally not documented.
        Text.prototype.makeOrderedRenderable = function (dc) {
            var w, h, s,
                offset;

            this.determineActiveAttributes(dc);
            if (!this.activeAttributes) {
                return null;
            }

            //// Compute the text's screen point and distance to the eye point.
            if (!this.computeScreenPointAndEyeDistance(dc)) {
                return null;
            }

            var labelFont = this.activeAttributes.font,
                textureKey = this.text + labelFont.toString();

            this.activeTexture = dc.gpuResourceCache.resourceForKey(textureKey);
            if (!this.activeTexture) {
                this.activeTexture = dc.textSupport.createTexture(dc, this.text, labelFont, true);
                dc.gpuResourceCache.putResource(textureKey, this.activeTexture, this.activeTexture.size);
            }

            w = this.activeTexture.imageWidth;
            h = this.activeTexture.imageHeight;
            s = this.activeAttributes.scale;
            offset = this.activeAttributes.offset.offsetForSize(w, h);

            this.imageTransform.setTranslation(
                this.screenPoint[0] - offset[0] * s,
                this.screenPoint[1] - offset[1] * s,
                this.screenPoint[2]);

            this.imageTransform.setScale(w * s, h * s, 1);

            this.imageBounds = WWMath.boundingRectForUnitQuad(this.imageTransform);

            return this;
        };

        /**
         * Computes this shape's screen point and eye distance. Subclasses must override this method.
         * @param {DrawContext} dc The current draw context.
         * @returns {Boolean} true if the screen point can be computed, otherwise false.
         * @protected
         */
        Text.prototype.computeScreenPointAndEyeDistance = function (dc) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Renderable", "render", "abstractInvocation"));
        };

        // Internal. Intentionally not documented.
        Text.prototype.determineActiveAttributes = function (dc) {
            if (this.highlighted && this.highlightAttributes) {
                this.activeAttributes = this.highlightAttributes;
            } else {
                this.activeAttributes = this.attributes;
            }
        };

        // Internal. Intentionally not documented.
        Text.prototype.isVisible = function (dc) {
            if (dc.pickingMode) {
                return dc.pickRectangle && this.imageBounds.intersects(dc.pickRectangle);
            } else {
                return this.imageBounds.intersects(dc.navigatorState.viewport);
            }
        };

        // Internal. Intentionally not documented.
        Text.prototype.drawOrderedText = function (dc) {
            this.beginDrawing(dc);

            try {
                this.doDrawOrderedText(dc);
                if (!dc.pickingMode) {
                    //this.drawBatchOrderedText(dc);
                }
            } finally {
                this.endDrawing(dc);
            }
        };

        // Internal. Intentionally not documented.
        Text.prototype.drawBatchOrderedText = function (dc) {
            // Draw any subsequent text in the ordered renderable queue, removing each from the queue as it's
            // processed. This avoids the overhead of setting up and tearing down OpenGL state for each text shape.

            var or;

            while ((or = dc.peekOrderedRenderable()) && or instanceof Text) {
                dc.popOrderedRenderable(); // remove it from the queue

                try {
                    or.doDrawOrderedText(dc)
                } catch (e) {
                    Logger.logMessage(Logger.LEVEL_WARNING, 'Text', 'drawBatchOrderedText',
                        "Error occurred while rendering text using batching: " + e.message);
                }
                // Keep going. Render the rest of the ordered renderables.
            }
        };

        // Internal. Intentionally not documented.
        Text.prototype.beginDrawing = function (dc) {
            var gl = dc.currentGlContext,
                program;

            dc.findAndBindProgram(BasicTextureProgram);

            // Configure GL to use the draw context's unit quad VBOs for both model coordinates and texture coordinates.
            // Most browsers can share the same buffer for vertex and texture coordinates, but Internet Explorer requires
            // that they be in separate buffers, so the code below uses the 3D buffer for vertex coords and the 2D
            // buffer for texture coords.
            program = dc.currentProgram;
            gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer3());
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer());
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.enableVertexAttribArray(program.vertexTexCoordLocation);

            // Tell the program which texture unit to use.
            program.loadTextureUnit(gl, gl.TEXTURE0);

            // Turn off texturing in picking mode.
            if (dc.pickingMode) {
                program.loadTextureEnabled(gl, false);
            }

            // Turn off color modulation since we want to pick against the text box and not just the text.
            program.loadModulateColor(gl, false);

            // Suppress depth-buffer writes.
            gl.depthMask(false);

            // The currentTexture field is used to avoid re-specifying textures unnecessarily. Clear it to start.
            Text.currentTexture = null;
        };

        // Internal. Intentionally not documented.
        Text.prototype.endDrawing = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            // Clear the vertex attribute state.
            gl.disableVertexAttribArray(program.vertexPointLocation);
            gl.disableVertexAttribArray(program.vertexTexCoordLocation);

            // Clear GL bindings.
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);

            gl.depthMask(true);

            // Avoid keeping a dangling reference to the current texture.
            Text.currentTexture = null;
        };

        // Internal. Intentionally not documented.
        Text.prototype.doDrawOrderedText = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                textureBound;

            if (dc.pickingMode) {
                this.pickColor = dc.uniquePickColor();
            }

            // Compute the effective visibility. Use the current value if picking.
            if (!dc.pickingMode) {
                if (this.currentVisibility != this.targetVisibility) {
                    var visibilityDelta = (dc.timestamp - dc.previousRedrawTimestamp) / dc.fadeTime;
                    if (this.currentVisibility < this.targetVisibility) {
                        this.currentVisibility = Math.min(1, this.currentVisibility + visibilityDelta);
                    } else {
                        this.currentVisibility = Math.max(0, this.currentVisibility - visibilityDelta);
                    }
                    dc.redrawRequested = true;
                }
            }

            if (this.currentVisibility > 0) {
                // Draw the text, with its effective opacity scaled by the current visibility.

                // Compute and specify the MVP matrix.
                Text.matrix.copy(dc.screenProjection);
                Text.matrix.multiplyMatrix(this.imageTransform);
                program.loadModelviewProjection(gl, Text.matrix);

                // Set the pick color for picking or the color, opacity and texture if not picking.
                if (dc.pickingMode) {
                    program.loadColor(gl, this.pickColor);
                    program.loadTextureEnabled(gl, false);
                } else {
                    program.loadColor(gl, this.activeAttributes.color);
                    program.loadOpacity(gl, this.layer.opacity * this.currentVisibility);

                    this.texCoordMatrix.setToIdentity();
                    if (this.activeTexture) {
                        this.texCoordMatrix.multiplyByTextureTransform(this.activeTexture);
                    }
                    program.loadTextureMatrix(gl, this.texCoordMatrix);

                    // Avoid unnecessary texture state changes
                    if (this.activeTexture && this.activeTexture != Text.currentTexture) {
                        textureBound = this.activeTexture.bind(dc); // returns false if texture is null or cannot be bound
                        program.loadTextureEnabled(gl, textureBound);
                        Text.currentTexture = this.activeTexture;
                    }
                }

                // Turn off depth testing for the label unless it's been requested.
                if (!this.activeAttributes.depthTest) {
                    gl.disable(gl.DEPTH_TEST, false);
                }
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                if (!this.activeAttributes.depthTest) {
                    // Turn depth testing back on.
                    gl.disable(gl.DEPTH_TEST, true);
                }
            }

            if (this.currentVisibility < 1 && this.markerImageSource) {
                // Draw an icon at the text's geographic position to indicate that something is there.

                var markerTexture = dc.gpuResourceCache.resourceForKey(this.markerImageSource);
                if (!markerTexture) {
                    dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this.markerImageSource);
                    return;
                }

                var s = this.markerImageScale;
                var markerTransform = Matrix.fromIdentity();
                markerTransform.setTranslation(
                    this.screenPoint[0] - s * markerTexture.imageWidth / 2,
                    this.screenPoint[1] - s * markerTexture.imageWidth / 2,
                    this.screenPoint[2]);

                markerTransform.setScale(markerTexture.imageWidth * s, markerTexture.imageHeight * s, 1);

                Text.matrix.copy(dc.screenProjection);
                Text.matrix.multiplyMatrix(markerTransform);
                program.loadModelviewProjection(gl, Text.matrix);

                if (dc.pickingMode) {
                    program.loadColor(gl, this.pickColor);
                    program.loadTextureEnabled(gl, false);
                } else {
                    program.loadColor(gl, this.activeAttributes.color);
                    program.loadOpacity(gl, this.layer.opacity * ( 1 - this.currentVisibility));

                    var tcMatrix = Matrix.fromIdentity();
                    tcMatrix.multiplyByTextureTransform(markerTexture);
                    program.loadTextureMatrix(gl, tcMatrix);

                    // Avoid unnecessary texture state changes
                    if (markerTexture != Text.currentTexture) {
                        textureBound = markerTexture.bind(dc); // returns false if texture is null or cannot be bound
                        program.loadTextureEnabled(gl, textureBound);
                        Text.currentTexture = markerTexture;
                    }
                }

                // Turn off depth testing unless it's been requested.
                if (!this.activeAttributes.depthTest) {
                    gl.disable(gl.DEPTH_TEST, false);
                }
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                if (!this.activeAttributes.depthTest) {
                    // Turn depth testing back on.
                    gl.enable(gl.DEPTH_TEST, true);
                }
            }
        };

        return Text;
    });