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
            var w, h;
            for (var i = 0; i < this.textCredits.length; i++) {
                this.textCredits[i].makeOrderedRenderable(dc);
                w = this.textCredits[i].activeTexture.imageWidth;
                h = this.textCredits[i].activeTexture.imageHeight;
                this.textCredits[i].screenOffset.x = dc.viewport.width - w;
                this.textCredits[i].screenOffset.y = 100 + (i * 50);
            }
            for (i = 0; i < this.imageCredits.length; i++) {
                if (this.imageCredits[i].makeOrderedRenderable(dc) != null) {
                    w = this.imageCredits[i].activeTexture.imageWidth;
                    h = this.imageCredits[i].activeTexture.imageHeight;
                    this.imageCredits[i].screenOffset.x = dc.viewport.width - w;
                    this.imageCredits[i].screenOffset.y = 100 + i * 100;
                }
            }
            RenderableLayer.prototype.doRender.call(this, dc);
        };

        return ScreenCreditController;
    });