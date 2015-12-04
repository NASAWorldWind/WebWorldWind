/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Texture
 * @version $Id: Texture.js 3414 2015-08-20 19:09:19Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../util/WWMath'
    ],
    function (ArgumentError,
              Logger,
              WWMath) {
        "use strict";

        /**
         * Constructs a texture for a specified image.
         * @alias Texture
         * @constructor
         * @classdesc Represents a WebGL texture. Applications typically do not interact with this class.
         * @param {WebGLRenderingContext} gl The current WebGL rendering context.
         * @param {Image} image The texture's image.
         * @throws {ArgumentError} If the specified WebGL context or image is null or undefined.
         */
        var Texture = function (gl, image) {
            if (!gl) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Texture", "constructor",
                    "missingGlContext"));
            }

            if (!image) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Texture", "constructor",
                    "missingImage"));
            }

            var textureId = gl.createTexture(),
                isPowerOfTwo = (WWMath.isPowerOfTwo(image.width) && WWMath.isPowerOfTwo(image.height));

            this.imageWidth = image.width;
            this.imageHeight = image.height;
            this.size = image.width * image.height * 4;
            this.originalImageWidth = this.imageWidth;
            this.originalImageHeight = this.imageHeight;

            gl.bindTexture(gl.TEXTURE_2D, textureId);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                isPowerOfTwo ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE);

            // Setup 4x anisotropic texture filtering when this feature is available.
            // https://www.khronos.org/registry/webgl/extensions/EXT_texture_filter_anisotropic
            var ext = (
                gl.getExtension("EXT_texture_filter_anisotropic") ||
                gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic"));
            if (ext) {
                gl.texParameteri(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
            }

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0,
                gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

            if (isPowerOfTwo) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }

            this.textureId = textureId;

            /**
             * The time at which this texture was created.
             * @type {Date}
             */
            this.creationTime = new Date();
        };

        /**
         * Disposes of the WebGL texture object associated with this texture.
         * @param gl
         */
        Texture.prototype.dispose = function (gl) {
            gl.deleteTexture(this.textureId);
            delete this.textureId;
        };

        /**
         * Binds this texture in the current WebGL graphics context.
         * @param {DrawContext} dc The current draw context.
         */
        Texture.prototype.bind = function (dc) {
            dc.currentGlContext.bindTexture(dc.currentGlContext.TEXTURE_2D, this.textureId);
            dc.frameStatistics.incrementTextureLoadCount(1);
            return true;
        };

        return Texture;
    });