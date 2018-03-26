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
        '../util/Color',
        '../util/Font',
        '../layer/Layer',
        '../util/Logger',
        '../util/Offset',
        '../shapes/ScreenImage',
        '../shapes/ScreenText'
    ],
    function (ArgumentError,
              Color,
              Font,
              Layer,
              Logger,
              Offset,
              ScreenImage,
              ScreenText) {
        "use strict";

        /**
         * Constructs a screen credit controller.
         * @alias ScreenCreditController
         * @constructor
         * @augments Layer
         * @classdesc Collects and displays screen credits.
         */
        var ScreenCreditController = function () {
            Layer.call(this, "ScreenCreditController");

            // Internal. Intentionally not documented.
            this.imageCredits = [];

            // Internal. Intentionally not documented.
            this.textCredits = [];

            // Internal. Intentionally not documented.
            this.margin = 5;

            // Internal. Intentionally not documented.
            this.creditSpacing = 21;

            // Internal. Intentionally not documented.
            this.opacity = 0.5;
        };

        ScreenCreditController.prototype = Object.create(Layer.prototype);

        /**
         * Clears all credits from this controller.
         */
        ScreenCreditController.prototype.clear = function () {
            this.imageCredits = [];
            this.textCredits = [];
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

            // Verify if image credit is not already in controller, if it is, don't add it.
            for (var i = 0, len = this.imageCredits.length; i < len; i++) {
                if (this.imageCredits[i].imageSource === imageUrl) {
                    return;
                }
            }

            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0);
            var credit = new ScreenImage(screenOffset, imageUrl);

            credit.imageOffset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);

            this.imageCredits.push(credit);
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

            // Verify if text credit is not already in controller, if it is, don't add it.
            for (var i = 0, len = this.textCredits.length; i < len; i++) {
                if (this.textCredits[i].text === stringCredit) {
                    return;
                }
            }

            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0);
            var credit = new ScreenText(screenOffset, stringCredit);

            credit.attributes.color = color;
            credit.attributes.enableOutline = false;
            credit.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);

            this.textCredits.push(credit);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.doRender = function (dc) {
            var creditOrdinal = 1,
                i,
                len;

            for (i = 0, len = this.imageCredits.length; i < len; i++) {
                this.imageCredits[i].screenOffset.x = dc.viewport.width - (this.margin);
                this.imageCredits[i].screenOffset.y = creditOrdinal * this.creditSpacing;
                this.imageCredits[i].render(dc);
                creditOrdinal++;
            }

            for (i = 0, len = this.textCredits.length; i < len; i++) {
                this.textCredits[i].screenOffset.x = dc.viewport.width - (this.margin);
                this.textCredits[i].screenOffset.y = creditOrdinal * this.creditSpacing;
                this.textCredits[i].render(dc);
                creditOrdinal++;
            }
        };

        return ScreenCreditController;
    });