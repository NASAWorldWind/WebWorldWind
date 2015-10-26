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

        /**
         * Calculates maximum line height based on a font
         * @param {Font} font The font to use.
         * @returns {Vec2} A vector indicating the text's width and height, respectively, in pixels based on the passed font.
         */
        TextSupport.prototype.getMaxLineHeight = function(font)
        {
            // Check underscore + capital E with acute accent
            return this.textSize("_\u00c9", font, 0)[1];
        };

        /**
         * Wraps the text based on width and height using new linew delimiter
         * @param {String} text The text to wrap.
         * @param {Number} width The width in pixels.
         * @param {Number} height The height in pixels.
         * @param {Font} font The font to use.
         * @returns {String} The wrapped text.
         */
        TextSupport.prototype.wrap = function(text, width, height, font)
        {
            if (!text) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.WARNING, "TextSupport", "wrap", "missing text"));
            }

            var i;

            var lines = text.split("\n");
            var wrappedText = "";

            // Wrap each line
            for (i = 0; i < lines.length; i++)
            {
                lines[i] = this.wrapLine(lines[i], width, font);
            }
            // Concatenate all lines in one string with new line separators
            // between lines - not at the end
            // Checks for height limit.
            var currentHeight = 0;
            var heightExceeded = false;
            var maxLineHeight = this.getMaxLineHeight(font);
            for (i = 0; i < lines.length && !heightExceeded; i++)
            {
                var subLines = lines[i].split("\n");
                for (var j = 0; j < subLines.length && !heightExceeded; j++)
                {
                    if (height <= 0 || currentHeight + maxLineHeight <= height)
                    {
                        wrappedText += subLines[j];
                        currentHeight += maxLineHeight + this.lineSpacing;
                        if (j < subLines.length - 1) {
                            wrappedText += '\n';
                        }
                    }
                    else
                    {
                        heightExceeded = true;
                    }
                }

                if (i < lines.length - 1 && !heightExceeded) {
                    wrappedText += '\n';
                }
            }
            // Add continuation string if text truncated
            if (heightExceeded)
            {
                if (wrappedText.length > 0) {
                    wrappedText = wrappedText.substring(0, wrappedText.length - 1);
                }

                wrappedText += "...";
            }

            return wrappedText;
        };

        /**
         * Wraps a line of text based on width and height
         * @param {String} text The text to wrap.
         * @param {Number} width The width in pixels.
         * @param {Font} font The font to use.
         * @returns {String} The wrapped text.
         */
        TextSupport.prototype.wrapLine = function(text, width, font)
        {
            var wrappedText = "";

            // Single line - trim leading and trailing spaces
            var source = text.trim();
            var lineBounds = this.textSize(source, font, 0);
            if (lineBounds[0] > width)
            {
                // Split single line to fit preferred width
                var line = "";
                var start = 0;
                var end = source.indexOf(' ', start + 1);
                while (start < source.length)
                {
                    if (end == -1) {
                        end = source.length;   // last word
                    }

                    // Extract a 'word' which is in fact a space and a word
                    var word = source.substring(start, end);
                    var linePlusWord = line + word;
                    if (this.textSize(linePlusWord, font, 0)[0] <= width)
                    {
                        // Keep adding to the current line
                        line += word;
                    }
                    else
                    {
                        // Width exceeded
                        if (line.length != 0)
                        {
                            // Finish current line and start new one
                            wrappedText += line;
                            wrappedText += '\n';
                            line = "";
                            line += word.trim();  // get read of leading space(s)
                        }
                        else
                        {
                            // Line is empty, force at least one word
                            line += word.trim();
                        }
                    }
                    // Move forward in source string
                    start = end;
                    if (start < source.length - 1)
                    {
                        end = source.indexOf(' ', start + 1);
                    }
                }
                // Gather last line
                wrappedText += line;
            }
            else
            {
                // Line doesn't need to be wrapped
                wrappedText += source;
            }

            return wrappedText;
        };

        return TextSupport;
    });