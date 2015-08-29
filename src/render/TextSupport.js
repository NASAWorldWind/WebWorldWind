/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TextSupport
 * @version $Id: TextSupport.js 3302 2015-07-06 22:20:36Z dcollins $
 */
define([
        '../error/ArgumentError',
        '../shaders/BasicTextureProgram',
        '../util/Color',
        '../util/Logger',
        '../geom/Matrix',
        '../render/Texture',
        '../geom/Vec2'
    ],
    function (ArgumentError,
              BasicTextureProgram,
              Color,
              Logger,
              Matrix,
              Texture,
              Vec2) {
        "use strict";

        /**
         * Constructs a TextSupport instance.
         * @alias TextSupport
         * @constructor
         * @classdesc Provides methods useful for displaying text. An instance of this class is attached to the
         * World Window {@link DrawContext} and is not intended to be used independently of that. Applications typically do
         * not create instances of this class.
         */
        var TextSupport = function () {

            // Internal use only. Intentionally not documented.
            this.canvas2D = document.createElement("canvas");

            // Internal use only. Intentionally not documented.
            this.ctx2D = this.canvas2D.getContext("2d");

            // Internal use only. Intentionally not documented.
            this.lineSpacing = 0.15; // fraction of font size

            // Internal use only. Intentionally not documented.
            this.strokeStyle = "rgba(0, 0, 0, " + 0.5 + ")";

            // Internal use only. Intentionally not documented.
            this.strokeWidth = 4;
        };

        /**
         * Returns the width and height of a specified text string upon applying a specified font and optional outline.
         * @param {string} text The text string.
         * @param {Font} font The font to apply when drawing the text.
         * @param {Boolean} outline Indicates whether the text includes an outline, which increases its width and height.
         * @returns {Vec2} A vector indicating the text's width and height, respectively, in pixels.
         */
        TextSupport.prototype.textSize = function (text, font, outline) {
            if (text.length === 0) {
                return new Vec2(0, 0);
            }

            this.ctx2D.font = font.fontString;

            var lines = text.split("\n"),
                height = lines.length * (font.size * (1 + this.lineSpacing)),
                maxWidth = 0;

            for (var i = 0; i < lines.length; i++) {
                maxWidth = Math.max(maxWidth, this.ctx2D.measureText(lines[i]).width);
            }

            if (outline) {
                maxWidth += this.strokeWidth;
                height += this.strokeWidth;
            }

            return new Vec2(maxWidth, height);
        };

        /**
         * Creates a texture for a specified text string, a specified font and an optional outline.
         * @param {DrawContext} dc The current draw context.
         * @param {String} text The text string.
         * @param {Font} font The font to use.
         * @param {Boolean} outline Indicates whether the text is drawn with a thin black outline.
         * @returns {Texture} A texture for the specified text string and font.
         */
        TextSupport.prototype.createTexture = function (dc, text, font, outline) {
            var gl = dc.currentGlContext,
                ctx2D = this.ctx2D,
                canvas2D = this.canvas2D,
                textSize = this.textSize(text, font, outline),
                lines = text.split("\n"),
                strokeOffset = outline ? this.strokeWidth / 2 : 0,
                pixelScale = dc.pixelScale,
                x, y;

            canvas2D.width = Math.ceil(textSize[0]) * pixelScale;
            canvas2D.height = Math.ceil(textSize[1]) * pixelScale;

            ctx2D.scale(pixelScale, pixelScale);
            ctx2D.font = font.fontString;
            ctx2D.textBaseline = "top";
            ctx2D.textAlign = font.horizontalAlignment;
            ctx2D.fillStyle = Color.WHITE.toHexString(false);
            ctx2D.strokeStyle = this.strokeStyle;
            ctx2D.lineWidth = this.strokeWidth;
            ctx2D.lineCap = "round";
            ctx2D.lineJoin = "round";

            if (font.horizontalAlignment === "left") {
                ctx2D.translate(strokeOffset, 0);
            } else if (font.horizontalAlignment === "right") {
                ctx2D.translate(textSize[0] - strokeOffset, 0);
            } else {
                ctx2D.translate(textSize[0] / 2, 0);
            }

            for (var i = 0; i < lines.length; i++) {
                if (outline) {
                    ctx2D.strokeText(lines[i], 0, 0);
                }
                ctx2D.fillText(lines[i], 0, 0);
                ctx2D.translate(0, font.size * (1 + this.lineSpacing) + strokeOffset);
            }

            return new Texture(gl, canvas2D);
        };

        return TextSupport;
    });