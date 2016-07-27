/**
 * Created by Florin on 7/19/2016.
 */

define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        'use strict';

        /**
         * Constructs a texture cube map for the specified images.
         * @alias TextureCubeMap
         * @constructor
         * @classdesc Represents a WebGL texture cube map. Applications typically do not interact with this class.
         * @param {WebGLRenderingContext} gl The current WebGL rendering context.
         * @param {Image[]} images The texture's image.
         */
        var TextureCubeMap = function (gl, images) {

            if (!gl) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "TextureCubeMap", "constructor",
                    "missingGlContext"));
            }

            this.size = 0;

            this.textureId = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textureId);

            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            for (var i = 0; i < images.length; i++) {
                var target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
                var image = images[i];
                if (image === null) {
                    continue;
                }
                gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                this.size += (image.width * image.height * 4);
            }

            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

            this.creationTime = new Date();

        };

        /**
         * Binds this texture in the current WebGL graphics context.
         * @param {DrawContext} dc The current draw context.
         */
        TextureCubeMap.prototype.bind = function (dc) {
            dc.currentGlContext.bindTexture(dc.currentGlContext.TEXTURE_CUBE_MAP, this.textureId);
            dc.frameStatistics.incrementTextureLoadCount(1);
            return true;
        };

        return TextureCubeMap;

    });