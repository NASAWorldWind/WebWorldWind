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
            // this.opacity = 0.5;
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
            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0);
            var credit = new ScreenImage(screenOffset, imageUrl);
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
            var screenOffset = new Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0);
            var credit = new ScreenText(screenOffset, "Test");
            this.textCredits.push(credit);
            this.addRenderable(credit);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.doRender = function (dc) {
            var imageX = dc.viewport.width - (this.margin + this.imageCreditSize),
                imageHeight, maxImageHeight = 0;
            // var w, h;
            for (var i = 0; i < this.imageCredits.length; i++) {
                if (this.imageCredits[i].makeOrderedRenderable(dc) != null) {
                    imageHeight = this.computeImageCreditPlacement(this.imageCredits[i], imageX, this.margin);
                    if (imageHeight > 0) {
                        imageX -= (this.margin + this.imageCreditSize);
                        maxImageHeight = WWMath.max(imageHeight, maxImageHeight);
                    }
                }
            }

            // Draw the string credits above the image credits and progressing from bottom to top.
            var stringY = maxImageHeight + this.margin;

            for (i = 0; i < this.textCredits.length; i++) {
                this.textCredits[i].makeOrderedRenderable(dc);
                this.computeTextCreditPlacement(this.textCredits[i], stringY, dc.viewport.width);
                stringY += this.margin + 15; // margin + string height
            }

            RenderableLayer.prototype.doRender.call(this, dc);
        };

        ScreenCreditController.prototype.computeImageCreditPlacement = function (imageCredit, x, y) {
            var imageWidth, imageHeight, scale, screenImageOffset, offsetX, offsetY;

            // Scale the image to fit within a constrained size.
            imageWidth = imageCredit.activeTexture.imageWidth;
            imageHeight = imageCredit.activeTexture.imageHeight;
            if (imageWidth <= this.imageCreditSize && this.imageHeight <= this.imageCreditSize) {
                scale = 1;
            } else if (imageWidth >= imageHeight) {
                scale = this.imageCreditSize / imageWidth;
            } else {
                scale = this.imageCreditSize / imageHeight;
            }

            offsetX = x + (imageWidth * scale) / 2;
            offsetY = y + (imageHeight * scale) / 2;

            screenImageOffset = new Offset(WorldWind.OFFSET_PIXELS, offsetX, WorldWind.OFFSET_PIXELS, offsetY);
            imageCredit.screenOffset = screenImageOffset;
            imageCredit.scale = scale;

            return (imageHeight * scale) / 2;
        };

        ScreenCreditController.prototype.computeTextCreditPlacement = function (textCredit, y, viewportWidth) {
            var imageWidth, imageHeight, screenTextOffset, offsetX, offsetY;

            imageWidth = textCredit.imageWidth / 2;
            imageHeight = textCredit.imageHeight;
            offsetX = viewportWidth - (imageWidth + this.margin);
            offsetY = y + imageHeight;

            screenTextOffset = new Offset(WorldWind.OFFSET_PIXELS, offsetX, WorldWind.OFFSET_PIXELS, offsetY);
            textCredit.screenOffset = screenTextOffset;

            // return true;
        };

        return ScreenCreditController;
    });