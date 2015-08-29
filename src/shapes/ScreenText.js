/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ScreenText
 * @version $Id: ScreenText.js 3293 2015-06-30 18:20:17Z dcollins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../util/Offset',
        '../shapes/Text'
    ],
    function (ArgumentError,
              Logger,
              Offset,
              Text) {
        "use strict";

        /**
         * Constructs a screen text shape at a specified screen location.
         * @alias ScreenText
         * @constructor
         * @augments Text
         * @classdesc Represents a string of text displayed at a screen location.
         * <p>
         * See also {@link GeographicText}.
         *
         * @param {Offset} screenOffset The offset indicating the text's placement on the screen.
         * Use [TextAttributes.offset]{@link TextAttributes#offset} to position the text relative to the specified
         * screen offset.
         * @param {String} text The text to display.
         * @throws {ArgumentError} If either the specified screen offset or text is null or undefined.
         */
        var ScreenText = function (screenOffset, text) {
            if (!screenOffset) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Text", "constructor", "missingOffset"));
            }

            Text.call(this, text);

            /**
             * The offset indicating this text's placement on the screen.
             * The [TextAttributes.offset]{@link TextAttributes#offset} property indicates the relationship of the text
             * string to this location.
             * @type {Offset}
             */
            this.screenOffset = screenOffset;

            /**
             * Inherited from [Text]{@link Text#altitudeMode} but not utilized by screen text.
             */
            this.altitudeMode = null;
        };

        ScreenText.prototype = Object.create(Text.prototype);

        // Documented in superclass.
        ScreenText.prototype.render = function (dc) {
            // Ensure that this text is drawn only once per frame.
            if (this.lastFrameTime != dc.timestamp) {
                Text.prototype.render.call(this, dc);
            }
        };

        // Documented in superclass.
        ScreenText.prototype.computeScreenPointAndEyeDistance = function (dc) {
            var gl = dc.currentGlContext,
                offset = this.screenOffset.offsetForSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

            this.screenPoint[0] = offset[0];
            this.screenPoint[1] = offset[1];
            this.screenPoint[2] = 0;

            this.eyeDistance = 0;

            return true;
        };

        return ScreenText;
    });