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
 * @exports ScreenCreditController
 */
define([
        '../error/ArgumentError',
        '../shaders/BasicTextureProgram',
        '../util/Color',
        '../util/Font',
        '../util/Logger',
        '../geom/Matrix',
        '../util/Offset',
        '../pick/PickedObject',
        '../render/Renderable',
        '../shapes/ScreenImage',
        '../shapes/ScreenText',
        '../shapes/TextAttributes',
        '../geom/Vec3',
        '../util/WWMath'
    ],
    function (ArgumentError,
              BasicTextureProgram,
              Color,
              Font,
              Logger,
              Matrix,
              Offset,
              PickedObject,
              Renderable,
              ScreenImage,
              ScreenText,
              TextAttributes,
              Vec3,
              WWMath) {
        "use strict";

        /**
         * Constructs a screen credit controller.
         * @alias ScreenCreditController
         * @constructor
         * @classdesc Collects and displays screen credits.
         */
        var ScreenCreditController = function () {
            // Internal. Intentionally not documented.
            this.imageCredits = [];

            // Internal. Intentionally not documented.
            this.stringCredits = [];

            // Internal. Intentionally not documented.
            this.imageCreditSize = 64;

            // Internal. Intentionally not documented.
            this.margin = 5;

            // Internal. Intentionally not documented.
            this.opacity = 0.5;

            this.textAttributes = new TextAttributes(null);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.scratchMatrix = Matrix.fromIdentity(); // scratch variable
        ScreenCreditController.imageTransform = Matrix.fromIdentity(); // scratch variable
        ScreenCreditController.texCoordMatrix = Matrix.fromIdentity(); // scratch variable

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.createStringCreditAttributes = function (textColor) {
            var attributes = new TextAttributes(null);
            attributes.color = textColor ? this.setDefaultOpacity(textColor) : new Color(1, 1, 1, 0.5);
            attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);
            attributes.enableOutline = false; // Screen credits display text without an outline by default
            return attributes;
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.setDefaultOpacity = function (textColor) {
            return new Color(textColor.red, textColor.green, textColor.blue, 0.5) // Set half transparency as default
        };

        /**
         * Clears all credits from this controller.
         */
        ScreenCreditController.prototype.clear = function () {
            this.imageCredits = [];
            this.stringCredits = [];
        };

        /**
         * Adds an image credit to this controller.
         * @param {String} imageUrl The URL of the image to display in the credits area.
         * @throws {ArgumentError} If the specified URL is null or undefined.
         */
        ScreenCreditController.prototype.addImageCredit = function (imageUrl) {
            if (!imageUrl) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addImageCredit", "missingUrl"));
            }

            var screenOffset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0);
            var screenImage = new ScreenImage(screenOffset, imageUrl);

            if (this.imageCredits.indexOf(screenImage) === -1) {
                this.imageCredits.push(screenImage);
            }
        };

        /**
         * Adds a string credit to this controller.
         * @param {String} stringCredit The string to display in the credits area.
         * @param (Color} color The color with which to draw the string.
         * @throws {ArgumentError} If either the specified string or color is null or undefined.
         */
        ScreenCreditController.prototype.addStringCredit = function (stringCredit, color) {
            if (!stringCredit) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addStringCredit", "missingText"));
            }

            if (!color) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addStringCredit", "missingColor"));
            }

            this.textAttributes = this.createStringCreditAttributes(color);

            var screenText = new ScreenText(this.textAttributes.offset, stringCredit);

            if (this.stringCredits.indexOf(screenText) === -1) {
                this.stringCredits.push(screenText);
            }
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.drawCredits = function (dc) {

            // Check to see if there's anything to draw.
            if ((this.imageCredits.length === 0 && this.stringCredits.length === 0)) {
                return;
            }

            // Picking not provided.
            if (dc.pickingMode) {
                return;
            }

            // Want to draw only once per frame.
            if (dc.timestamp === this.lastFrameTimestamp) {
                return;
            }
            this.lastFrameTimestamp = dc.timestamp;

            if (this.imageCredits.length !== 0) {
                for (var i = 0; i < this.imageCredits.length; i++) {
                    this.imageCredits[i].render(dc);
                }
            }

            if (this.stringCredits.length !== 0) {
                for (var j = 0; j < this.stringCredits.length; j++) {
                    this.stringCredits[j].render(dc);
                }
            }
        };

        return ScreenCreditController;
    });