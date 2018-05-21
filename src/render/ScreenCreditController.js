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
        '../shapes/ScreenText'
    ],
    function (ArgumentError,
              Color,
              Font,
              Layer,
              Logger,
              Offset,
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
            this.credits = [];

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
            this.credits = [];
        };

        /**
         * Adds a credit to this controller.
         * @param {String} creditString The text to display in the credits area.
         * @param {Color} color The color with which to draw the string.
         * @param {String} hyperlinkUrl Optional argument if screen credit is intended to work as a hyperlink.
         * @throws {ArgumentError} If either the specified string or color is null or undefined.
         */
        ScreenCreditController.prototype.addCredit = function (creditString, color, hyperlinkUrl) {
            if (!creditString) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addCredit", "missingText"));
            }

            if (!color) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addCredit", "missingColor"));
            }

            // Verify if text credit is not already in controller, if it is, don't add it.
            for (var i = 0, len = this.credits.length; i < len; i++) {
                if (this.credits[i].text === creditString) {
                    return;
                }
            }

            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 11, WorldWind.OFFSET_PIXELS, 2);

            var credit = new ScreenText(screenOffset, creditString);
            credit.attributes.font = new Font(10);
            credit.attributes.color = color;
            credit.attributes.enableOutline = false;
            credit.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0);

            // Append new user property to store URL for hyperlinking.
            // (See BasicWorldWindowController.handleClickOrTap).
            if (hyperlinkUrl) {
                credit.userProperties.url = hyperlinkUrl;
            }

            this.credits.push(credit);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.doRender = function (dc) {
            var creditWidth = 0,
                i,
                len;

            for (i = 0, len = this.credits.length; i < len; i++) {
                this.credits[i].screenOffset.x += (creditWidth) * i;
                if (i < len - 1) {
                    this.credits[i].text += ", ";
                }
                creditWidth = dc.ctx2D.measureText(this.credits[i].text).width;
                this.credits[i].render(dc);
            }
        };

        return ScreenCreditController;
    });