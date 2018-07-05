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
 * @exports ScreenImage
 */
define([
        '../error/ArgumentError',
        '../shaders/BasicProgram',
        '../shaders/BasicTextureProgram',
        '../geom/BoundingBox',
        '../util/Color',
        '../render/FramebufferTexture',
        '../util/ImageSource',
        '../geom/Location',
        '../util/Logger',
        '../geom/Matrix',
        '../util/Offset',
        '../shaders/OrthoProgram',
        '../pick/PickedObject',
        '../render/Renderable',
        '../geom/Vec3',
        '../util/WWMath'
    ],
    function (ArgumentError,
              BasicProgram,
              BasicTextureProgram,
              BoundingBox,
              Color,
              FramebufferTexture,
              ImageSource,
              Location,
              Logger,
              Matrix,
              Offset,
              OrthoProgram,
              PickedObject,
              Renderable,
              Vec3,
              WWMath) {
        "use strict";

        /**
         * Constructs a screen image.
         * @alias ScreenImage
         * @constructor
         * @augments Renderable
         * @classdesc Displays an image at a specified screen location in the WorldWindow.
         * The image location is specified by an offset, which causes the image to maintain its relative position
         * when the window size changes.
         * @param {Offset} screenOffset The offset indicating the image's placement on the screen.
         * Use [the image offset property]{@link ScreenImage#imageOffset} to position the image relative to the
         * specified screen offset.
         * @param {String|ImageSource} imageSource The source of the image to display.
         * May be either a string identifying the URL of the image, or an {@link ImageSource} object identifying a
         * dynamically created image.
         * @throws {ArgumentError} If the specified screen offset or image source is null or undefined.
         */
        var ScreenImage = function (screenOffset, imageSource) {
            if (!screenOffset) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenImage", "constructor", "missingOffset"));
            }

            if (!imageSource) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenImage", "constructor", "missingImage"));
            }

            Renderable.call(this);

            /**
             * The offset indicating this screen image's placement on the screen.
             * @type {Offset}
             */
            this.screenOffset = screenOffset;

            // Documented with its property accessor below.
            this._imageSource = imageSource;

            /**
             * The image color. When displayed, this shape's image is multiplied by this image color to achieve the
             * final image color. The color white, the default, causes the image to be drawn in its native colors.
             * @type {Color}
             * @default White (1, 1, 1, 1)
             */
            this.imageColor = Color.WHITE;

            /**
             * Indicates the location within the image at which to align with the specified screen location.
             * May be null, in which case the image's bottom-left corner is placed at the screen location.
             * @type {Offset}
             * @default 0.5, 0.5, both fractional (Centers the image on the screen location.)
             */
            this.imageOffset = new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);

            /**
             * Indicates the amount to scale the image.
             * @type {Number}
             * @default 1
             */
            this.imageScale = 1;

            /**
             * The amount of rotation to apply to the image, measured in degrees clockwise from the top of the window.
             * @type {Number}
             * @default 0
             */
            this.imageRotation = 0;

            /**
             * The amount of tilt to apply to the image, measured in degrees.
             * @type {Number}
             * @default 0
             */
            this.imageTilt = 0;

            /**
             * Indicates whether to draw this screen image.
             * @type {Boolean}
             * @default true
             */
            this.enabled = true;

            /**
             * This image's opacity. When this screen image is drawn, the actual opacity is the product of
             * this opacity and the opacity of the layer containing this screen image.
             * @type {Number}
             */
            this.opacity = 1;

            /**
             * Indicates the object to return as the userObject of this shape when picked. If null,
             * then this shape is returned as the userObject.
             * @type {Object}
             * @default null
             * @see  [PickedObject.userObject]{@link PickedObject#userObject}
             */
            this.pickDelegate = null;

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

            this.debug = false;
            this.framebuffer = null;
            this.orthoMatrix = new Matrix();
            this.boundingBox = new BoundingBox();
            this.boundaries = [
                new Location(30 - 10, -100 - 5),
                new Location(30 - 5, -100 + 5),
                new Location(30 + 5, -100 + 5),
                new Location(30 + 5, -100 - 5)
            ];
        };

        // Internal use only. Intentionally not documented.
        ScreenImage.matrix = Matrix.fromIdentity(); // scratch variable

        ScreenImage.prototype = Object.create(Renderable.prototype);

        Object.defineProperties(ScreenImage.prototype, {
            /**
             * The source of the image to display.
             * May be either a string identifying the URL of the image, or an {@link ImageSource} object identifying a
             * dynamically created image.
             * @type {String|ImageSource}
             * @default null
             * @memberof ScreenImage.prototype
             */
            imageSource: {
                get: function () {
                    return this._imageSource;
                },
                set: function (imageSource) {
                    if (!imageSource) {
                        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenImage", "imageSource",
                            "missingImage"));
                    }

                    this._imageSource = imageSource;
                    this.imageSourceWasUpdated = true;
                }
            }
        });

        /**
         * Renders this screen image. This method is typically not called by applications but is called by
         * {@link RenderableLayer} during rendering. For this shape this method creates and
         * enques an ordered renderable with the draw context and does not actually draw the image.
         * @param {DrawContext} dc The current draw context.
         */
        ScreenImage.prototype.render = function (dc) {
            if (!this.enabled) {
                return;
            }

            if (!dc.accumulateOrderedRenderables) {
                return;
            }

            // Create an ordered renderable, but don't create more than one per frame.
            var orderedScreenImage = null;
            if (this.lastFrameTime !== dc.timestamp) {
                orderedScreenImage = this.makeOrderedRenderable(dc);
            }

            if (!orderedScreenImage) {
                return;
            }

            if (!orderedScreenImage.isVisible(dc)) {
                return;
            }

            orderedScreenImage.layer = dc.currentLayer;

            this.lastFrameTime = dc.timestamp;
            dc.addOrderedRenderable(orderedScreenImage);
        };

        /**
         * Draws this shape as an ordered renderable. Applications do not call this function. It is called by
         * [WorldWindow]{@link WorldWindow} during rendering.
         * @param {DrawContext} dc The current draw context.
         */
        ScreenImage.prototype.renderOrdered = function (dc) {
            this.drawOrderedScreenImage(dc);

            if (dc.pickingMode) {
                var po = new PickedObject(this.pickColor.clone(), this.pickDelegate ? this.pickDelegate : this,
                    null, this.layer, false);
                dc.resolvePick(po);
            }
        };

        // Internal. Intentionally not documented.
        ScreenImage.prototype.makeOrderedRenderable = function (dc) {
            var w, h, s, ws, hs,
                iOffset, sOffset;

            this.activeTexture = this.getActiveTexture(dc);
            if (!this.activeTexture || this.imageSourceWasUpdated) {
                this.activeTexture = dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this._imageSource);
                if (!this.activeTexture) {
                    return null;
                }
            }

            this.eyeDistance = 0;

            // Compute the image's transform matrix and texture coordinate matrix according to its screen point, image size,
            // image offset and image scale. The image offset is defined with its origin at the image's bottom-left corner and
            // axes that extend up and to the right from the origin point.
            w = this.activeTexture.imageWidth;
            h = this.activeTexture.imageHeight;
            s = this.imageScale;
            iOffset = this.imageOffset.offsetForSize(w, h);
            ws = dc.viewport.width;
            hs = dc.viewport.height;
            sOffset = this.screenOffset.offsetForSize(ws, hs);

            this.imageTransform.setTranslation(
                sOffset[0] - iOffset[0] * s,
                sOffset[1] - iOffset[1] * s,
                0);

            this.imageTransform.setScale(w * s, h * s, 1);

            this.imageBounds = WWMath.boundingRectForUnitQuad(this.imageTransform);

            return this;
        };

        ScreenImage.prototype.getActiveTexture = function (dc) {
            if (this.debug) {
                var textureSize = 1024, gl = dc.currentGlContext, program, verts, idx = 0, vbo;
                var texture = {
                    textureId: null,
                    originalImageWidth: textureSize,
                    originalImageHeight: textureSize,
                    imageWidth: textureSize,
                    imageHeight: textureSize,
                    bind: function (dc) {
                        var gl = dc.currentGlContext;

                        gl.bindTexture(gl.TEXTURE_2D, this.textureId);

                        return true;
                    }
                };

                if (!this.framebuffer) {
                    this.framebuffer = new FramebufferTexture(gl, textureSize, textureSize, false);
                }
                dc.bindFramebuffer(this.framebuffer);
                gl.viewport(0, 0, textureSize, textureSize);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                /*
                // program = dc.findAndBindProgram(BasicProgram);
                //
                // verts = new Float32Array(9);
                //
                // verts[idx++] = -0.5;
                // verts[idx++] = -0.5;
                // verts[idx++] = 0;
                //
                // verts[idx++] = 0.5;
                // verts[idx++] = -0.5;
                // verts[idx++] = 0;
                //
                // verts[idx++] = 0;
                // verts[idx++] = 0.5;
                // verts[idx++] = 0;
                //
                // vbo = gl.createBuffer();
                // gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                // gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
                // gl.enableVertexAttribArray(program.vertexPointLocation);
                // gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
                //
                // program.loadColor(gl, Color.RED);
                // program.loadModelviewProjection(gl, Matrix.fromIdentity());
                //
                // gl.drawArrays(gl.TRIANGLES, 0, 3);
                //
                // gl.deleteBuffer(vbo);

                // var temporarily replace the draw context's model view projection matrix with an othro projection
                // var mvp = new Matrix();
                // mvp.copy(dc.modelviewProjection);
                // var orthoMvp = new Matrix();
                // var o = WorldWind.EARTH_RADIUS;
                // orthoMvp.setToOrthographicProjection(-o, o, -o, o, -o * 5, o * 5);
                // // orthoMvp.multiplyMatrix(dc.modelview);
                // orthoMvp.multiplyByLookAtModelview(new WorldWind.Position(0, 0, 0), 1e6, 0, 0, 0, dc.globe);
                // dc.modelviewProjection.copy(orthoMvp);
                //
                // this.drawTerrainWireframe(dc);
                */

                this.drawSquareWithImage(dc);

                texture.textureId = this.framebuffer.texture;
                dc.bindFramebuffer(null);
                gl.viewport(0, 0, dc.viewport.width, dc.viewport.height);
                gl.clearColor(0, 0, 0, 1);
                // dc.modelviewProjection.copy(mvp);

                return texture;
            } else {
                return dc.gpuResourceCache.resourceForKey(this._imageSource);
            }
        };

        ScreenImage.prototype.drawTerrainWireframe = function (dc) {
            if (!dc.terrain || !dc.terrain.tessellator)
                return;

            var gl = dc.currentGlContext,
                terrain = dc.terrain,
                tessellator = terrain.tessellator,
                surfaceGeometry = terrain.surfaceGeometry,
                program,
                terrainTile;

            gl.depthMask(false);
            try {
                program = dc.findAndBindProgram(BasicProgram);
                tessellator.beginRendering(dc);

                for (var i = 0, len = surfaceGeometry.length; i < len; i++) {
                    terrainTile = surfaceGeometry[i];
                    tessellator.beginRenderingTile(dc, terrainTile);
                    program.loadColorComponents(gl, 1, 1, 1, 0.3);
                    tessellator.renderWireframeTile(dc, terrainTile);
                    program.loadColorComponents(gl, 1, 0, 0, 0.6);
                    tessellator.renderTileOutline(dc, terrainTile);
                    tessellator.endRenderingTile(dc, terrainTile);
                }

            } finally {
                tessellator.endRendering(dc);
                gl.depthMask(true);
            }
        };

        ScreenImage.prototype.drawSquareWithImage = function (dc) {
            var gl = dc.currentGlContext, program, verts, idx = 0, scratchPosition = new WorldWind.Position(),
                scratchPoint = new Vec3(), scratchMatrix = new Matrix(), viewMatrix = new Matrix(), vbo, loc;

            // just need to draw a simple square, and then we'll add texture coordinates
            program = dc.findAndBindProgram(BasicTextureProgram);

            verts = new Float32Array(5 * 6);
            loc = this.boundaries[0];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            verts[idx++] = 0;
            verts[idx++] = 1;
            loc = this.boundaries[1];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            verts[idx++] = 1;
            verts[idx++] = 1;
            loc = this.boundaries[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            verts[idx++] = 1;
            verts[idx++] = 0;
            loc = this.boundaries[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            verts[idx++] = 1;
            verts[idx++] = 0;
            loc = this.boundaries[3];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            verts[idx++] = 0;
            verts[idx++] = 0;
            loc = this.boundaries[0];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            verts[idx++] = 0;
            verts[idx++] = 1;

            scratchPosition.latitude = 30;
            scratchPosition.longitude = -100;
            scratchPosition.altitude = 0;

            var bboxVerts = new Float32Array(6 * 3);
            idx = 0;
            loc = this.boundaries[0];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            bboxVerts[idx++] = scratchPoint[0];
            bboxVerts[idx++] = scratchPoint[1];
            bboxVerts[idx++] = scratchPoint[2];
            loc = this.boundaries[1];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            bboxVerts[idx++] = scratchPoint[0];
            bboxVerts[idx++] = scratchPoint[1];
            bboxVerts[idx++] = scratchPoint[2];
            loc = this.boundaries[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            bboxVerts[idx++] = scratchPoint[0];
            bboxVerts[idx++] = scratchPoint[1];
            bboxVerts[idx++] = scratchPoint[2];
            loc = this.boundaries[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            bboxVerts[idx++] = scratchPoint[0];
            bboxVerts[idx++] = scratchPoint[1];
            bboxVerts[idx++] = scratchPoint[2];
            loc = this.boundaries[3];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            bboxVerts[idx++] = scratchPoint[0];
            bboxVerts[idx++] = scratchPoint[1];
            bboxVerts[idx++] = scratchPoint[2];
            loc = this.boundaries[0];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, scratchPoint);
            bboxVerts[idx++] = scratchPoint[0];
            bboxVerts[idx++] = scratchPoint[1];
            bboxVerts[idx++] = scratchPoint[2];

            this.boundingBox.setToPoints(bboxVerts);

            //var o = WorldWind.EARTH_RADIUS;
            // find the largest distance from one point to another for scaling the orthographic projection matrix
            var x = -Number.MAX_VALUE, y = -Number.MAX_VALUE, z = -Number.MAX_VALUE, vx, vy, vz, wx, wy, wz;
            for (var i = 0; i < 6; i++) {
                vx = verts[i * 5];
                vy = verts[i * 5 + 1];
                vz = verts[i * 5 + 2];
                for (var j = 0; j < 6; j++) {
                    wx = verts[j * 5];
                    wy = verts[j * 5 + 1];
                    wz = verts[j * 5 + 2];

                    x = Math.max(x, Math.abs(vx - wx));
                    y = Math.max(y, Math.abs(vy - wy));
                    z = Math.max(z, Math.abs(vz - wz));
                }
            }
            var o = Math.sqrt(x * x + y * y + z * z) * Math.sqrt(2) / 2;
            var left = document.getElementById("left-plane").value * o;
            var right = document.getElementById("right-plane").value * o;
            var top = document.getElementById("top-plane").value * o;
            var bottom = document.getElementById("bottom-plane").value * o;
            var near = document.getElementById("near-plane").value * (o * 0.1);
            var far = document.getElementById("far-plane").value * (o * 0.1);
            var distance = document.getElementById("distance").value;
            document.getElementById("left-plane-label").innerText = left;
            document.getElementById("right-plane-label").innerText = right;
            document.getElementById("bottom-plane-label").innerText = bottom;
            document.getElementById("top-plane-label").innerText = top;
            document.getElementById("near-plane-label").innerText = near;
            document.getElementById("far-plane-label").innerText = far;
            document.getElementById("distance-label").innerText = distance;

            this.orthoMatrix.setToOrthographicProjection(left, right, bottom, top, near, far);
            this.orthoMatrix.multiplyByLookAtModelview(scratchPosition, distance, 0, 0, 0, dc.globe);

            program.loadModelviewProjection(gl, this.orthoMatrix);
            scratchMatrix.setToIdentity();
            program.loadTextureMatrix(gl, scratchMatrix);
            program.loadTextureEnabled(gl, true);
            program.loadColor(gl, Color.WHITE);
            program.loadOpacity(gl, 1);
            program.loadTextureUnit(gl, gl.TEXTURE0);

            var texture = dc.gpuResourceCache.resourceForKey("./data/400x230-splash-nww.png");
            if (!texture) {
                dc.gpuResourceCache.retrieveTexture(gl, "./data/400x230-splash-nww.png");
                return;
            }

            // short term test texture
            // var canvas = document.createElement("canvas");
            // canvas.setAttribute("width", "512");
            // canvas.setAttribute("height", "512");
            // canvas.setAttribute("id", "ortho-image");
            // var ctx = canvas.getContext("2d");
            // ctx.fillStyle = "rgb(255, 0, 0)";
            // ctx.fillRect(0, 0, 256, 256);
            // ctx.fillStyle = "rgb(0, 255, 0)";
            // ctx.fillRect(256, 0, 256, 256);
            // ctx.fillStyle = "rgb(0, 0, 255)";
            // ctx.fillRect(0, 256, 256, 256);
            // ctx.fillStyle = "rgb(255, 255, 255)";
            // ctx.fillRect(256, 256, 256, 256);
            // var texture = new WorldWind.Texture(gl, canvas);

            // add it to the page just for diagnostics
            // var pic = document.getElementById("ortho-image");
            // if (!pic) {
            //     document.body.appendChild(canvas);
            // }

            gl.activeTexture(gl.TEXTURE0);
            texture.bind(dc);

            vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 5 * 4, 0);
            gl.enableVertexAttribArray(program.vertexTexCoordLocation);
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);

            gl.disable(gl.CULL_FACE);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.enable(gl.CULL_FACE);

            gl.disableVertexAttribArray(program.vertexTexCoordLocation);
            gl.deleteBuffer(vbo);
        };

        ScreenImage.prototype.drawToTerrain = function (dc) {
            var gl = dc.currentGlContext, terrain = dc.terrain, program, terrainTiles = dc.terrain.surfaceGeometry,
                terrainTile, i, len, texture, scratchMatrix = new Matrix();

            if (!terrainTiles) {
                return;
            }

            var drawBoundingBox = document.getElementById("shape-bounding-box");
            if (drawBoundingBox && drawBoundingBox.checked) {
                this.boundingBox.render(dc);
            }

            var stencilEnabled = document.getElementById("stencil-clipping");
            stencilEnabled = stencilEnabled && stencilEnabled.checked;
            if (stencilEnabled) {
                this.beginStenciling(dc);
                this.drawVolume(dc);
                this.applyStencil(dc);
            }

            program = dc.findAndBindProgram(OrthoProgram);

            // gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            // draw the terrain with texture coordinates which map to the framebuffer texture
            //texture = this.framebuffer.texture;
            gl.activeTexture(gl.TEXTURE0);
            this.framebuffer.bind(dc);
            program.loadTextureUnit(gl, gl.TEXTURE0);

            len = terrainTiles.length;

            terrain.beginRendering(dc);

            for (i = 0; i < len; i++) {
                terrainTile = terrainTiles[i];

                if (!terrainTile || !terrainTile.transformationMatrix) {
                    continue;
                }

                var checkCulling = document.getElementById("bounding-box-culling");
                if (checkCulling && checkCulling.checked && !terrainTile.extent.intersectsBox(this.boundingBox)) {
                    continue; // skip this terrain tile
                }

                scratchMatrix.copy(this.orthoMatrix);
                scratchMatrix.setToMultiply(this.orthoMatrix, terrainTile.transformationMatrix);
                // scratchMatrix.multiplyByScale(0.5, 0.5, 1);
                // scratchMatrix.multiplyByTranslation(1, 1, 0);
                program.loadTextureMatrix(gl, scratchMatrix);

                terrain.beginRenderingTile(dc, terrainTile);
                terrain.renderTile(dc, terrainTile);
                terrain.endRenderingTile(dc, terrainTile);

            }

            terrain.endRendering(dc);

            if (stencilEnabled) {
                this.endStenciling(dc);
            }
        };

        // Internal. Intentionally not documented.
        ScreenImage.prototype.isVisible = function (dc) {
            if (dc.pickingMode) {
                return dc.pickRectangle && (this.imageBounds.intersects(dc.pickRectangle));
            } else {
                return this.imageBounds.intersects(dc.viewport);
            }
        };

        // Internal. Intentionally not documented.
        ScreenImage.prototype.drawOrderedScreenImage = function (dc) {
            this.beginDrawing(dc);
            try {
                this.doDrawOrderedScreenImage(dc);
            } finally {
                this.endDrawing(dc);
            }
        };

        // Internal. Intentionally not documented.
        ScreenImage.prototype.beginDrawing = function (dc) {
            var gl = dc.currentGlContext,
                program;

            dc.findAndBindProgram(BasicTextureProgram);

            // Configure GL to use the draw context's unit quad VBOs for both model coordinates and texture coordinates.
            // Most browsers can share the same buffer for vertex and texture coordinates, but Internet Explorer requires
            // that they be in separate buffers, so the code below uses the 3D buffer for vertex coords and the 2D
            // buffer for texture coords.
            program = dc.currentProgram;
            gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer());
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.enableVertexAttribArray(program.vertexTexCoordLocation);

            // Tell the program which texture unit to use.
            program.loadTextureUnit(gl, gl.TEXTURE0);
            program.loadModulateColor(gl, dc.pickingMode);

            // Turn off depth testing.
            gl.disable(gl.DEPTH_TEST);
        };

        // Internal. Intentionally not documented.
        ScreenImage.prototype.endDrawing = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            // Clear the vertex attribute state.
            gl.disableVertexAttribArray(program.vertexPointLocation);
            gl.disableVertexAttribArray(program.vertexTexCoordLocation);

            // Clear GL bindings.
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);

            // Re-enable depth testing.
            gl.enable(gl.DEPTH_TEST);
        };

        // Internal. Intentionally not documented.
        ScreenImage.prototype.doDrawOrderedScreenImage = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer3());
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

            // Compute and specify the MVP matrix.
            ScreenImage.matrix.copy(dc.screenProjection);
            ScreenImage.matrix.multiplyMatrix(this.imageTransform);

            ScreenImage.matrix.multiplyByTranslation(0.5, 0.5, 0.5); // shift Z to prevent image clipping
            ScreenImage.matrix.multiplyByRotation(1, 0, 0, this.imageTilt);
            ScreenImage.matrix.multiplyByRotation(0, 0, 1, this.imageRotation);
            ScreenImage.matrix.multiplyByTranslation(-0.5, -0.5, 0);

            program.loadModelviewProjection(gl, ScreenImage.matrix);

            // Enable texture for both normal display and for picking. If picking is enabled in the shader (set in
            // beginDrawing() above) then the texture's alpha component is still needed in order to modulate the
            // pick color to mask off transparent pixels.
            program.loadTextureEnabled(gl, true);

            // Set the pick color for picking or the color and opacity if not picking.
            if (dc.pickingMode) {
                this.pickColor = dc.uniquePickColor();
                program.loadColor(gl, this.pickColor);
                program.loadOpacity(gl, 1);
            } else {
                program.loadColor(gl, this.imageColor);
                program.loadOpacity(gl, this.opacity * this.layer.opacity);
            }

            this.texCoordMatrix.setToIdentity();
            this.texCoordMatrix.multiplyByTextureTransform(this.activeTexture);
            if (this.debug) {
                var sy = this.activeTexture.originalImageHeight / this.activeTexture.imageHeight;
                this.texCoordMatrix[5] = sy;
                this.texCoordMatrix[7] = 0;
            }
            program.loadTextureMatrix(gl, this.texCoordMatrix);

            if (this.activeTexture.bind(dc)) { // returns false if active texture cannot be bound
                // Draw the placemark's image quad.
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }

            if (this.debug) {
                this.drawToTerrain(dc);
            }
        };

        ScreenImage.prototype.drawVolume = function (dc) {
            var gl = dc.currentGlContext, scratchPoint = new Vec3();

            var verts = new Float32Array(3 * 8);
            var idx = 0;
            var loc = this.boundaries[0];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -10000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 100000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            loc = this.boundaries[1];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -10000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 100000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            loc = this.boundaries[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -10000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 100000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            loc = this.boundaries[3];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -10000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 100000, scratchPoint);
            verts[idx++] = scratchPoint[0];
            verts[idx++] = scratchPoint[1];
            verts[idx++] = scratchPoint[2];

            var elems = new Int16Array(3 * 6 * 2);
            idx = 0;
            // bottom
            elems[idx++] = 0;
            elems[idx++] = 4;
            elems[idx++] = 2;
            elems[idx++] = 4;
            elems[idx++] = 0;
            elems[idx++] = 6;
            // south side
            elems[idx++] = 0;
            elems[idx++] = 3;
            elems[idx++] = 1;
            elems[idx++] = 3;
            elems[idx++] = 0;
            elems[idx++] = 2;
            // east side
            elems[idx++] = 2;
            elems[idx++] = 5;
            elems[idx++] = 3;
            elems[idx++] = 5;
            elems[idx++] = 2;
            elems[idx++] = 4;
            // north side
            elems[idx++] = 4;
            elems[idx++] = 6;
            elems[idx++] = 5;
            elems[idx++] = 7;
            elems[idx++] = 5;
            elems[idx++] = 6;
            // west side
            elems[idx++] = 6;
            elems[idx++] = 1;
            elems[idx++] = 7;
            elems[idx++] = 1;
            elems[idx++] = 6;
            elems[idx++] = 0;
            // top
            elems[idx++] = 1;
            elems[idx++] = 3;
            elems[idx++] = 5;
            elems[idx++] = 5;
            elems[idx++] = 7;
            elems[idx++] = 1;

            var vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

            var ebo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elems, gl.STATIC_DRAW);

            var program = dc.findAndBindProgram(BasicProgram);

            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

            program.loadModelviewProjection(gl, dc.modelviewProjection);
            program.loadColor(gl, Color.RED);

            this.prepareStencil(dc);
            gl.drawElements(gl.TRIANGLES, elems.length, gl.UNSIGNED_SHORT, 0);

            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ebo);
        };

        ScreenImage.prototype.beginStenciling = function (dc) {
            var gl = dc.currentGlContext;

            gl.depthMask(false);
            gl.enable(gl.STENCIL_TEST);
            gl.disable(gl.CULL_FACE);
        };

        ScreenImage.prototype.prepareStencil = function (dc) {
            var gl = dc.currentGlContext;

            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.stencilFunc(gl.ALWAYS, 0, 255);
            gl.enable(gl.DEPTH_TEST);
            gl.colorMask(false, false, false, false);

            // z-fail
            gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.DECR_WRAP, gl.KEEP);
            gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.INCR_WRAP, gl.KEEP);
        };

        ScreenImage.prototype.applyStencil = function (dc) {
            var gl = dc.currentGlContext;

            // Enable the scene drawing
            gl.colorMask(true, true, true, true);

            // Apply the stencil test to drawing
            gl.stencilFunc(gl.NOTEQUAL, 0, 255);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP); // reset stencil to zero after successful fragment modification

            gl.disable(gl.DEPTH_TEST);
        };

        ScreenImage.prototype.endStenciling = function (dc) {
            var gl = dc.currentGlContext;

            gl.disable(gl.STENCIL_TEST);
            gl.depthMask(true);
        };

        return ScreenImage;
    })
;