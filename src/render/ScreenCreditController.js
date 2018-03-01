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
        '../layer/RenderableLayer',
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
              RenderableLayer,
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
            RenderableLayer.call(this, "ScreenCreditController");

            // Internal. Intentionally not documented.
            this.imageCredits = [];

            // Internal. Intentionally not documented.
            this.textCredits = [];

            // Internal. Intentionally not documented.
            this.imageCreditSize = 64;

            // Internal. Intentionally not documented.
            this.margin = 5;

            // Internal. Intentionally not documented.
            this.creditSpacing = 22;

            // Internal. Intentionally not documented.
            this.opacity = 0.5;
        };

        ScreenCreditController.prototype = Object.create(RenderableLayer.prototype);

        /**
         * Clears all credits from this controller.
         */
        ScreenCreditController.prototype.clear = function (dc) {
            this.imageCredits = [];
            this.textCredits = [];
            this.removeAllRenderables();
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

            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0);
            var credit = new ScreenImage(screenOffset, imageUrl);

            credit.imageOffset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);

            this.imageCredits.push(credit);
            this.addRenderable(credit);
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

            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0);
            var credit = new ScreenText(screenOffset, stringCredit);

            credit.attributes.color = color;
            credit.attributes.enableOutline = false;
            credit.attributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0.5);

            this.textCredits.push(credit);
            this.addRenderable(credit);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.doRender = function (dc) {
            var j = 1;

            for (var i = 0; i < this.imageCredits.length; i++) {
                this.imageCredits[i].screenOffset.x = dc.viewport.width - (this.margin);
                this.imageCredits[i].screenOffset.y = j * this.creditSpacing;
                j++;
            }

            for (i = 0; i < this.textCredits.length; i++) {
                this.textCredits[i].screenOffset.x = dc.viewport.width - (this.margin);
                this.textCredits[i].screenOffset.y = j * this.creditSpacing;
                j++
            }

            RenderableLayer.prototype.doRender.call(this, dc);
        };

        return ScreenCreditController;
    });