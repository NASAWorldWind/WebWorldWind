/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports FramebufferTexture
 * @version $Id: FramebufferTexture.js 3345 2015-07-28 20:28:35Z dcollins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../util/WWMath'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs a framebuffer texture with the specified dimensions and an optional depth buffer. Use the
         * [DrawContext.bindFramebuffer]{@link DrawContext#bindFramebuffer} function to make the program current during rendering.
         *
         * @alias FramebufferTexture
         * @constructor
         * @classdesc Represents an off-screen WebGL framebuffer. The framebuffer has color buffer stored in a 32
         * bit RGBA texture, and has an optional depth buffer of at least 16 bits. Applications typically do not
         * interact with this class. WebGL framebuffers are created by instances of this class and made current when the
         * DrawContext.bindFramebuffer function is invoked.
         * @param {WebGLRenderingContext} gl The current WebGL rendering context.
         * @param {Number} width The width of the framebuffer, in pixels.
         * @param {Number} height The height of the framebuffer, in pixels.
         * @param {Boolean} depth true to configure the framebuffer with a depth buffer of at least 16 bits, false to
         * disable depth buffering.
         * @throws {ArgumentError} If the specified draw context is null or undefined, or if the width or height is less
         * than zero.
         */
        var FramebufferTexture = function (gl, width, height, depth) {
            if (!gl) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FramebufferTexture", "constructor",
                    "missingGlContext"));
            }

            if (width < 0 || height < 0) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FramebufferTexture", "constructor",
                    "The framebuffer width or height is less than zero."));
            }

            /**
             * The width of this framebuffer, in pixels.
             * @type {Number}
             * @readonly
             */
            this.width = width;

            /**
             * The height of this framebuffer, in pixels.
             * @type {Number}
             * @readonly
             */
            this.height = height;

            /**
             * Indicates whether or not this framebuffer has a depth buffer.
             * @type {Boolean}
             * @readonly
             */
            this.depth = depth;

            /**
             * Indicates the size of this framebuffer's WebGL resources, in bytes.
             * @type {Number}
             * @readonly
             */
            this.size = (width * height * 4) + (depth ? width * height * 2 : 0);

            /**
             * Indicates the WebGL framebuffer object object associated with this framebuffer texture.
             * @type {WebGLFramebuffer}
             * @readonly
             */
            this.framebufferId = gl.createFramebuffer();
            gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, this.framebufferId);

            // Internal. Intentionally not documented. Configure this framebuffer's color buffer.
            this.texture = gl.createTexture();
            gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
            gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER,
                WebGLRenderingContext.LINEAR);
            gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER,
                WebGLRenderingContext.LINEAR);
            gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S,
                WebGLRenderingContext.CLAMP_TO_EDGE);
            gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T,
                WebGLRenderingContext.CLAMP_TO_EDGE);
            gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, width, height, 0,
                WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, null);
            gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER, WebGLRenderingContext.COLOR_ATTACHMENT0,
                WebGLRenderingContext.TEXTURE_2D, this.texture, 0);

            // Internal. Intentionally not documented. Configure this framebuffer's optional depth buffer.
            this.depthBuffer = null;
            if (depth) {
                this.depthBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.depthBuffer);
                gl.renderbufferStorage(WebGLRenderingContext.RENDERBUFFER, WebGLRenderingContext.DEPTH_COMPONENT16,
                    width, height);
                gl.framebufferRenderbuffer(WebGLRenderingContext.FRAMEBUFFER, WebGLRenderingContext.DEPTH_ATTACHMENT,
                    WebGLRenderingContext.RENDERBUFFER, this.depthBuffer);
            }

            var e = gl.checkFramebufferStatus(WebGLRenderingContext.FRAMEBUFFER);
            if (e != WebGLRenderingContext.FRAMEBUFFER_COMPLETE) {
                Logger.logMessage(Logger.LEVEL_WARNING, "FramebufferTexture", "constructor",
                    "Error creating framebuffer: " + e);
                this.framebufferId = null;
                this.texture = null;
                this.depthBuffer = null;
            }

            gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
            gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, null);
            gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, null);
        };

        /**
         * Binds this off-screen framebuffer's texture in the current WebGL graphics context. This texture contains
         * color fragments resulting from WebGL operations executed when this framebuffer is bound by a call to
         * [FramebufferTexture.bindFramebuffer]{@link FramebufferTexture#bindFramebuffer}.
         *
         * @param {DrawContext} dc The current draw context.
         * @returns {Boolean} true if this framebuffer's texture was bound successfully, otherwise false.
         */
        FramebufferTexture.prototype.bind = function (dc) {
            if (this.texture) {
                dc.currentGlContext.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
            }

            return !!this.texture;
        };

        return FramebufferTexture;
    });